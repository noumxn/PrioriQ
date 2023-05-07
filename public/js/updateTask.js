const updateForm = document.getElementById('update-task-form');
updateForm.addEventListener('submit', function(event){
    event.preventDefault();
    const url = this.action;
    const formData = new FormData(this);

    fetch(url, {
        method: 'PATCH',
        body: formData
    })
    .then(response => {

    })
    .catch(error => {
        console.log(error);
    });
});