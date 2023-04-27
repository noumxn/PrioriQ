let registration = document.getElementById('registration-form');
let login = document.getElementById('login-form');

if (login) {
  let email = document.getElementById('emailAddressInput');
  let password = document.getElementById('passwordInput');
  let errorDiv = document.getElementById('error');
  let serverErr = document.getElementById("serverError");
  login.addEventListener('submit', (event) => {
    console.log('Form submission fired');
    //event.preventDefault();
    console.log('Has a form');
    if(serverErr !== null){
      serverErr.hidden = true;
    }
    let format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.value.trim().length == 0){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a Valid Email';
      email.focus();
    } else
    if(!email.value.match(format)){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Email is not correct format'
      email.focus();
    }else if(password.value.trim().length == 0){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a value for password'
      password.focus();
    }else
    if(password.value.trim().length < 6){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password must have at least 6 chars'
      password.focus();
    }else if(password.value.trim().length >20){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password cannot have more than 20 characters'
      password.focus();
    }else
    if(password.value.trim().match(/\s/)){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password cannot contain spaces'
      password.focus();
    } else if(!/[A-Z]/.test(password.value.trim()) || !/[0-9]/.test(password.value.trim()) || !/\W/.test(password.value.trim())){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password must have at least One uppercase letter, one number, and one special character'
      password.focus();
    }else{
      errorDiv.hidden=true;
    }
  });
}
if(registration){
  let email = document.getElementById('emailAddressInput');
  let password = document.getElementById('passwordInput');
  let firstName = document.getElementById('firstNameInput');
  let lastName = document.getElementById('lastNameInput');
  let passwordConfirm = document.getElementById('confirmPasswordInput');
  let username = document.getElementById('usernameInput');
  let dob = document.getElementById('dobInput');
  let errorDiv = document.getElementById('error');
  let serverErr = document.getElementById('serverError');
  registration.addEventListener('submit', (event) => {
    console.log('Form Submission Recieved');
    console.log('Has a form');
    if(serverErr !== null){
      serverErr.hidden = true;
    }
    let format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //Validate firstName input
    if(firstName.value.trim().length == 0){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please enter a value for first name'
      firstName.focus();
    }else if(/\d/.test(firstName.value.trim()) == true){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'First name cannot have numbers'
      firstName.focus();
    } else if(firstName.value.trim().length < 2 || firstName.value.trim().length > 25){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'First name must have between 2 and 25 chars'
      firstName.focus();
  }   else 
  //Validate last name
  if(lastName.value.trim().length === 0){
    event.preventDefault();
    errorDiv.hidden = false;
    errorDiv.innerHTML = 'Please input a value for last name'
    lastName.focus();
  }else
   if(/\d/.test(lastName.value.trim()) == true){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Last name cannot have numbers'
      lastName.focus();
  }   else if(lastName.value.trim().length < 2 || lastName.value.trim().length > 25){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Last name must have between 2 and 25 chars'
      lastName.focus();
  }else 
  //validate Email
  if(email.value.trim().length == 0){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input a value for email'
      email.focus()
    } else if(!format.test(email.value.trim())){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Email is not correct format'
      email.focus();
    }else 
    //Validate Dob input
    if(dob.value.length == 0){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input DOB'
      dob.focus();
    }else 
    //validate username
    if(username.value.trim().length ==0 ){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input username'
      username.focus();
    }else if(username.value.trim().length < 3){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Username must be at least 3 characters long.'
      username.focus();
    } else if(username.value.trim().length >20){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Username cannot be longer than 20 characters.'
      username.focus();
    }else
    if(!/^[a-zA-Z0-9_]+$/.test(username.value.trim())){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Username can only contain letters, numbers, and underscores.'
      username.focus();
    }else if(!/[a-zA-Z]/.test(username.value.trim())){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Username must contain at least 1 letter.'
      username.focus();
    }else if(password.value.trim().length == 0){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Please input value for password'
      password.focus();
    }else
    if(password.value.trim().length < 6){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password must have at least 6 chars'
      password.focus();
    }else if(password.value.trim().length > 20){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password cannot be longer than 20 chars'
      password.focus();
    }else 
    if(password.value.trim().match(/\s/)){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password cannot contain spaces'
      password.focus();
    } else if(!/[A-Z]/.test(password.value.trim()) || !/[0-9]/.test(password.value.trim()) || !/\W/.test(password.value.trim())){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password must have at least One uppercase letter, one number, and one special character'
      password.focus();
    } else if(password.value.trim() !== passwordConfirm.value.trim()){
      event.preventDefault();
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Password and Confirm Password must be the same'
      passwordConfirm.focus();
  }
    else{
    errorDiv.hidden = true;
    //registration.reset();
  }
});
}