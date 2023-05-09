let searchBoard = document.getElementById("search-board-form");

if (searchBoard) {
  let searched = document.getElementById("searchBoardIdInput");
  let password = document.getElementById("searchBoardPasswordInput");
  let errorDiv = document.getElementById('error');
  let serverErr = document.getElementById("serverError");

  searchBoard.addEventListener('submit', (event) => {
    if (serverErr !== null) {
      serverErr.hidden = true;
    }
    let searchedTrim = searched.value.trim();
    let passTrim = password.value.trim();
    if (searchedTrim.length === 0) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a valid non-Empty ID BoardId';
      searched.focus();
    } else if (passTrim.length === 0) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a valid non-Empty password';
      password.focus();
    } else if (passTrim.length < 6) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password must have at least 6 chars'
      password.focus();
    } else if (passTrim.length > 20) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password cannot have more than 20 characters'
      password.focus();
    } else if (passTrim.match(/\s/)) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password cannot contain spaces'
      password.focus();
    } else if (!/[A-Z]/.test(passTrim) || !/[0-9]/.test(passTrim) || !/\W/.test(passTrim)) {
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password must have at least One uppercase letter, one number, and one special character'
      password.focus();
    } else {
      errorDiv.hidden = true;
    }
  })
}