let boardUpdate = document.getElementById("boardsettings-form");

function checkBoardName(name){
  if(name == null || name.value.trim().length == 0) {
    name.focus();
    throw `Please input a value for Board Name`
  }
}
function checkSort(sort){
  if(sort !== null){
    if(sort.value.trim() !== 'asc' &&sort.value.trim() !== 'desc'){
      sort.focus();
      throw `Sort order must be equal to either asc or desc`;
    }
  }
}
function checkPass(password){
  if(password == null || password.value.trim().length == 0){
    password.focus();
    throw `Please input a value for Password`;
  }
  if(password.value.trim().length < 6 || password.value.trim().length >20){
    password.focus();
    throw `Password must be between 6 and 20 characters`
  }
  if(/\s/.test(password.value)){
    password.focus();
    throw `Password cannot contain spaces`;
  }
  if(!/[A-Z]/.test(password.value) || !/[0-9]/.test(password.value) || !/\W/.test(password.value)){
    password.focus();
    throw `Password must have at least One uppercase letter, one number, and one special character`
  }
}

if(boardUpdate){
  let bname = document.getElementById("boardNameInput");
  let sortOrder = document.getElementById("sortOrderInput");
  let password = document.getElementById("boardPasswordInput");
  let confirm = document.getElementById("confirmBoardPasswordInput");
  let error = document.getElementById("errorDiv");
  boardUpdate.addEventListener('submit', (event) => {
    let serverErr = document.getElementById("serverError");
    if(serverErr !== null){
      serverErr.hidden = true;
    }
    error.hidden = true;
    try{
      checkBoardName(bname);
      checkSort(sortOrder);
      checkPass(password);
      if(password.value.trim() !== confirm.value.trim()){
        confirm.focus();
        throw `Confirm password must be the same as Password`
      }
    }catch(e){
      event.preventDefault();
      error.hidden = false;
      error.innerHTML = e;
    }
    
  })
}