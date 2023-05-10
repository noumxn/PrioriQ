let boardUpdate = document.getElementById("boardsettings-form");
let blockForm = document.getElementById("blockUserForm");

function checkBoardName(name) {
  if (name === null || name.value.trim().length === 0) {
    name.focus();
    throw `Please input a value for Board Name`
  }
}
function checkSort(sort) {
  if (sort !== null) {
    if (sort.value.trim() !== 'asc' && sort.value.trim() !== 'desc') {
      sort.focus();
      throw `Sort order must be equal to either asc or desc`;
    }
  }
}
function checkPass(password) {
  if (password === null || password.value.trim().length === 0) {
    password.focus();
    throw `Please input a value for Password`;
  }
  if (password.value.trim().length < 6 || password.value.trim().length > 20) {
    password.focus();
    throw `Password must be between 6 and 20 characters`
  }
  if (/\s/.test(password.value)) {
    password.focus();
    throw `Password cannot contain spaces`;
  }
  if (!/[A-Z]/.test(password.value) || !/[0-9]/.test(password.value) || !/\W/.test(password.value)) {
    password.focus();
    throw `Password must have at least One uppercase letter, one number, and one special character`
  }
}

function checkUserName(username) {
  let user = username.value.trim().toLowerCase()
  if (user.length < 3) {
    username.focus();
    throw `Username needs to be at least 3 characters long.`;
  }
  if (user.length > 20) {
    username.focus();
    throw `Username can not be longer than 20 characters.`
  };
  let regex = /^[a-zA-Z0-9_.]+$/;
  if (!regex.test(user)) {
    username.focus();
    throw `The username can only contain alphabets, numbers, and underscores.`;
  }
  let regex2 = /[a-zA-Z]/;
  if (!regex2.test(user)) {
    username.focus();
    throw `Username must contain at least one alphabet.`;
  }

}

if (boardUpdate) {
  let bname = document.getElementById("boardNameInput");
  let sortOrder = document.getElementById("sortOrderInput");
  let password = document.getElementById("boardPasswordInput");
  let confirm = document.getElementById("confirmBoardPasswordInput");
  let error = document.getElementById("error");
  boardUpdate.addEventListener('submit', (event) => {
    let serverErr = document.getElementById("serverError");
    if (serverErr !== null) {
      serverErr.hidden = true;
    }
    error.hidden = true;
    try {
      checkBoardName(bname);
      checkSort(sortOrder);
      checkPass(password);
      if (password.value.trim() !== confirm.value.trim()) {
        confirm.focus();
        throw `Confirm password must be the same as Password`
      }
    } catch (e) {
      event.preventDefault();
      error.hidden = false;
      error.innerHTML = e;
    }
  })
}

if (blockForm) {
  let blockedUser = document.getElementById("blockUserInput");
  let error = document.getElementById("errorDiv");
  blockForm.addEventListener('submit', (event) => {
    console.log("form submitted")
    let serverErr = document.getElementById("serverError");
    if (serverErr !== null) {
      serverErr.hidden = true;
    }
    error.hidden = true;
    try {
      checkUserName(blockedUser);
    } catch (e) {
      event.preventDefault();
      error.hidden = false;
      error.innerHTML = e;
    }
  })
}