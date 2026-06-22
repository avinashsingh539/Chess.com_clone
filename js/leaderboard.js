$(function () {

  var allPlayers = [];
  var sortKey    = 'rating';
  var sortAsc    = false;

  /* Load players from local JSON file */
  $.getJSON('data/leaderboard.json', function (data) {
    allPlayers = data;
    render();
  }).fail(function () {
    $('#lb-body').html('<tr><td colspan="6" class="no-results">Failed to load data.</td></tr>');
  });

  function render() {
    var query   = $('#lb-search').val().toLowerCase().trim();
    var players = allPlayers.slice();

    /* Filter by search */
    if (query) {
      players = players.filter(function (p) {
        return p.username.toLowerCase().includes(query);
      });
    }

    /* Sort */
    players.sort(function (a, b) {
      var diff = a[sortKey] - b[sortKey];
      return sortAsc ? diff : -diff;
    });

    if (!players.length) {
      $('#lb-body').html('<tr><td colspan="6" class="no-results">No players found.</td></tr>');
      return;
    }

    var html = '';
    players.forEach(function (p, i) {
      var total = p.wins + p.losses + p.draws;
      var wr    = total > 0 ? Math.round((p.wins / total) * 100) : 0;
      var rankDisplay = i < 3
        ? '<span class="rank-num top3">' + ['🥇','🥈','🥉'][i] + '</span>'
        : '<span class="rank-num">' + (i + 1) + '</span>';

      html +=
        '<tr>'
        + '<td>' + rankDisplay + '</td>'
        + '<td>' + p.country + ' <strong>' + p.username + '</strong></td>'
        + '<td><strong style="color:var(--green-primary);">' + p.rating + '</strong></td>'
        + '<td>' + p.wins + '</td>'
        + '<td>' + p.losses + '</td>'
        + '<td>'
        +   '<div class="wr-bar">'
        +     '<div class="wr-track"><div class="wr-fill" style="width:' + wr + '%"></div></div>'
        +     '<span class="wr-text">' + wr + '%</span>'
        +   '</div>'
        + '</td>'
        + '</tr>';
    });

    $('#lb-body').html(html);
  }

  /* Sort buttons */
  $('.lb-sort-btn').on('click', function () {
    var key = $(this).data('sort');
    if (sortKey === key) {
      sortAsc = !sortAsc;
    } else {
      sortKey = key;
      sortAsc = false;
    }
    $('.lb-sort-btn').removeClass('active');
    $(this).addClass('active');
    render();
  });

  /* Column header sort */
  $('#lb-table thead th[data-col]').on('click', function () {
    var col = $(this).data('col');
    if (sortKey === col) {
      sortAsc = !sortAsc;
    } else {
      sortKey = col;
      sortAsc = false;
    }
    $('#lb-table thead th').removeClass('sorted');
    $(this).addClass('sorted');
    render();
  });

  /* Live search */
  $('#lb-search').on('input', function () {
    render();
  });

});
