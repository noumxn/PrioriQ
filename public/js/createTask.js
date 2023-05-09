//import { error } from "ajv/dist/vocabularies/applicator/dependencies";

//DOM for checking inputs
let taskForm = document.getElementById('create-task-form');

function checkTaskName(name) {
  if (name.value.trim().length === 0) {
    name.focus();
    throw `Please input a value for name`
  }
  if (name.value.trim().length > 30) {
    name.focus();
    throw `Name of task cannot exceed 30 chars`;
  }
};
function checkDescription(thing) {
  if (thing.value.trim().length === 0) {
    thing.focus();
    throw `Please input a description for the task`;
  }
  if (thing.value.trim().length > 100) {
    thing.focus();
    throw `Description of task cannot exceed 100 chars`;
  }
};
function checkDifficulty(diff) {
  if (diff.value !== "veryEasy" &&
    diff.value !== "easy" &&
    diff.value !== "medium" &&
    diff.value !== "hard" &&
    diff.value !== "veryHard") {
    diff.focus();
    throw `Difficulty must be one of the following values: "veryEasy", "easy", "medium", "hard", "veryHard".`
  }
};
function checkDate(date) {
  let regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
  if (!regex.test(date.value)) {
    date.focus();
    throw `Deadline needs to be in the the format: YYYY-MM-DDTHH:MM`
  }
};
function checkTime(time, type) {
  let numTime = parseInt(time.value);
  if (isNaN(numTime)) {
    time.focus();
    throw `Minutes must be between 0 and 59`;
  }
  if (type === 'hour') {
    if (time < 0 || time > 100) {
      time.focus();
      throw `Hours must be between 0 and 100`;
    }
  }
};
function checkPriority(priority) {
  let prio = parseInt(priority.value);
  if (isNaN(prio)) {
    priority.focus();
    throw `Please provide a valid input for priority`;
  }
  if (prio < 1 || prio > 10) {
    priority.focus();
    throw `Priority must be between 1 and 10`;
  }
}


// function load(obj) {
//   let xhttp = new XMLHttpRequest();
//   xhttp.onreadystatechange = function () {
//     if(this.readyState === 4 && this.status === 200){
//       document.getElementById("container1").innerHTML = "hello";
//     }
//   };
//   xhttp.open("POST", window.location.href.toString(), true);
//   if(Object.keys(obj).includes("prio")){
//     xhttp.send(`taskNameInput=${obj.taskName.value}&priorityInput=${obj.prio.value}&estimatedTimeInputH=${obj.estTimeH.value}&estimatedTimeInputM=${obj.estTimeM.value}&deadlineInput=${obj.deadline.value}&assignedToInput=${obj.assigned.value}`);
//   }else{

//   }
// }
if (taskForm) {
  let taskName = document.getElementById('taskNameInput');
  let taskDesc = document.getElementById('descriptionInput');
  let prio = document.getElementById('priorityInput');
  let diff = document.getElementById('difficultyInput');
  let estTimeH = document.getElementById('estimatedTimeInputH');
  let estTimeM = document.getElementById('estimatedTimeInputM');
  let deadline = document.getElementById('deadlineInput');
  let assigned = document.getElementById('assignedToInput');
  let errorArea = document.getElementById('error');
  // let sendObj;
  // if(prio){
  //   sendObj = {taskName, taskDesc, prio, estTimeH, estTimeM, deadline, assigned};
  // }else{
  //   sendObj = {taskName, taskDesc, diff, estTimeH, estTimeM, deadline, assigned};
  // }
  //let taskArea = document.getElementById('ToDo');
  taskForm.addEventListener('submit', (event) => {
    console.log("form Submission fired");
    let serverErr = document.getElementById("serverError");
    if(serverErr == false){
      serverErr.hidden = true;
    }
    try {
      checkTaskName(taskName);
      if (prio) {
        checkPriority(prio);
      } else {
        checkDifficulty(diff);
      }
      checkTime(estTimeH, 'hour');
      checkTime(estTimeM, 'min');
      checkDate(deadline);
      checkDescription(taskDesc);
      //load(sendObj);
    } catch (e) {
      event.preventDefault();
      errorArea.hidden = false;
      errorArea.innerHTML = e;
    }
    //load();
  });
}
