$(function () {

  var GLYPHS = {
    'K':'♔','Q':'♕','R':'♖','B':'♗','N':'♘','P':'♙',
    'k':'♚','q':'♛','r':'♜','b':'♝','n':'♞','p':'♟'
  };

  /* 5 puzzles — each has a board position, whose turn, and the one correct move */
  var PUZZLES = [
    {
      title: 'Back Rank Mate',
      desc:  'White to move — deliver checkmate in 1',
      turn:  'w',
      board: [
        ['','','','','','r','k',''],
        ['','','','','','p','p','p'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','R','','','K','']
      ],
      solution: [7,3,0,3]
    },
    {
      title: 'Queen Fork',
      desc:  'White to move — win material with a fork',
      turn:  'w',
      board: [
        ['r','','','','k','','','r'],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','Q','','','K','']
      ],
      solution: [7,3,1,3]
    },
    {
      title: 'Rook Checkmate',
      desc:  'White to move — checkmate with the rook',
      turn:  'w',
      board: [
        ['','','','','k','','',''],
        ['','','','','','','',''],
        ['','','','','K','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['R','','','','','','','']
      ],
      solution: [7,0,0,0]
    },
    {
      title: 'Pin & Win',
      desc:  'Black to move — exploit the pin',
      turn:  'b',
      board: [
        ['','','','','k','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','','','',''],
        ['','','','','K','','r','']
      ],
      solution: [7,6,7,4]
    },
    {
      title: 'Scholar\'s Mate Finish',
      desc:  'White to move — checkmate in 1',
      turn:  'w',
      board: [
        ['r','n','b','q','k','b','n','r'],
        ['p','p','p','p','','Q','p','p'],
        ['','','','','','','',''],
        ['','','','','p','','',''],
        ['','','B','','P','','',''],
        ['','','','','','','',''],
        ['P','P','P','P','','P','P','P'],
        ['R','N','B','','K','','N','R']
      ],
      solution: [1,5,1,5]
    }
  ];

  var current = 0;
  var selected = null;
  var solved = [];
  var SQ = 64;

  function calcSQ() {
    SQ = Math.max(44, Math.min(68, Math.floor((window.innerWidth - 360) / 9)));
    $('#puzzle-board').css({
      'grid-template-columns': 'repeat(8,' + SQ + 'px)',
      'grid-template-rows':    'repeat(8,' + SQ + 'px)'
    });
  }

  function buildLabels() {
    var files = ['a','b','c','d','e','f','g','h'];
    var fh = files.map(function(f){ return '<div class="file-label" style="width:'+SQ+'px">'+f+'</div>'; }).join('');
    var sp = '<div style="width:20px;display:inline-block;"></div>';
    $('#pz-files-top, #pz-files-bottom').html(sp + fh);
    var lh='', rh='';
    for (var i=0;i<8;i++) {
      lh += '<div class="rank-label" style="height:'+SQ+'px">'+(8-i)+'</div>';
      rh += '<div class="rank-label" style="height:'+SQ+'px">'+(8-i)+'</div>';
    }
    $('#pz-ranks-left').html(lh);
    $('#pz-ranks-right').html(rh);
  }

  function renderBoard() {
    var pz = PUZZLES[current];
    var $b = $('#puzzle-board').empty();

    for (var r=0;r<8;r++) {
      for (var c=0;c<8;c++) {
        var cls = 'sq ' + ((r+c)%2===0 ? 'light' : 'dark');
        if (selected && selected[0]===r && selected[1]===c) cls += ' selected';

        var p = pz.board[r][c], ph = '';
        if (p) {
          var wh = p === p.toUpperCase();
          ph = '<span class="piece '+(wh?'white':'black')+'" style="font-size:'+Math.floor(SQ*0.78)+'px">'+GLYPHS[p]+'</span>';
        }
        $b.append('<div class="'+cls+'" data-r="'+r+'" data-c="'+c+'" style="width:'+SQ+'px;height:'+SQ+'px;">'+ph+'</div>');
      }
    }
  }

  function renderDots() {
    var html = '';
    for (var i=0;i<PUZZLES.length;i++) {
      var cls = 'dot';
      if (solved.indexOf(i) !== -1) cls += ' solved';
      else if (i === current) cls += ' current';
      html += '<div class="'+cls+'"></div>';
    }
    $('#pz-dots').html(html);
  }

  function loadPuzzle(idx) {
    current = idx;
    selected = null;
    var pz = PUZZLES[idx];
    $('#pz-meta').text('Puzzle ' + (idx+1) + ' of ' + PUZZLES.length);
    $('#pz-title').text(pz.title);
    $('#pz-desc').text(pz.desc);
    $('#pz-feedback').text('Select a piece to begin.').css('color','var(--text-muted)');
    $('#btn-next-puzzle').hide();
    calcSQ();
    buildLabels();
    renderBoard();
    renderDots();
  }

  /* Click to move */
  $('#puzzle-board').on('click', '.sq', function () {
    if (solved.indexOf(current) !== -1) return;

    var pz = PUZZLES[current];
    var r = +$(this).data('r'), c = +$(this).data('c');
    var p = pz.board[r][c];

    if (!selected) {
      var isCorrectColor = pz.turn === 'w' ? (p && p === p.toUpperCase()) : (p && p === p.toLowerCase());
      if (isCorrectColor) { selected = [r,c]; renderBoard(); }
      return;
    }

    var sol = pz.solution;
    if (selected[0]===sol[0] && selected[1]===sol[1] && r===sol[2] && c===sol[3]) {
      /* Correct */
      pz.board[r][c] = pz.board[selected[0]][selected[1]];
      pz.board[selected[0]][selected[1]] = '';
      selected = null;
      solved.push(current);
      renderBoard();
      renderDots();
      $('#pz-feedback').text('✅ Correct! Well done.').css('color','var(--green-primary)');
      if (current < PUZZLES.length - 1) $('#btn-next-puzzle').show();
      else $('#pz-feedback').append(' 🎉 All puzzles complete!');
    } else {
      /* Wrong */
      selected = null;
      renderBoard();
      $('#pz-feedback').text('❌ Not quite — try again.').css('color','#e05252');
    }
  });

  $('#btn-next-puzzle').on('click', function () {
    loadPuzzle(current + 1);
  });

  $('#btn-restart').on('click', function () {
    solved = [];
    PUZZLES.forEach(function(pz, i) {
      /* reset boards back to originals */
      PUZZLES[i] = jQuery.extend(true, {}, PUZZLES[i]);
    });
    location.reload();
  });

  $(window).on('resize', function () {
    calcSQ(); buildLabels(); renderBoard();
  });

  loadPuzzle(0);

});
