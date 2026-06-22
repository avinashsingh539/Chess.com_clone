$(function () {

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

  function calcSQ() {
    return Math.max(40, Math.floor(Math.min(560, window.innerWidth - 320) / 9));
  }

  var SQ = calcSQ();

  function buildStaticBoard() {
    var $board = $('#static-board').empty();
    $board.css({
      'grid-template-columns': 'repeat(8,' + SQ + 'px)',
      'grid-template-rows':    'repeat(8,' + SQ + 'px)'
    });

    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        var piece = START[row][col];
        var ph = piece
          ? '<span class="piece '+(piece===piece.toUpperCase()?'white':'black')+'" style="font-size:'+Math.floor(SQ*0.78)+'px">'+GLYPHS[piece]+'</span>'
          : '';
        $board.append(
          '<div class="sq '+((row+col)%2===0?'light':'dark')+'" style="width:'+SQ+'px;height:'+SQ+'px;">'+ph+'</div>'
        );
      }
    }

    var files = ['a','b','c','d','e','f','g','h'];
    var fh = files.map(function(f){ return '<div class="file-label" style="width:'+SQ+'px">'+f+'</div>'; }).join('');
    var sp = '<div style="width:20px;display:inline-block;"></div>';
    $('#static-files-top, #static-files-bottom').html(sp + fh);

    var lh = '', rh = '';
    for (var r = 0; r < 8; r++) {
      lh += '<div class="rank-label" style="height:'+SQ+'px">'+(8-r)+'</div>';
      rh += '<div class="rank-label" style="height:'+SQ+'px">'+(8-r)+'</div>';
    }
    $('#static-ranks-left').html(lh);
    $('#static-ranks-right').html(rh);
  }

  function loadPlayerName() {
    var user = JSON.parse(localStorage.getItem('chessUser') || 'null');
    if (user && user.username) $('#player-name').text(user.username);
  }

  function initDemoModal() {
    $(document).on('click', '.play-option-card[href*="hotseat"]', function (e) {
      e.preventDefault();
      new bootstrap.Modal(document.getElementById('demoModal')).show();
    });
  }

  buildStaticBoard();
  loadPlayerName();
  initDemoModal();

  $(window).on('resize', function () {
    SQ = calcSQ();
    buildStaticBoard();
  });

});
