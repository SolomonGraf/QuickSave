// Function to get the highlighted text
function getHighlightedText() {
    return window.getSelection().toString();
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getHighlightedText") {
        const highlightedText = getHighlightedText();
        sendResponse({ text: highlightedText });
    }
});