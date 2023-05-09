function deleteTaskNow(taskId) {
  $.ajax({
    type: "DELETE",
    url: `/boards/delete/${taskId}`,
    success: function (data) {
      location.reload();
    },
    error: function (err) {
      console.log(err);
    }
  })
}