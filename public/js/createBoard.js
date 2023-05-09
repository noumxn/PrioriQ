let createBoard = document.getElementById('create-board-form');

if (createBoard) {
  let name = document.getElementById('boardNameInput');
  let password = document.getElementById('boardPasswordInput');
  let confirm = document.getElementById('boardConfirmPasswordInput');
  let sorting = document.getElementById('sortingInput');
  let sortingOrder = document.getElementById('sortOrderInput');
  let errorDiv = document.getElementById('error');
  let serverErr = document.getElementById("serverError");
  createBoard.addEventListener('submit', (event) => {
    if (serverErr !== null) {
      serverErr.hidden = true;
    }

    if (name.value.trim().length === 0) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a valid board name';
      name.focus();
    } else if (sorting.value.trim().length === 0) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a valid board name';
      sorting.focus();
    } else if (sorting.value.trim() !== 'true' && sorting.value.trim() !== 'false') {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a valid board name';
      sorting.focus();
    } else if (sortingOrder.value.trim().length === 0) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a valid board name';
      sortingOrder.focus();
    } else if (sortingOrder.value.trim() !== 'asc' && sortingOrder.value.trim() !== 'desc') {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a valid board name';
      sortingOrder.focus();
    } else if (password.value.trim().length === 0) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a value for password'
      password.focus();
    } else if (password.value.trim().length < 6) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password must have at least 6 chars'
      password.focus();
    } else if (password.value.trim().length > 20) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password cannot have more than 20 characters'
      password.focus();
    } else if (password.value.trim().match(/\s/)) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password cannot contain spaces'
      password.focus();
    } else if (!/[A-Z]/.test(password.value.trim()) || !/[0-9]/.test(password.value.trim()) || !/\W/.test(password.value.trim())) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password must have at least One uppercase letter, one number, and one special character'
      password.focus();
    } else if (confirm.value !== password.value) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password and Confirm Password must match';
      email.focus();
    } else {
      errorDiv.hidden = true;
    }
  });
}