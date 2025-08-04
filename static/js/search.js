let fuse;
let searchData = [];

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
});

async function initSearch() {
    try {
        // Fetch the search index - construct URL based on site structure
        const currentPath = window.location.pathname;
        const baseURL = currentPath.includes('/ai-events-recap/') 
            ? window.location.origin + '/ai-events-recap'
            : window.location.origin;
        const indexURL = baseURL + '/index.json';
        const response = await fetch(indexURL);
        searchData = await response.json();
        
        // Configure Fuse.js options
        const options = {
            keys: [
                { name: 'title', weight: 0.4 },
                { name: 'summary', weight: 0.3 },
                { name: 'content', weight: 0.2 },
                { name: 'topics', weight: 0.1 }
            ],
            threshold: 0.3,
            includeScore: true,
            includeMatches: true
        };
        
        // Initialize Fuse
        fuse = new Fuse(searchData, options);
        
        // Check if there's a search query in URL and perform search
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query) {
            // Set the search heading
            const searchHeading = document.getElementById('search-heading');
            if (searchHeading) {
                searchHeading.textContent = `Search results for: "${query}"`;
            }
            performSearch(query);
        }
    } catch (error) {
        console.error('Error initializing search:', error);
    }
}

function handleSearch(event) {
    const query = event.target.value.trim();
    
    if (query.length < 2) {
        clearResults();
        return;
    }
    
    performSearch(query);
}

function performSearch(query) {
    if (!fuse) {
        console.error('Search not initialized');
        return;
    }
    
    const results = fuse.search(query);
    displayResults(results, query);
}

function displayResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `<div class="no-results">No results found for "${query}"</div>`;
        return;
    }
    
    const resultsHTML = results.map(result => {
        const item = result.item;
        
        // Format topics
        const topicsHTML = item.topics ? 
            item.topics.map(topic => `<span class="topic">${topic}</span>`).join('') : '';
        
        return `
            <div class="search-result">
                <h3><a href="${item.permalink}">${item.title}</a></h3>
                <div class="search-result-meta">
                    ${item.categories ? `Category: ${item.categories.join(', ')}` : ''}
                </div>
                <p class="search-result-summary">${item.summary || ''}</p>
                ${topicsHTML ? `<div class="search-result-topics">${topicsHTML}</div>` : ''}
            </div>
        `;
    }).join('');
    
    resultsContainer.innerHTML = resultsHTML;
}

function clearResults() {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}