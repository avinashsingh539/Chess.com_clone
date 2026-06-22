$(function () {

  $('#sidebar-container').load('sidebar.html', function () {
    initTheme();
    highlightActivePage();
    initFlyouts();
    initMobileMenu();
    initSidebarSearch();
  });

  /* Theme */
  function initTheme() {
    applyTheme(localStorage.getItem('theme') || 'dark');
    $(document).on('click', '#theme-toggle', function () {
      var next = (localStorage.getItem('theme') || 'dark') === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }

  function applyTheme(theme) {
    $('body').toggleClass('light-theme', theme === 'light');
    $('#theme-toggle').text(theme === 'light' ? '☀' : '🌙');
  }

  /* Active nav highlight */
  function highlightActivePage() {
    var page = window.location.pathname.split('/').pop().replace('.html', '') || 'home';
    $('#main-nav .nav-link').each(function () {
      if ($(this).data('page') === page) $(this).addClass('active');
    });
  }

  /* Flyout menus */
  function initFlyouts() {
    $(document).on('click', '.has-flyout', function (e) {
      e.stopPropagation();
      var $btn     = $(this);
      var $flyout  = $('#' + $btn.data('flyout'));
      var $navItem = $btn.closest('.nav-item');
      var isOpen   = $flyout.hasClass('open');

      $('.flyout').not($flyout).removeClass('open');
      $('.nav-item').not($navItem).removeClass('flyout-open');

      if (!isOpen) {
        var top = $btn[0].getBoundingClientRect().top;
        $flyout.css({ top: top, bottom: 'auto' }).addClass('open');
        $navItem.addClass('flyout-open');
        if (top + $flyout.outerHeight() > window.innerHeight - 20) {
          $flyout.css({ top: 'auto', bottom: '10px' });
        }
      } else {
        $flyout.removeClass('open');
        $navItem.removeClass('flyout-open');
      }
    });

    $(document).on('click', function (e) {
      if (!$(e.target).closest('.flyout, .has-flyout').length) {
        $('.flyout').removeClass('open');
        $('.nav-item').removeClass('flyout-open');
      }
    });

    $(document).on('mouseenter', '.flyout', function () {
      $(this).addClass('open');
    });
  }

  /* Mobile hamburger */
  function initMobileMenu() {
    $(document).on('click', '#hamburger-btn', function () {
      $('#sidebar').toggleClass('mobile-open');
      $('#sidebar-overlay').toggleClass('visible');
    });
    $(document).on('click', '#sidebar-overlay', function () {
      $('#sidebar').removeClass('mobile-open');
      $('#sidebar-overlay').removeClass('visible');
    });
    $(document).on('click', '#sidebar .nav-link:not(.has-flyout)', function () {
      if ($(window).width() <= 768) {
        $('#sidebar').removeClass('mobile-open');
        $('#sidebar-overlay').removeClass('visible');
      }
    });
  }

  /* Sidebar search */
  function initSidebarSearch() {
    $(document).on('input', '#sidebar-search-input', function () {
      var q = $(this).val().toLowerCase().trim();
      $('#main-nav .nav-item').each(function () {
        $(this).toggle(!q || $(this).find('.nav-label').text().toLowerCase().includes(q));
      });
    });
  }

});
