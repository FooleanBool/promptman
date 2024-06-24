function loadPromptIntoForm(prompt) {
    document.getElementById('promptId').value = prompt.id;
    document.getElementById('promptTitle').value = prompt.title;
    document.getElementById('promptDesc').value = prompt.desc;
    document.getElementById('promptText').value = prompt.prompt;
    document.getElementById('promptCategory').value = prompt.cat;
}

function handleFormSubmit(event) {
    event.preventDefault();
    const promptId = document.getElementById('promptId').value;
    const promptTitle = document.getElementById('promptTitle').value;
    const promptCat = document.getElementById('promptCategory').value;
    const promptDesc = document.getElementById('promptDesc').value;
    const promptText = document.getElementById('promptText').value;

    if (promptTitle && promptDesc && promptText && promptCat) {
        if (promptId) {
            updatePrompt(parseInt(promptId), promptTitle, promptDesc, promptText, promptCat);
        } else {
            insertPrompt(promptTitle, promptDesc, promptText, promptCat);
        }
        clearFormFields();
    } else {
        alert('Please fill in all required fields.');
    }
}

function clearFormFields() {
    const fields = ['promptId', 'promptTitle', 'promptDesc', 'promptText'];
    fields.forEach(field => document.getElementById(field).value = '');
    document.getElementById('promptCategory').selectedIndex = 0;
}