const taskDescriptionInput = document.querySelectorAll('.taskDescription');
const addTaskButton = document.getElementById('add-task');
const tasksContainer = document.getElementById('todo-container');

function addTask() {
  console.log("in add task")
  const descriptionArray = Array.from(taskDescriptionInput);
  descriptionArray.forEach(function(description) {
    const taskDescription = description.innerHTML;
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = parseDescription(taskDescription);
    tasksContainer.appendChild(taskElement);
    description.value = '';
  })
}

function parseDescription(description) {
  console.log("parse")
  // Regular expression to match URLs in the description text
  const unescapeRegex = /<a\s[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g;
  let match = unescapeRegex.exec(description);
 // description.replace(unescapeRegex, "");
  const urlRegex = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
  return match.replace(urlRegex, '<a href="$1">$1</a>');
}

addTaskButton.addEventListener('click', addTask);