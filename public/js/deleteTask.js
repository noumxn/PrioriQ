function deleteTaskNow(taskId) {
    $.ajax({
        type: "DELETE",
        url: `/boards/delete/${taskId}`,
        success: function(data) {
            location.reload();
        },
        error: function(err) {
            console.log(err);
        }
    })
}
/*
let checkboxes = document.querySelectorAll(".checklistItem");
console.log(checkboxes);
const checkboxArray = Array.from(checkboxes);
console.log(checkboxArray);
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
*/