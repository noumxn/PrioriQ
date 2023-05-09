let login = document.getElementById('login-form');

if (login) {
  let username = document.getElementById('usernameInput');
  let password = document.getElementById('passwordInput');
  let errorDiv = document.getElementById('error');
  let serverErr = document.getElementById("serverError");
  login.addEventListener('submit', (event) => {
    if (serverErr !== null) {
      serverErr.hidden = true;
    }
    let name = username.value.trim();
    let pass = password.value.trim();

    if (name.length === 0) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a valid userName';
      username.focus();
    } else if (name.length < 3 || name.length > 20) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Username must be at least 3 characters or less than 20'
      username.focus();
    } else if (!/^[a-zA-Z0-9_.]+$/.test(name)) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Username can only contain letters, numbers, underscores, or periods.'
      username.focus();
    } else if (!/[a-zA-Z]/.test(name)) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Username must contain at least 1 letter.'
      username.focus();
    } else if (pass.length === 0) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a value for password'
      password.focus();
    } else if (pass.length < 6) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password must have at least 6 chars'
      password.focus();
    } else if (pass.length > 20) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password cannot have more than 20 characters'
      password.focus();
    } else if (pass.match(/\s/)) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password cannot contain spaces'
      password.focus();
    } else if (!/[A-Z]/.test(pass) || !/[0-9]/.test(pass) || !/\W/.test(pass)) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password must have at least One uppercase letter, one number, and one special character'
      password.focus();
    } else {
      errorDiv.hidden = true;
    }
  });
}