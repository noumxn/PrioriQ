
  let currentTaskId;
  let addpriority;
  let priority;
  let difficulty;
  let taskId;
  function showUpdateTaskForm(taskId, prior, diffic, assignedTwo, tName, desc) {
    if (diffic === "" && prior !== "") {
      addpriority = true;
      difficulty = null;
    }
    else {
      addpriority = false;
      priority = null;
    }

    const updateTaskDiv = document.getElementById('updateTaskForm');
    const updateTaskForm = document.getElementById('update-task-form');

    let taskName = document.getElementById("newtaskNameInput");
    if (addpriority == true) {
        priority = document.getElementById("newPriorityInput");
      }
      else {
        difficulty = document.getElementById("newDifficultyInput");
      }
  
  
      let estimatedTimeH = document.getElementById("newEstimatedTimeInputH");
      let estimatedTimeM = document.getElementById("newEstimatedTimeInputM");
      const deadline = document.getElementById("newDeadlineInput");
      const description = document.getElementById("newDescriptionInput");
      const assignedTo = document.getElementById("newAssignedToInput");
      taskName.value = tName;
      assignedTo.value = assignedTwo;
      description.value = desc;
  

    currentTaskId = taskId.toString();
    currentUsers = assignedTo.toString();

    if (updateTaskDiv.style.display === "none") {
      updateTaskDiv.style.display = "block";
    } else {
      updateTaskDiv.style.display = "none";
    }
  }

  function checkParams() {
    let tName = document.getElementById("newtaskNameInput");
    let err = document.getElementById("error");
    let priority;
    let difficulty;
    if (addpriority == true) {
      priority = document.getElementById("newPriorityInput");
      console.log(priority);
    }
    else {
      difficulty = document.getElementById("newDifficultyInput");
    }
    let estimatedTimeH = document.getElementById("newEstimatedTimeInputH");
    let estimatedTimeM = document.getElementById("newEstimatedTimeInputM");
    const deadline = document.getElementById("newDeadlineInput");
    const description = document.getElementById("newDescriptionInput");
    const assignedTo = document.getElementById("newAssignedToInput");
    let updateForm = document.getElementById('upTaskForm');
    if(updateForm){
      console.log("form found")
      if(tName.value.trim().length == 0){
        tName.focus();
        err.innerHTML = "Please input a new task name (Can be the same as original name)";
        return false;
      }
      if(tName.value.trim().length > 30){
        tName.focus();
        err.innerHTML = "New Task Name must be a string no longer than 30 characters";
        return false;
      }
      if(addpriority == true){
        let prio = parseInt(priority.value);
        if(isNaN(prio)){
          priority.focus();
          err.innerHTML = `Please input a number for priority`;
          return false;
        }
        if(prio < 1 || prio > 10){
          priority.focus();
          err.innerHTML = `Priority must be between 1 and 10`;
          return false;
        }
      }else{
        if(difficulty.value !== "veryEasy" &&
            difficulty.value !== "easy" &&
            difficulty.value !== "medium" &&
            difficulty.value !== "hard" &&
            difficulty.value !== "veryHard"){
          difficulty.focus();
          err.innerHTML = `Difficulty must be one of the following values: "veryEasy", "easy", "medium", "hard", "veryHard"`;
          return false;
        }
      }
    let numTimeH = parseInt(estimatedTimeH.value);
    let numTimeM = parseInt(estimatedTimeM.value);
    if(isNaN(numTimeH)){
      estimatedTimeH.focus();
      err.innerHTML = `Please input a number value for Estimated time (Hours)`;
      return false;
    }
    if(isNaN(numTimeM)){
      estimatedTimeM.focus();
      err.innerHTML = `Please input a number value for Estimated time (mins)`;
      return false;
    }
    if(numTimeH < 0 || numTimeH > 100){
      estimatedTimeH.focus();
      err.innerHTML = `Estimated Time must be between 0 and 100 hours`;
      return false;
    }
    if(numTimeM < 0 || numTimeM > 59){
      estimatedTimeM.focus();
      err.innerHTML = `Estimated Time must be between 0 and 59 minutes`;
      return false;
    }
    if(deadline.value.length == 0){
      deadline.focus();
      err.innerHTML = `Please input a value for new Deadline`
      return false;
    }
    let regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
    if(!regex.test(deadline.value)){
      deadline.focus();
      err.innerHTML = `Deadline needs to be in the the format: YYYY-MM-DDTHH:MM`
      return false;
    }
    if(description.value.trim().length == 0){
      description.focus();
      err.innerHTML = `Please input a value for new Description`;
      return false;
    }
    if(description.value.trim().length > 100 ){
      description.focus();
      err.innerHTML = `Description cannot be longer than 100 characters`;
      return false;
    }
    err.hidden = true;
    return true;

  }
  }

  function updateIt() {

    if(checkParams()){
    let taskName = document.getElementById("newtaskNameInput").value;
    let priority;
    let difficulty;

    if (addpriority == true) {
      priority = document.getElementById("newPriorityInput").value;
      console.log(priority);
    }
    else {
      difficulty = document.getElementById("newDifficultyInput").value;
    }


    let estimatedTimeH = document.getElementById("newEstimatedTimeInputH").value;
    let estimatedTimeM = document.getElementById("newEstimatedTimeInputM").value;
    const deadline = document.getElementById("newDeadlineInput").value;
    const description = document.getElementById("newDescriptionInput").value;
    const assignedTo = document.getElementById("newAssignedToInput").value;


    let updateFormData = {
      taskId: currentTaskId,
      taskName: taskName,
      priority: priority,
      difficulty: difficulty,
      estimatedTimeH: estimatedTimeH,
      estimatedTimeM: estimatedTimeM,
      deadline: deadline,
      description: description,
      assignedTo: assignedTo
    };


    const url = "/boards/update/" + currentTaskId;
    console.log(url);

    $.ajax({
      type: "POST",
      url: url,
      data: updateFormData,
      success: function (data) {
        document.getElementById('ajaxError').innerHTML = '';
        location.reload();
      },
      error: function (err) {
        console.log("yow");
        document.getElementById('ajaxError').innerHTML = '';
        console.log(err.responseJSON.message);
        document.getElementById('errorDiv').style.display = 'block';
        document.getElementById('ajaxError').style.display = 'block';
        let node = document.createTextNode(err.responseJSON.message);
        document.getElementById('ajaxError').appendChild(node);
        //location.reload();
      }
    })
}
  }
