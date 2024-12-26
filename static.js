document.addEventListener("DOMContentLoaded", () => {
    // Find all elements with the 'sa-static' attribute
    const staticElements = document.querySelectorAll('[sa-static]');

    // Create an object for quick access to elements by the 'sa-static' value
    const staticMap = Array.from(staticElements).reduce((map, el) => {
        const staticValue = el.getAttribute('sa-static');
        map[staticValue] = el;
        return map;
    }, {});

    // Find all <p> elements on the page
    const paragraphs = document.querySelectorAll('p');

    paragraphs.forEach((paragraph) => {
        // Regex to search for placeholders in the form of [sa-...]
        const regex = /\[sa-([a-zA-Z0-9_-]+)\]/g;
        let match;
        let hasReplacements = false;

        // Create a document fragment to update the content
        const newContent = document.createDocumentFragment();

        let lastIndex = 0; // To track the last matched position
        while ((match = regex.exec(paragraph.textContent)) !== null) {
            const staticValue = match[1]; // Extract value from [sa-...]
            const matchStart = match.index;

            // Add text before the matched placeholder
            if (matchStart > lastIndex) {
                newContent.appendChild(document.createTextNode(paragraph.textContent.slice(lastIndex, matchStart)));
            }

            // Check if an element with the corresponding 'sa-static' value exists
            if (staticMap[staticValue]) {
                // Insert the found element in place of the placeholder
                newContent.appendChild(staticMap[staticValue]);
                hasReplacements = true;
                delete staticMap[staticValue]; // Remove from the map to avoid duplicate insertion
            } else {
                // If no element is found, keep the placeholder as it is
                newContent.appendChild(document.createTextNode(match[0]));
            }

            // Update the index after the matched placeholder
            lastIndex = regex.lastIndex;
        }

        // Add remaining text after the last matched placeholder
        if (lastIndex < paragraph.textContent.length) {
            newContent.appendChild(document.createTextNode(paragraph.textContent.slice(lastIndex)));
        }

        // Replace the paragraph's content if replacements were made
        if (hasReplacements) {
            paragraph.textContent = ""; // Clear the old content
            paragraph.appendChild(newContent); // Add the new content
        }
    });

    // Hide elements that were not inserted
    Object.values(staticMap).forEach((el) => {
        el.style.display = 'none';
    });
});
