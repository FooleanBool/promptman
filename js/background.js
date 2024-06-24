const checkDelay = 2000;
const CLAUDE_ORIGIN = 'https://claude.ai';

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: '?' });
  chrome.action.setBadgeBackgroundColor({ color: 'gray' });
  console.log("I was installed");
});

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.tabId < 0) return;
    chrome.tabs.sendMessage(details.tabId, { action: 'getMessageCount' });
  },
  { urls: ['https://claude.ai/api/organizations/*/chat_conversations/*'] },
  ['responseHeaders']
);

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  if (url.origin === CLAUDE_ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidebar.html',
      enabled: true
    });
  } else {
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    setTimeout(() => {
      chrome.tabs.sendMessage(tabId, { action: 'checkElements' }, (response) => {
        if (chrome.runtime.lastError) return;
        updateBadge(tabId, response.count);
      });
    }, checkDelay);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'returnCount':
      returnCount(request, sender);
      break;
    case 'downloadContent':
      handleDownloadContent(sendResponse);
      return true; // Required to use sendResponse asynchronously
    case 'openConversationTab':
      openConversationTab(request.content);
      break;
    default:
      console.log("Unhandled message in bg.js");
      break;
  }
});

function returnCount(request, sender) {
  const messageCount = request.count;
  const color = messageCount > 19 ? 'red' : messageCount > 14 ? 'orange' : 'green';
  chrome.action.setBadgeText({ text: messageCount.toString(), tabId: sender.tab.id });
  chrome.action.setBadgeBackgroundColor({ color: color, tabId: sender.tab.id });
}

function handleDownloadContent(sendResponse) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'getContent' }, (response) => {
      if (chrome.runtime.lastError) return;
      sendResponse({ content: response.content, chatId: response.chatId });
    });
  });
}

function openConversationTab(content) {
  chrome.tabs.create({ url: 'conversation.html' }, (tab) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
      if (tabId === tab.id && info.status === 'complete') {
        chrome.tabs.onUpdated.removeListener(listener);
        chrome.tabs.sendMessage(tabId, {
          action: 'displayConversation',
          content: content
        });
      }
    });
  });  
}