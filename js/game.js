$(function () {

  /* Piece unicode glyphs */
  var GLYPHS = {
    'K':'♔','Q':'♕','R':'♖','B':'♗','N':'♘','P':'♙',
    'k':'♚','q':'♛','r':'♜','b':'♝','n':'♞','p':'♟'
  };

  var START = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
  ];

  var board, turn, selected, lastFrom, lastTo;
  var moveHistory, capturedByWhite, capturedByBlack;
  var timerWhite, timerBlack, timerInterval;
  var gameOver, mode;
  var SQ = 64;

  function init() {
    mode = new URLSearchParams(location.search).get('mode') || 'hotseat';
    board = START.map(function(r){ return r.slice(); });
    turn = 'w'; selected = null; lastFrom = null; lastTo = null;
    moveHistory = []; capturedByWhite = []; capturedByBlack = [];
    timerWhite = 600; timerBlack = 600; gameOver = false;

    clearInterval(timerInterval);
    timerInterval = setInterval(tickTimer, 1000);

    calcSQ(); buildLabels(); renderBoard();
    renderHistory(); renderCaptured(); updateStatus(); updateTimerDisplay();

    if (mode === 'bot') {
      $('#mode-badge').removeClass('demo-mode').addClass('bot-mode').text('🤖 vs Bot');
      $('#opp-name').text('Bot'); $('#opp-avatar').text('🤖');
    } else {
      $('#mode-badge').removeClass('bot-mode').addClass('demo-mode').text('👥 Hot-seat');
      $('#opp-name').text('Player 2'); $('#opp-avatar').text('👤');
    }

    var user = JSON.parse(localStorage.getItem('chessUser') || 'null');
    if (user && user.username) $('#player-name').text(user.username);
  }

  function calcSQ() {
    SQ = Math.max(44, Math.min(70, Math.floor((window.innerWidth - 340) / 9)));
    $('#game-board').css({
      'grid-template-columns': 'repeat(8,' + SQ + 'px)',
      'grid-template-rows':    'repeat(8,' + SQ + 'px)'
    });
  }

  /* Board rendering */
  function renderBoard() {
    var $b = $('#game-board').empty();
    for (var r=0; r<8; r++) {
      for (var c=0; c<8; c++) {
        var cls = 'sq ' + ((r+c)%2===0 ? 'light' : 'dark');
        if (selected && selected[0]===r && selected[1]===c) cls += ' selected';
        if (lastFrom && lastFrom[0]===r && lastFrom[1]===c) cls += ' last-from';
        if (lastTo   && lastTo[0]===r   && lastTo[1]===c)   cls += ' last-to';
        if (isInCheck(turn) && board[r][c] === (turn==='w'?'K':'k')) cls += ' in-check';

        var p = board[r][c], ph = '';
        if (p) ph = '<span class="piece '+(p===p.toUpperCase()?'white':'black')+'" style="font-size:'+Math.floor(SQ*0.78)+'px">'+GLYPHS[p]+'</span>';
        $b.append('<div class="'+cls+'" data-r="'+r+'" data-c="'+c+'" style="width:'+SQ+'px;height:'+SQ+'px;">'+ph+'</div>');
      }
    }
    if (selected) {
      legalMoves(selected[0], selected[1], board, turn).forEach(function(m) {
        $b.find('[data-r="'+m[0]+'"][data-c="'+m[1]+'"]').addClass(board[m[0]][m[1]] ? 'legal-capture' : 'legal-move');
      });
    }
  }

  function buildLabels() {
    var files = ['a','b','c','d','e','f','g','h'];
    var fh = files.map(function(f){ return '<div class="file-label" style="width:'+SQ+'px">'+f+'</div>'; }).join('');
    var sp = '<div style="width:20px;display:inline-block;"></div>';
    $('#game-files-top, #game-files-bottom').html(sp + fh);
    var lh='', rh='';
    for (var i=0;i<8;i++) {
      lh += '<div class="rank-label" style="height:'+SQ+'px">'+(8-i)+'</div>';
      rh += '<div class="rank-label" style="height:'+SQ+'px">'+(8-i)+'</div>';
    }
    $('#game-ranks-left').html(lh); $('#game-ranks-right').html(rh);
  }

  /* Click to move */
  $('#game-board').on('click', '.sq', function () {
    if (gameOver) return;
    if (mode === 'bot' && turn === 'b') return;

    var r = +$(this).data('r'), c = +$(this).data('c');
    var p = board[r][c];

    if (!selected) {
      if (p && isOwn(p, turn)) { selected = [r,c]; renderBoard(); }
      return;
    }

    if (p && isOwn(p, turn)) { selected = [r,c]; renderBoard(); return; }

    var valid = legalMoves(selected[0], selected[1], board, turn).some(function(m){ return m[0]===r && m[1]===c; });
    if (valid) doMove(selected[0], selected[1], r, c);
    else { selected = null; renderBoard(); }
  });

  function doMove(fr, fc, tr, tc) {
    var piece    = board[fr][fc];
    var captured = board[tr][tc];

    board[tr][tc] = piece;
    board[fr][fc] = '';

    if (piece === 'P' && tr === 0) board[tr][tc] = 'Q';
    if (piece === 'p' && tr === 7) board[tr][tc] = 'q';

    if (captured) {
      (isOwn(captured,'b') ? capturedByWhite : capturedByBlack).push(captured);
    }

    lastFrom = [fr,fc]; lastTo = [tr,tc];
    moveHistory.push({ notation: buildNotation(piece, fr, fc, tr, tc, captured), color: turn });
    selected = null;
    turn = turn === 'w' ? 'b' : 'w';

    renderBoard(); renderHistory(); renderCaptured(); updateStatus();

    if (isCheckmate(turn)) { endGame((turn==='w'?'Black':'White') + ' wins by checkmate!', turn==='w'?'♟':'♙'); return; }
    if (isStalemate(turn)) { endGame('Draw by stalemate!', '½'); return; }

    if (mode === 'bot' && turn === 'b') setTimeout(botMove, 400);
  }

  /* Bot: prefer captures, else random */
  function botMove() {
    if (gameOver) return;
    var all      = allLegalMoves('b');
    if (!all.length) return;
    var captures = all.filter(function(m){ return board[m[2]][m[3]] !== ''; });
    var pick     = (captures.length ? captures : all)[Math.floor(Math.random() * (captures.length || all.length))];
    doMove(pick[0], pick[1], pick[2], pick[3]);
  }

  function allLegalMoves(color) {
    var list = [];
    for (var r=0;r<8;r++) for (var c=0;c<8;c++) {
      if (board[r][c] && isOwn(board[r][c], color))
        legalMoves(r,c,board,color).forEach(function(m){ list.push([r,c,m[0],m[1]]); });
    }
    return list;
  }

  /* Move generation */
  function legalMoves(r, c, b, color) {
    return rawMoves(r, c, b).filter(function(m) {
      var copy = b.map(function(row){ return row.slice(); });
      copy[m[0]][m[1]] = copy[r][c]; copy[r][c] = '';
      if (copy[m[0]][m[1]] === 'P' && m[0]===0) copy[m[0]][m[1]] = 'Q';
      if (copy[m[0]][m[1]] === 'p' && m[0]===7) copy[m[0]][m[1]] = 'q';
      return !isInCheck(color, copy);
    });
  }

  function rawMoves(r, c, b) {
    var p = b[r][c]; if (!p) return [];
    var moves = [], pt = p.toLowerCase(), white = p === p.toUpperCase();

    function add(tr, tc) {
      if (tr<0||tr>7||tc<0||tc>7) return false;
      var t = b[tr][tc];
      if (t && isOwn(t, white?'w':'b')) return false;
      moves.push([tr,tc]); return !t;
    }

    function slide(dirs) {
      dirs.forEach(function(d){ for (var i=1;i<8;i++) if (!add(r+d[0]*i,c+d[1]*i)) break; });
    }

    if (pt==='p') {
      var dir = white?-1:1, startRow = white?6:1;
      if (r+dir>=0 && r+dir<=7 && !b[r+dir][c]) {
        moves.push([r+dir,c]);
        if (r===startRow && !b[r+2*dir][c]) moves.push([r+2*dir,c]);
      }
      [[dir,-1],[dir,1]].forEach(function(d){
        var tr=r+d[0],tc=c+d[1];
        if (tr>=0&&tr<=7&&tc>=0&&tc<=7&&b[tr][tc]&&!isOwn(b[tr][tc],white?'w':'b')) moves.push([tr,tc]);
      });
    } else if (pt==='n') {
      [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(function(d){ add(r+d[0],c+d[1]); });
    } else if (pt==='b') { slide([[-1,-1],[-1,1],[1,-1],[1,1]]); }
      else if (pt==='r') { slide([[-1,0],[1,0],[0,-1],[0,1]]); }
      else if (pt==='q') { slide([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]); }
      else if (pt==='k') { [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(function(d){ add(r+d[0],c+d[1]); }); }

    return moves;
  }

  /* Check / Checkmate / Stalemate detection */
  function isInCheck(color, b) {
    b = b || board;
    var king = color==='w'?'K':'k', kr=-1, kc=-1;
    for (var r=0;r<8;r++) for (var c=0;c<8;c++) if (b[r][c]===king) { kr=r; kc=c; }
    if (kr===-1) return false;
    var opp = color==='w'?'b':'w';
    for (var r2=0;r2<8;r2++) for (var c2=0;c2<8;c2++) {
      if (b[r2][c2] && isOwn(b[r2][c2],opp))
        if (rawMoves(r2,c2,b).some(function(m){ return m[0]===kr&&m[1]===kc; })) return true;
    }
    return false;
  }

  function isCheckmate(color) { return isInCheck(color) && allLegalMoves(color).length===0; }
  function isStalemate(color) { return !isInCheck(color) && allLegalMoves(color).length===0; }

  function isOwn(piece, color) {
    return color==='w' ? piece===piece.toUpperCase() : piece===piece.toLowerCase();
  }

  function buildNotation(piece, fr, fc, tr, tc, cap) {
    var f = 'abcdefgh';
    var pt = piece.toUpperCase();
    var prefix = pt==='P' ? (cap?f[fc]:'') : pt;
    return prefix + (cap?'x':'') + f[tc] + (8-tr);
  }

  /* UI */
  function updateStatus() {
    var $s = $('#status-bar').removeClass('check');
    if (isInCheck(turn)) $s.text((turn==='w'?'White':'Black')+' is in Check!').addClass('check');
    else $s.text((turn==='w'?'White':'Black')+"'s turn");
  }

  function renderHistory() {
    var $list = $('#move-history-list').empty();
    if (!moveHistory.length) { $list.html('<div style="padding:12px 14px;color:var(--text-muted);font-size:0.82rem;">No moves yet.</div>'); return; }
    var html = '';
    for (var i=0;i<moveHistory.length;i+=2) {
      var w = moveHistory[i]   ? '<span class="move-san">'+moveHistory[i].notation+'</span>'   : '';
      var b = moveHistory[i+1] ? '<span class="move-san">'+moveHistory[i+1].notation+'</span>' : '';
      html += '<div class="move-row"><span class="move-num">'+(Math.floor(i/2)+1)+'.</span>'+w+b+'</div>';
    }
    $list.html(html).scrollTop($list[0].scrollHeight);
  }

  function renderCaptured() {
    $('#captured-by-white').text(capturedByWhite.map(function(p){ return GLYPHS[p]; }).join(''));
    $('#captured-by-black').text(capturedByBlack.map(function(p){ return GLYPHS[p]; }).join(''));
  }

  /* Timers */
  function tickTimer() {
    if (gameOver) return;
    if (turn==='w') timerWhite--; else timerBlack--;
    updateTimerDisplay();
    if (timerWhite<=0) endGame('Black wins on time!','⏱');
    if (timerBlack<=0) endGame('White wins on time!','⏱');
  }

  function updateTimerDisplay() {
    function fmt(s){ return Math.floor(s/60)+':'+('0'+Math.max(0,s%60)).slice(-2); }
    $('#timer-white').text(fmt(timerWhite)).toggleClass('active',turn==='w'&&!gameOver).toggleClass('low-time',timerWhite<=30);
    $('#timer-black').text(fmt(timerBlack)).toggleClass('active',turn==='b'&&!gameOver).toggleClass('low-time',timerBlack<=30);
  }

  /* Game over */
  function endGame(msg, icon) {
    gameOver = true;
    clearInterval(timerInterval);
    $('#status-bar').text(msg);
    $('#game-over-title').text('Game Over');
    $('#game-over-msg').text(msg);
    $('#game-over-icon').text(icon||'♟');
    new bootstrap.Modal(document.getElementById('gameOverModal')).show();
  }

  /* Controls */
  $('#btn-new-game, #game-over-new').on('click', function () {
    var inst = bootstrap.Modal.getInstance(document.getElementById('gameOverModal'));
    if (inst) inst.hide();
    init();
  });

  $('#btn-resign').on('click', function () {
    if (!gameOver) endGame((turn==='w'?'White':'Black')+' resigned!','⚑');
  });

  $(window).on('resize', function () { calcSQ(); buildLabels(); renderBoard(); });

  init();

});
