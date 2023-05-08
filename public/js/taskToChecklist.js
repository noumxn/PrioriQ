async function addTaskToCheckList(taskId) {
  try {
    const response = await fetch(`/boards/checklist/${taskId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId })
    });

    if (!response.ok) {
      throw new Error('Failed to add task to checklist.');
    }
  } catch (e) {
    console.error(e);
  }
}
