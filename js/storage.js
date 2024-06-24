/**
 * Imports prompts from a JSON file and saves them to local storage.
 */
function importPrompts() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const importedPrompts = JSON.parse(e.target.result);
                chrome.storage.local.set({ 'prompts': importedPrompts }, () => {
                    displayResults();
                });
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Invalid JSON file. Please try again.');
            }
        };

        reader.readAsText(file);
    });

    fileInput.click();
}

/**
 * Exports the prompts from local storage to a JSON file.
 */
function exportPrompts() {
    chrome.storage.local.get('prompts', (data) => {
        const prompts = data.prompts || [];
        const promptsJson = JSON.stringify(prompts, null, 2);
        const blob = new Blob([promptsJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'prompts.json';
        a.click();

        URL.revokeObjectURL(url);
    });
}

/**
 * Inserts a new prompt into the local storage.
 */
function insertPrompt(title, desc, prompt, cat) {
    chrome.storage.local.get('prompts', (data) => {
        const prompts = data.prompts || [];
        const new_id = prompts.length > 0 ? Math.max(...prompts.map(p => p.id)) + 1 : 1;

        const new_prompt = { id: new_id, title, desc, prompt, cat };
        prompts.push(new_prompt);

        chrome.storage.local.set({ 'prompts': prompts }, () => {
            UIkit.modal('#editPromptModal').hide();
            console.log('New prompt inserted:', new_prompt);
            displayResults();
        });
    });
}

/**
 * Updates an existing prompt in the local storage.
 */
function updatePrompt(promptId, title, desc, prompt, cat) {
    chrome.storage.local.get('prompts', (data) => {
        const prompts = data.prompts || [];
        const promptIndex = prompts.findIndex(p => p.id === promptId);

        if (promptIndex !== -1) {
            prompts[promptIndex] = { ...prompts[promptIndex], title, desc, prompt, cat };

            chrome.storage.local.set({ 'prompts': prompts }, () => {
                UIkit.modal('#editPromptModal').hide();
                console.log('Prompt updated:', prompts[promptIndex]);
                displayResults();
            });
        }
    });
}

/**
 * Retrieves a prompt from local storage and loads it into the edit form.
 */
function editPrompt(promptId) {
    chrome.storage.local.get('prompts', (data) => {
        const prompts = data.prompts || [];
        const promptToEdit = prompts.find(prompt => prompt.id === promptId);

        if (promptToEdit) {
            loadPromptIntoForm(promptToEdit);
            setModalTitle('Edit Prompt');
            UIkit.modal('#editPromptModal').show();
        } else {
            console.log('Prompt not found for id:', promptId);
        }
    });
}

/**
 * Deletes a prompt from local storage.
 */
function deletePrompt(promptId, categoryId) {
    UIkit.modal.confirm('Are you sure you want to delete this prompt?').then(() => {
        chrome.storage.local.get('prompts', (data) => {
            let prompts = data.prompts || [];
            prompts = prompts.filter(prompt => prompt.id !== promptId);

            chrome.storage.local.set({ 'prompts': prompts }, () => {
                console.log('Prompt deleted with id:', promptId);
                displayResults(categoryId);
            });
        });
    }, () => {
        console.log('Prompt deletion canceled');
    });
}

/**
 * Deletes all prompts from storage.
 */
function deleteAllPrompts() {
    UIkit.modal.confirm('Are you sure you want to delete all prompts?').then(() => {
        chrome.storage.local.remove('prompts', () => {
            console.log('All prompts deleted from storage.');
            displayResults();
        });
    });
}