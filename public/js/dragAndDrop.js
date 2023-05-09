function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  const taskId = event.target.dataset.taskId;
  event.dataTransfer.setData("text/plain", taskId);
  event.currentTarget.style.backgroundColor = "lightgray";
}

function drop(event, boardType) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");

  // Call the appropriate backend route based on the boardType parameter
  if (boardType === "todo") {
    fetch(`/boards/todo/${taskId}`, { method: "POST", headers: { 'Content-Type': 'application/json' }, location: '/homepage' })
      .then((response) => {
        window.location.reload();
      })
  } else if (boardType === "inprogress") {
    fetch(`/boards/inprogress/${taskId}`, { method: "POST" })
      .then((response) => {
        window.location.reload();
      })
  } else if (boardType === "done") {
    fetch(`/boards/done/${taskId}`, { method: "POST" })
      .then((response) => {
        window.location.reload();
      })
  }
}