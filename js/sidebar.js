// Constants
const categories = {
    '1': 'Miscellaneous',
    '2': 'Programming',
    '3': 'Debate'
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('downloadContentBtn').addEventListener('click', handleDownloadContent);
    document.getElementById('newPromptBtn').addEventListener('click', handleNewPrompt);
    document.getElementById('exportPromptsBtn').addEventListener('click', exportPrompts);
    document.getElementById('importPromptsBtn').addEventListener('click', importPrompts);
    document.getElementById('promptForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('loadConversationBtn').addEventListener('click', handleLoadConversation);

    displayResults();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'returnContent') {
        downloadContent(request.content, request.chatId);
    }
});

// Handler Functions
function handleDownloadContent() {
    chrome.runtime.sendMessage({ action: 'downloadContent' }, (response) => {
        if (chrome.runtime.lastError) return;
        downloadContent(response.content, response.chatId);
    });
}

function handleNewPrompt() {
    clearFormFields();
    setModalTitle('New Prompt');
    UIkit.modal('#editPromptModal').show();
}

function handleLoadConversation() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                chrome.runtime.sendMessage({ 
                    action: 'openConversationTab', 
                    content: e.target.result 
                });
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

// Utility Functions
function copyPromptToClipboard(promptText) {
    navigator.clipboard.writeText(promptText)
        .then(() => UIkit.notification('Prompt copied to clipboard', { status: 'success' }))
        .catch(err => console.error('Failed to copy: ', err));
}

function downloadContent(content, chatid) {
    const fileName = `${chatid}.txt`;
    const contentString = JSON.stringify(content, null, 2);
    const blob = new Blob([contentString], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = fileName;
    downloadLink.click();

    URL.revokeObjectURL(url);
}

function setModalTitle(title) {
    document.getElementById('modalTitle').textContent = title;
}