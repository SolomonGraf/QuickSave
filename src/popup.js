document.addEventListener("DOMContentLoaded", () => {
    const highlightList = document.getElementById("highlight-list");
    const clearButton = document.getElementById("clear-button");
    const paginator = document.getElementById("page-selector");

    // Function to display highlights
    const displayHighlights = (highlights, page) => {
        highlightList.innerHTML = ""; // Clear the list before re-rendering
        highlights.slice((page - 1) * 5, page * 5).reverse().forEach((highlight, index) => {
            const item = document.createElement("div");
            const text = document.createElement("p")
            item.classList.add("item");
            text.classList.add("text")
            text.textContent = highlight.displayText;

            const deleteButton = document.createElement("button")
            deleteButton.classList.add("delete-button")

            item.appendChild(text);
            item.appendChild(deleteButton);

            text.addEventListener("click", () => {
                navigator.clipboard
                    .writeText(highlight.actualText)
                    .then(() => {
                        item.style.backgroundColor = "#d4edda";
                        setTimeout(() => {
                            item.style.backgroundColor = "";
                        }, 1000);
                    })
                    .catch((err) => {
                        console.error("Failed to copy text:", err);
                    });
            });

            deleteButton.addEventListener("click", () => {
                highlights.splice(index, 1); // Remove the item from the array
                chrome.storage.local.set({ highlights: highlights }, () => {
                    displayHighlights(highlights, page);
                    renderPagination(page, highlights.length);
                });
            });

            highlightList.appendChild(item);
        })
    };

    const renderPagination = (page, numElements) => {
        paginator.innerHTML = "";

        paginator.style.display = numElements === 0 ? "none" : "block"

        const createButton = (page) => {
            const button = document.createElement("button");
            button.classList.add("page-button")
            button.textContent = page.toString();
            button.onclick = () => {
                chrome.storage.local.get({ highlights: [] }, (data) => {
                    displayHighlights(data.highlights, page);
                });
            };
            paginator.appendChild(button);
        }

        for (let i = 1; i <= Math.ceil(numElements / 5); i++) {
            createButton(i);
        }

    }
    // Load saved highlights from storage
    chrome.storage.local.get({ highlights: [] }, (data) => {
        displayHighlights(data.highlights, 1);
        renderPagination(1, data.highlights.length);
    });

    // Clear button click event
    clearButton.addEventListener("click", () => {
        chrome.storage.local.set({ highlights: [] }, () => {
            // Clear the displayed list
            highlightList.innerHTML = "";
            console.log("Highlights cleared!");
            renderPagination(1, 0);
        });
    });
});