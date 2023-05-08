function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
  event.dataTransfer.setData("taskId", event.target.dataset.taskId);
}


function drop(event, boardType) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("taskId");

  // Call the appropriate backend route based on the boardType parameter
  if (boardType === "todo") {
    fetch(`/boards/todo /${taskId}`, { method: "POST" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error moving task to To-Do column");
        }
      })
      .then((data) => {
        // Refresh the board after successful move
        location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("Error moving task to To-Do column");
      });
  } else if (boardType === "inprogress") {
    fetch(`/boards/inprogress/${taskId}`, { method: "POST" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error moving task to In Progress column");
        }
      })
      .then((data) => {
        // Refresh the board after successful move
        location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("Error moving task to In Progress column");
      });
  } else if (boardType === "done") {
    fetch(`/boards/done/${taskId}`, { method: "POST" })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error moving task to Done column");
        }
      })
      .then((data) => {
        // Refresh the board after successful move
        location.reload();
      })
      .catch((error) => {
        console.error(error);
        alert("Error moving task to Done column");
      });
  }
}