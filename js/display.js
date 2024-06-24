function displayResults(categoryId) {
    const promptsDiv = document.getElementById('promptsDiv');
    promptsDiv.innerHTML = '';
    
    chrome.storage.local.get('prompts', function(data) {
        const prompts = data.prompts || [];
        
        const groupedPrompts = prompts.reduce((acc, prompt) => {
            const category = prompt.cat;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(prompt);
            return acc;
        }, {});
        
        Object.entries(groupedPrompts).forEach(([category, categoryPrompts]) => {
            const accordionItem = createAccordionItem(category, categoryPrompts);
            promptsDiv.appendChild(accordionItem);
        });
        
        initializeAccordion(promptsDiv, categoryId);
    });
}

function createAccordionItem(category, prompts) {
    const accordionItem = document.createElement('li');
    
    const accordionTitle = createAccordionTitle(category, prompts.length);
    accordionItem.appendChild(accordionTitle);
    
    const accordionContent = createAccordionContent(prompts);
    accordionItem.appendChild(accordionContent);
    
    return accordionItem;
}

function createAccordionTitle(category, count) {
    const accordionTitle = document.createElement('a');
    accordionTitle.classList.add('uk-accordion-title');
    
    const categoryCount = document.createElement('span');
    categoryCount.classList.add('uk-badge', 'uk-margin-small-right');
    categoryCount.textContent = count;
    
    const categoryText = document.createElement('span');
    categoryText.textContent = categories[category];
    
    accordionTitle.appendChild(categoryCount);
    accordionTitle.appendChild(categoryText);
    
    return accordionTitle;
}

function createAccordionContent(prompts) {
    const accordionContent = document.createElement('div');
    accordionContent.classList.add('uk-accordion-content');
    
    prompts.forEach(prompt => {
        const card = createPromptCard(prompt);
        accordionContent.appendChild(card);
    });
    
    return accordionContent;
}

function createPromptCard(prompt) {
    const card = document.createElement('div');
    card.classList.add('uk-card', 'uk-card-default', 'uk-card-small', 'uk-margin-bottom');
    
    const cardHeader = createCardHeader(prompt.title);
    const cardBody = createCardBody(prompt.desc);
    const cardFooter = createCardFooter(prompt);
    
    card.appendChild(cardHeader);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);
    
    return card;
}

function createCardHeader(title) {
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('uk-card-header');
    
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('uk-card-title', 'uk-margin-remove-bottom');
    cardTitle.textContent = title;
    
    cardHeader.appendChild(cardTitle);
    return cardHeader;
}

function createCardBody(description) {
    const cardBody = document.createElement('div');
    cardBody.classList.add('uk-card-body');
    
    const cardDesc = document.createElement('p');
    cardDesc.textContent = description;
    
    cardBody.appendChild(cardDesc);
    return cardBody;
}

function createCardFooter(prompt) {
    const cardFooter = document.createElement('div');
    cardFooter.classList.add('uk-card-footer', 'uk-flex', 'uk-flex-between');
    
    const copyIcon = createIcon('copy', () => copyPromptToClipboard(prompt.prompt));
    cardFooter.appendChild(copyIcon);
    
    const iconContainer = document.createElement('div');
    iconContainer.classList.add('uk-flex', 'uk-flex-right');
    
    const editIcon = createIcon('file-edit', () => editPrompt(prompt.id));
    const deleteIcon = createIcon('trash', (event) => {
        event.stopPropagation();
        deletePrompt(prompt.id, prompt.cat);
    });
    
    iconContainer.appendChild(editIcon);
    iconContainer.appendChild(deleteIcon);
    cardFooter.appendChild(iconContainer);
    
    return cardFooter;
}

function createIcon(iconName, clickHandler) {
    const icon = document.createElement('span');
    icon.setAttribute('uk-icon', `icon: ${iconName}`);
    icon.classList.add('uk-margin-small-right', 'uk-link');
    icon.addEventListener('click', clickHandler);
    return icon;
}

function initializeAccordion(promptsDiv, categoryId) {
    UIkit.accordion(promptsDiv, {
        targets: '> li',
        active: false,
        collapsible: true
    });

    if (categoryId) {
        const categoryIndex = Array.from(promptsDiv.children).findIndex(item => 
            item.querySelector('.uk-accordion-title').textContent.includes(categories[categoryId])
        );
        
        if (categoryIndex !== -1) {
            UIkit.accordion(promptsDiv).toggle(categoryIndex, true);
        }
    }
}