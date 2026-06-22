$(function () {

  /* Switch to #signup tab if URL hash is #signup */
  if (window.location.hash === '#signup') switchTab('signup');

  /* Tab switching */
  $(document).on('click', '.auth-tab', function () {
    switchTab($(this).data('tab'));
  });

  function switchTab(tab) {
    $('.auth-tab').removeClass('active');
    $('[data-tab="' + tab + '"]').addClass('active');
    $('#form-login, #form-signup').hide();
    $('#form-' + tab).show();
    clearErrors();
  }

  function clearErrors() {
    $('.field-error').hide();
    $('input').removeClass('is-invalid is-valid');
    $('#err-login-general').text('');
  }

  /* Real-time validation on signup fields */
  $('#signup-username').on('input', function () {
    var val = $(this).val().trim();
    if (val.length < 3) {
      showError(this, '#err-signup-username', 'Username must be at least 3 characters.');
    } else {
      showValid(this, '#err-signup-username');
    }
  });

  $('#signup-email').on('input', function () {
    var val = $(this).val().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      showError(this, '#err-signup-email', 'Enter a valid email address.');
    } else {
      showValid(this, '#err-signup-email');
    }
  });

  $('#signup-password').on('input', function () {
    var val = $(this).val();
    if (val.length < 6) {
      showError(this, '#err-signup-password', 'Password must be at least 6 characters.');
    } else {
      showValid(this, '#err-signup-password');
    }
  });

  $('#signup-confirm').on('input', function () {
    if ($(this).val() !== $('#signup-password').val()) {
      showError(this, '#err-signup-confirm', 'Passwords do not match.');
    } else {
      showValid(this, '#err-signup-confirm');
    }
  });

  /* Login submit */
  $('#form-login').on('submit', function (e) {
    e.preventDefault();
    clearErrors();
    var username = $('#login-username').val().trim();
    var password = $('#login-password').val();
    var ok = true;

    if (!username) { showError('#login-username', '#err-login-username', 'Please enter your username.'); ok = false; }
    if (!password) { showError('#login-password', '#err-login-password', 'Please enter your password.'); ok = false; }

    if (!ok) return;

    var stored = JSON.parse(localStorage.getItem('chessUser') || 'null');
    if (!stored || stored.username !== username || stored.password !== password) {
      $('#err-login-general').text('Invalid username or password.');
      return;
    }

    showSuccess('Welcome back, ' + username + '!');
  });

  /* Signup submit */
  $('#form-signup').on('submit', function (e) {
    e.preventDefault();
    clearErrors();
    var username = $('#signup-username').val().trim();
    var email    = $('#signup-email').val().trim();
    var password = $('#signup-password').val();
    var confirm  = $('#signup-confirm').val();
    var ok = true;

    if (username.length < 3) { showError('#signup-username', '#err-signup-username', 'Username must be at least 3 characters.'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('#signup-email', '#err-signup-email', 'Enter a valid email address.'); ok = false; }
    if (password.length < 6) { showError('#signup-password', '#err-signup-password', 'Password must be at least 6 characters.'); ok = false; }
    if (password !== confirm) { showError('#signup-confirm', '#err-signup-confirm', 'Passwords do not match.'); ok = false; }

    if (!ok) return;

    var user = {
      username: username,
      email:    email,
      password: password,
      joined:   new Date().toLocaleDateString(),
      rating:   800,
      wins:     0,
      losses:   0,
      draws:    0
    };
    localStorage.setItem('chessUser', JSON.stringify(user));
    showSuccess('Account created! Welcome, ' + username + '!');
  });

  function showSuccess(msg) {
    $('#form-login, #form-signup').hide();
    $('#success-title').text('✅ Success');
    $('#success-msg').text(msg + ' Redirecting…');
    $('#auth-success').show();
    setTimeout(function () { window.location.href = 'profile.html'; }, 1800);
  }

  function showError(input, errId, msg) {
    $(input).addClass('is-invalid');
    $(errId).text(msg).show();
  }

  function showValid(input, errId) {
    $(input).removeClass('is-invalid').addClass('is-valid');
    $(errId).hide();
  }

});
