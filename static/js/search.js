let fuse;
let searchData = [];

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSearch();
});

async function initSearch() {
    try {
        // Fetch the search index
        const response = await fetch('/index.json');
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
        
        // Set up search input handler
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
            
            // Check if there's a search query in URL
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('q');
            if (query) {
                searchInput.value = query;
                performSearch(query);
            }
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
        
        // Format date
        const eventDate = item.event_date ? new Date(item.event_date).toLocaleDateString() : '';
        
        // Format topics
        const topicsHTML = item.topics ? 
            item.topics.map(topic => `<span class="topic">${topic}</span>`).join('') : '';
        
        return `
            <div class="search-result">
                <h3><a href="${item.permalink}">${item.title}</a></h3>
                <div class="search-result-meta">
                    ${eventDate ? `Event Date: ${eventDate}` : ''}
                    ${item.categories ? ` | Category: ${item.categories.join(', ')}` : ''}
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