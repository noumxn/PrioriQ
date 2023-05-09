
  let currentTaskId;
  let addpriority;
  let priority;
  let difficulty;
  let taskId;
  function showUpdateTaskForm(taskId, prior, diffic, assignedTwo, tName, desc) {
    console.log("hi");
    if (diffic === "" && prior !== "") {
      addpriority = true;
      difficulty = null;
    }
    else {
      addpriority = false;
      priority = null;
    }
    console.log(addpriority);

    const updateTaskDiv = document.getElementById('updateTaskForm');
    const updateTaskForm = document.getElementById('update-task-form');

    let taskName = document.getElementById("newtaskNameInput");
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
      taskName.value = tName;
      assignedTo.value = assignedTwo;
      description.value = desc;
  

    currentTaskId = taskId.toString();
    currentUsers = assignedTo.toString();
    console.log("task id is", taskId);

    if (updateTaskDiv.style.display === "none") {
      updateTaskDiv.style.display = "block";
    } else {
      updateTaskDiv.style.display = "none";
    }
  }

  function updateIt() {

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

