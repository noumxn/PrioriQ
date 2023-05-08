let checkboxes = document.querySelectorAll(".checklistItem");
const checkboxArray = Array.from(checkboxes);
checkboxArray.forEach(function(checkbox) {
  const taskId = checkbox.id;
  checkbox.addEventListener('change', function() {
    fetch(`/homepage/checklist/${taskId}`, {
      method: 'POST'
    })
    .then(response => {

    })
    .catch(e => {

    });
  });
});