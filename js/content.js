// Messages listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getContent') {
    const data = getConversationContent();
    sendResponse({ content: data.content, chatId: data.chatid });
  }

  if (request.action === 'getMessageCount') {
    const count = document.querySelectorAll('div.flex.shrink-0.items-center.justify-center.rounded-full.font-bold.h-7.w-7.text-\\[12px\\].bg-accent-pro-100.text-oncolor-100').length;
    const chars = document.body.innerText.length;
    updateCharCountDisplay(chars);
    chrome.runtime.sendMessage({ action: 'returnCount', count });
  }
});

// Function to get total chars of convo
function checkElements() {
  return new Promise((resolve) => {
    const elements = document.querySelectorAll('div.flex.shrink-0.items-center.justify-center.rounded-full.font-bold.h-7.w-7.text-\\[12px\\].bg-accent-pro-100.text-oncolor-100');
    resolve({ count: elements.length });
  });
}

// Function to update the character count display
function updateCharCountDisplay(chars) {
  let countDiv = document.getElementById('chardiv');
  if (!countDiv) {
    countDiv = createCharCountDiv();
    document.body.appendChild(countDiv);
  }
  updateCharCountStyle(countDiv, chars);
  countDiv.textContent = 'Chars: ' + chars.toLocaleString();
}

// Function to create the character count div
function createCharCountDiv() {
  const countDiv = document.createElement('div');
  countDiv.id = 'chardiv';
  Object.assign(countDiv.style, {
    position: 'fixed',
    bottom: '15px',
    right: '25px',
    padding: '5px 10px',
    borderRadius: '5px',
    zIndex: '9999',
    fontWeight: 'bold',
    background: 'rgba(0, 0, 0, 0.6)'
  });
  return countDiv;
}

// Function to update the character count div style based on the count
function updateCharCountStyle(countDiv, chars) {
  countDiv.style.color = chars > 40000 ? 'red' : chars > 30000 ? 'orange' : 'green';
}

// Function to retrieve conversation content
function getConversationContent() {
  const outerDiv = document.querySelector('div.flex-1.flex.flex-col.gap-3.px-4.max-w-3xl.mx-auto.w-full.pt-12.md\\:pt-16');
  const titleElement = document.querySelector('button[data-testid="chat-menu-trigger"]');
  const title = titleElement ? titleElement.innerText.trim() : 'Untitled Conversation';

  const messageDivs = outerDiv.querySelectorAll(':scope > div');
  const extractedContent = [{ title }];

  messageDivs.forEach(messageDiv => {
    const userMessageDiv = messageDiv.querySelector('.font-user-message');
    const claudeMessageDiv = messageDiv.querySelector('.font-claude-message');

    if (userMessageDiv) {
      extractedContent.push({ type: 'user', content: userMessageDiv.textContent.trim() });
    }

    if (claudeMessageDiv) {
      extractedContent.push({ type: 'claude', content: claudeMessageDiv.textContent.trim() });
    }
  });

  const chatid = window.location.href.split('/').pop();

  return { content: extractedContent, chatid };
}