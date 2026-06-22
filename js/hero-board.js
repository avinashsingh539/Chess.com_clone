$(function () {

  var SQ = Math.max(42, Math.min(70, Math.floor((window.innerWidth - 300) / 9)));

  var PIECE_GLYPHS = {
    'K':'♔','Q':'♕','R':'♖','B':'♗','N':'♘','P':'♙',
    'k':'♚','q':'♛','r':'♜','b':'♝','n':'♞','p':'♟'
  };

  var START_POSITION = [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
  ];

  /* Scholar's Mate sequence: [fromRow, fromCol, toRow, toCol] */
  var MOVE_SEQUENCE = [
    [6,4,4,4], [1,4,3,4],
    [7,5,4,2], [0,1,2,2],
    [7,3,5,7], [0,6,2,5],
    [5,7,1,5]
  ];

  var board = [], moveIdx = 0, timer = null;

  var $boardEl    = $('#hero-board');
  var $filesTop   = $('#hero-files-top');
  var $filesBtm   = $('#hero-files-bottom');
  var $ranksLeft  = $('#hero-ranks-left');
  var $ranksRight = $('#hero-ranks-right');

  function buildLabels() {
    var files = ['a','b','c','d','e','f','g','h'];
    var fh = files.map(function(f){
      return '<div class="file-label" style="width:'+SQ+'px">'+f+'</div>';
    }).join('');
    var sp = '<div style="width:20px;display:inline-block;"></div>';
    $filesTop.html(sp + fh);
    $filesBtm.html(sp + fh);

    var lh = '', rh = '';
    for (var r = 0; r < 8; r++) {
      lh += '<div class="rank-label" style="height:'+SQ+'px">'+(8-r)+'</div>';
      rh += '<div class="rank-label" style="height:'+SQ+'px">'+(8-r)+'</div>';
    }
    $ranksLeft.html(lh);
    $ranksRight.html(rh);
  }

  function renderBoard(lastFrom, lastTo) {
    $boardEl.empty();
    $boardEl.css('--sq-size', SQ + 'px');

    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        var sqClass = (row + col) % 2 === 0 ? 'sq light' : 'sq dark';
        if (lastFrom && lastFrom[0]===row && lastFrom[1]===col) sqClass += ' last-from';
        if (lastTo   && lastTo[0]===row   && lastTo[1]===col)   sqClass += ' last-to';

        var piece = board[row][col], ph = '';
        if (piece) {
          var isWhite = piece === piece.toUpperCase();
          ph = '<span class="piece '+(isWhite?'white':'black')+'" style="font-size:'+Math.floor(SQ*0.80)+'px">'
             + PIECE_GLYPHS[piece] + '</span>';
        }
        $boardEl.append(
          '<div class="'+sqClass+'" data-row="'+row+'" data-col="'+col+'"'
          +' style="width:'+SQ+'px;height:'+SQ+'px;">'+ph+'</div>'
        );
      }
    }
  }

  function resetBoard() {
    board = START_POSITION.map(function(r){ return r.slice(); });
    moveIdx = 0;
    renderBoard(null, null);
  }

  function animateMove(move, callback) {
    var fr = move[0], fc = move[1], tr = move[2], tc = move[3];
    var $piece = $boardEl.find('.sq[data-row="'+fr+'"][data-col="'+fc+'"]').find('.piece');

    if (!$piece.length) { callback(); return; }

    $piece.css({
      transform:  'translate('+(tc-fc)*SQ+'px,'+(tr-fr)*SQ+'px)',
      transition: 'transform 0.22s cubic-bezier(0.25,0.46,0.45,0.94)',
      'z-index':  10
    });

    setTimeout(function () {
      board[tr][tc] = board[fr][fc];
      board[fr][fc] = '';
      renderBoard([fr,fc],[tr,tc]);
      callback();
    }, 250);
  }

  function playNextMove() {
    if (moveIdx >= MOVE_SEQUENCE.length) {
      clearInterval(timer);
      setTimeout(function () {
        resetBoard();
        timer = setInterval(playNextMove, 1600);
      }, 2500);
      return;
    }
    var move = MOVE_SEQUENCE[moveIdx++];
    animateMove(move, function () {});
  }

  function init() {
    $boardEl.css({
      '--sq-size': SQ + 'px',
      'grid-template-columns': 'repeat(8,'+SQ+'px)',
      'grid-template-rows':    'repeat(8,'+SQ+'px)'
    });
    buildLabels();
    resetBoard();
    setTimeout(function () {
      timer = setInterval(playNextMove, 1600);
    }, 1000);
  }

  init();

  $(window).on('resize', function () {
    clearInterval(timer);
    SQ = Math.max(42, Math.min(70, Math.floor((window.innerWidth - 300) / 9)));
    $boardEl.css({
      'grid-template-columns': 'repeat(8,'+SQ+'px)',
      'grid-template-rows':    'repeat(8,'+SQ+'px)'
    });
    buildLabels();
    resetBoard();
    setTimeout(function () {
      timer = setInterval(playNextMove, 1600);
    }, 800);
  });

});
