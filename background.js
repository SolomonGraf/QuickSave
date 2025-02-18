chrome.commands.onCommand.addListener((command) => {
    if (command === "save-highlight") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0].id;
  
        // Use the scripting API to inject a function into the active tab
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab },
            func: () => window.getSelection().toString(), // Function to get selected text
          },
          (results) => {
            if (results && results[0] && results[0].result) {
              const actualText = results[0].result;
              const displayText = actualText.length > 100 ? actualText.slice(0, 97) + "..." : actualText; // Shorten the text for display
  
              // Save the highlight as an object
              chrome.storage.local.get({ highlights: [] }, (data) => {
                const highlights = data.highlights;
                if (!highlights.map(h => h.actualText).includes(actualText)) {
                    highlights.push({ displayText, actualText });
                };
                chrome.storage.local.set({ highlights: highlights });
              });
            }
          }
        );
      });
    }
  });