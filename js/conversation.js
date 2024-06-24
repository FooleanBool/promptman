chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'displayConversation') {
        displayConversation(request.content);
    }
});

function displayConversation(content) {
    const container = document.getElementById('conversation-container');
    const conversation = JSON.parse(content);
    
    if (conversation.length > 0 && conversation[0].title) {
        setPageTitle(conversation[0].title, container);
    }
    
    conversation.slice(1).forEach(item => {
        if (item.type && item.content) {
            const messageDiv = createMessageDiv(item);
            container.appendChild(messageDiv);
        }
    });
}

function setPageTitle(title, container) {
    document.title = title;
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.classList.add('conversation-title');
    container.appendChild(titleElement);
}

function createMessageDiv(item) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('uk-card', 'uk-card-body', 'uk-margin-bottom', 'message', `${item.type}-message`);
    
    const formattedContent = item.content.replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `
        <h3 class="uk-card-title">${item.type === 'user' ? 'User' : 'Claude'}</h3>
        <p>${formattedContent}</p>
    `;
    
    return messageDiv;
}