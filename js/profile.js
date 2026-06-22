$(function () {

  var $page = $('#profile-page');
  var user  = JSON.parse(localStorage.getItem('chessUser') || 'null');

  /* If not logged in, show guest prompt */
  if (!user) {
    $page.html(
      '<div class="guest-banner">'
      + '<div style="font-size:3rem;margin-bottom:14px;">♟</div>'
      + '<h2 style="margin-bottom:10px;">You\'re not logged in</h2>'
      + '<p style="color:var(--text-secondary);margin-bottom:20px;">Create an account to track your stats and progress.</p>'
      + '<a href="login.html#signup" class="btn-green">Sign Up Free</a>'
      + '&nbsp;&nbsp;<a href="login.html" class="btn-login" style="display:inline-block;padding:10px 24px;border-radius:30px;">Log In</a>'
      + '</div>'
    );
    return;
  }

  /* Derive some stats so the dashboard looks full */
  var total  = user.wins + user.losses + user.draws;
  var wr     = total > 0 ? Math.round((user.wins / total) * 100) : 0;
  var rating = user.rating || 800;

  /* Fake recent games based on stored stats */
  var RESULTS = ['Win','Loss','Draw','Win','Win','Loss','Win','Draw'];
  var OPPONENTS = ['GuestPlayer','KnightRider','ChessFan99','QuickMover','PawnPusher','TacticsBot','EndgamePro','MiddleGame'];
  var recentRows = '';
  for (var i = 0; i < 8; i++) {
    var res = RESULTS[i];
    var cls = res === 'Win' ? 'result-win' : res === 'Loss' ? 'result-loss' : 'result-draw';
    var ratingChange = res === 'Win' ? '+12' : res === 'Loss' ? '-10' : '+2';
    recentRows +=
      '<div class="recent-row">'
      + '<span>' + OPPONENTS[i] + '</span>'
      + '<span class="' + cls + '">' + res + '</span>'
      + '<span style="color:var(--text-muted);">' + ratingChange + '</span>'
      + '<span style="color:var(--text-muted);font-size:0.78rem;">' + (i + 1) + 'd ago</span>'
      + '</div>';
  }

  /* Win rate bar widths (capped at 100%) */
  var winsW   = total > 0 ? Math.round((user.wins   / total) * 100) : 0;
  var lossesW = total > 0 ? Math.round((user.losses / total) * 100) : 0;
  var drawsW  = total > 0 ? Math.round((user.draws  / total) * 100) : 0;

  $page.html(
    /* Profile header */
    '<div class="profile-header-card">'
    + '<div class="profile-avatar-lg">♟</div>'
    + '<div>'
    +   '<div class="profile-username">' + user.username + '</div>'
    +   '<div class="profile-joined">Joined ' + (user.joined || 'recently') + ' &nbsp;·&nbsp; ' + (user.email || '') + '</div>'
    + '</div>'
    + '<div class="profile-rating-badge">⭐ ' + rating + '</div>'
    + '</div>'

    /* Stats grid */
    + '<div class="stats-grid">'
    + statCard(total,  'Games Played')
    + statCard(user.wins,   'Wins')
    + statCard(user.losses, 'Losses')
    + statCard(user.draws,  'Draws')
    + statCard(wr + '%',    'Win Rate')
    + statCard(rating,      'Rating')
    + '</div>'

    /* Bar chart */
    + '<div class="chart-section">'
    + '<div class="chart-title">Result Breakdown</div>'
    + barRow('Wins',   winsW,   user.wins,   'wins')
    + barRow('Losses', lossesW, user.losses, 'losses')
    + barRow('Draws',  drawsW,  user.draws,  'draws')
    + '</div>'

    /* Recent games */
    + '<div class="recent-section">'
    + '<div class="recent-header">Recent Games</div>'
    + '<div class="recent-row" style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.05em;">'
    +   '<span>Opponent</span><span>Result</span><span>Rating Δ</span><span>When</span>'
    + '</div>'
    + recentRows
    + '</div>'

    /* Log out button */
    + '<div style="margin-top:20px;">'
    + '<button id="btn-logout" class="btn-control danger" style="padding:10px 24px;border-radius:8px;">Log Out</button>'
    + '</div>'
  );

  /* Animate bars after render */
  setTimeout(function () {
    $('.bar-fill').each(function () {
      $(this).css('width', $(this).data('w') + '%');
    });
  }, 100);

  $('#btn-logout').on('click', function () {
    localStorage.removeItem('chessUser');
    window.location.href = 'login.html';
  });

  function statCard(val, lbl) {
    return '<div class="stat-card"><div class="stat-val">' + val + '</div><div class="stat-lbl">' + lbl + '</div></div>';
  }

  function barRow(label, width, count, type) {
    return '<div class="bar-row">'
      + '<span class="bar-label">' + label + '</span>'
      + '<div class="bar-track"><div class="bar-fill ' + type + '" data-w="' + width + '" style="width:0%"></div></div>'
      + '<span class="bar-val">' + count + '</span>'
      + '</div>';
  }

});
