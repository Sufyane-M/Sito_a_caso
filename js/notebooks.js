// JavaScript for Notebook Page Enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tag filtering system
    initializeTagFiltering();
    
    // Initialize favorites functionality
    initializeFavorites();
    
    // Initialize sharing functionality
    initializeSharing();
    
    // Initialize notebook management interface
    initializeNotebookManagement();
});

// Tag Filtering System
function initializeTagFiltering() {
    const tagContainer = document.querySelector('.tag-filter-container');
    if (!tagContainer) return;
    
    const tags = tagContainer.querySelectorAll('.tag-filter');
    const notebooks = document.querySelectorAll('.notebook-card');
    
    // Track active filters
    let activeFilters = [];
    
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagValue = this.getAttribute('data-tag');
            
            // Toggle active class
            this.classList.toggle('active');
            
            // Update active filters
            if (this.classList.contains('active')) {
                activeFilters.push(tagValue);
            } else {
                activeFilters = activeFilters.filter(filter => filter !== tagValue);
            }
            
            // Filter notebooks
            filterNotebooks(notebooks, activeFilters);
        });
    });
    
    // Clear all filters button
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            tags.forEach(tag => tag.classList.remove('active'));
            activeFilters = [];
            notebooks.forEach(notebook => notebook.style.display = 'flex');
        });
    }
}

function filterNotebooks(notebooks, activeFilters) {
    // If no active filters, show all notebooks
    if (activeFilters.length === 0) {
        notebooks.forEach(notebook => notebook.style.display = 'flex');
        return;
    }
    
    // Filter notebooks based on tags
    notebooks.forEach(notebook => {
        const notebookTags = notebook.getAttribute('data-tags')?.split(',') || [];
        
        // Check if notebook has at least one of the active filters
        const hasMatchingTag = activeFilters.some(filter => notebookTags.includes(filter));
        
        notebook.style.display = hasMatchingTag ? 'flex' : 'none';
    });
}

// Favorites Functionality
function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    // Load favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('notebookFavorites')) || [];
    
    favoriteButtons.forEach(btn => {
        const notebookId = btn.getAttribute('data-notebook-id');
        
        // Set initial state
        if (favorites.includes(notebookId)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-star"></i>';
        } else {
            btn.innerHTML = '<i class="far fa-star"></i>';
        }
        
        // Toggle favorite status
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                // Add to favorites
                if (!favorites.includes(notebookId)) {
                    favorites.push(notebookId);
                }
                this.innerHTML = '<i class="fas fa-star"></i>';
            } else {
                // Remove from favorites
                favorites = favorites.filter(id => id !== notebookId);
                this.innerHTML = '<i class="far fa-star"></i>';
            }
            
            // Save to localStorage
            localStorage.setItem('notebookFavorites', JSON.stringify(favorites));
        });
    });
}

// Sharing Functionality
function initializeSharing() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const notebookId = this.getAttribute('data-notebook-id');
            const notebookTitle = this.getAttribute('data-notebook-title');
            
            // Create share modal if it doesn't exist
            let shareModal = document.getElementById('shareModal');
            if (!shareModal) {
                shareModal = createShareModal();
                document.body.appendChild(shareModal);
            }
            
            // Update modal content
            const modalTitle = shareModal.querySelector('.modal-title');
            modalTitle.textContent = `Share "${notebookTitle}"`;
            
            // Show modal
            shareModal.style.display = 'flex';
        });
    });
}

function createShareModal() {
    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Share Notebook</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="share-options">
                    <button class="share-option" data-type="email">
                        <i class="fas fa-envelope"></i> Email
                    </button>
                    <button class="share-option" data-type="link">
                        <i class="fas fa-link"></i> Copy Link
                    </button>
                    <button class="share-option" data-type="twitter">
                        <i class="fab fa-twitter"></i> Twitter
                    </button>
                    <button class="share-option" data-type="facebook">
                        <i class="fab fa-facebook"></i> Facebook
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Share options functionality
    const shareOptions = modal.querySelectorAll('.share-option');
    shareOptions.forEach(option => {
        option.addEventListener('click', function() {
            const shareType = this.getAttribute('data-type');
            const dummyUrl = 'https://student-dashboard.edu/notebook/123';
            
            switch(shareType) {
                case 'email':
                    window.location.href = `mailto:?subject=Check out this notebook&body=I thought you might find this interesting: ${dummyUrl}`;
                    break;
                case 'link':
                    navigator.clipboard.writeText(dummyUrl)
                        .then(() => {
                            showToast('Link copied to clipboard!');
                        })
                        .catch(err => {
                            console.error('Could not copy text: ', err);
                        });
                    break;
                case 'twitter':
                    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(dummyUrl)}&text=Check out this notebook!`, '_blank');
                    break;
                case 'facebook':
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(dummyUrl)}`, '_blank');
                    break;
            }
            
            // Close modal after action
            modal.style.display = 'none';
        });
    });
    
    return modal;
}

// Notebook Management Interface
function initializeNotebookManagement() {
    // Add New Notebook button functionality
    const addNotebookBtn = document.querySelector('.add-notebook-btn');
    if (addNotebookBtn) {
        addNotebookBtn.addEventListener('click', function() {
            let notebookModal = document.getElementById('notebookModal');
            if (!notebookModal) {
                notebookModal = createNotebookModal();
                document.body.appendChild(notebookModal);
            }
            
            // Reset form for new notebook
            const form = notebookModal.querySelector('form');
            form.reset();
            form.setAttribute('data-mode', 'create');
            
            // Update modal title
            const modalTitle = notebookModal.querySelector('.modal-title');
            modalTitle.textContent = 'Create New Notebook';
            
            // Show modal
            notebookModal.style.display = 'flex';
        });
    }
    
    // Edit Notebook buttons functionality
    const editButtons = document.querySelectorAll('.edit-notebook-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const notebookId = this.getAttribute('data-notebook-id');
            const notebookTitle = this.getAttribute('data-notebook-title');
            const notebookDesc = this.closest('.notebook-card').querySelector('.notebook-desc').textContent;
            const notebookTags = this.closest('.notebook-card').getAttribute('data-tags');
            
            let notebookModal = document.getElementById('notebookModal');
            if (!notebookModal) {
                notebookModal = createNotebookModal();
                document.body.appendChild(notebookModal);
            }
            
            // Fill form with notebook data
            const form = notebookModal.querySelector('form');
            form.reset();
            form.setAttribute('data-mode', 'edit');
            form.setAttribute('data-notebook-id', notebookId);
            
            form.querySelector('#notebook-title').value = notebookTitle;
            form.querySelector('#notebook-description').value = notebookDesc;
            
            // Set tags
            if (notebookTags) {
                const tagArray = notebookTags.split(',');
                const tagInputs = form.querySelectorAll('.tag-checkbox');
                tagInputs.forEach(input => {
                    if (tagArray.includes(input.value)) {
                        input.checked = true;
                    }
                });
            }
            
            // Update modal title
            const modalTitle = notebookModal.querySelector('.modal-title');
            modalTitle.textContent = 'Edit Notebook';
            
            // Show modal
            notebookModal.style.display = 'flex';
        });
    });
}

function createNotebookModal() {
    const modal = document.createElement('div');
    modal.id = 'notebookModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Create New Notebook</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="notebook-form" data-mode="create">
                    <div class="form-group">
                        <label for="notebook-title">Title</label>
                        <input type="text" id="notebook-title" required>
                    </div>
                    <div class="form-group">
                        <label for="notebook-description">Description</label>
                        <textarea id="notebook-description" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Tags</label>
                        <div class="tag-checkboxes">
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="security"> Security
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="database"> Database
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="programming"> Programming
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="design"> Design
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="web"> Web
                            </label>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">Save</button>
                        <button type="button" class="btn-secondary cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    [closeBtn, cancelBtn].forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Form submission
    const form = modal.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = this.querySelector('#notebook-title').value;
        const description = this.querySelector('#notebook-description').value;
        
        // Get selected tags
        const selectedTags = [];
        this.querySelectorAll('.tag-checkbox:checked').forEach(checkbox => {
            selectedTags.push(checkbox.value);
        });
        
        // In a real app, this would save to a database
        // For now, we'll just show a success message
        const mode = this.getAttribute('data-mode');
        
        if (mode === 'create') {
            // Create new notebook card and add to grid
            const notebooksGrid = document.querySelector('.notebooks-grid');
            if (notebooksGrid) {
                const newCard = createNotebookCard({
                    id: 'new-' + Date.now(),
                    title: title,
                    description: description,
                    tags: selectedTags,
                    time: 'Just now'
                });
                
                notebooksGrid.insertBefore(newCard, notebooksGrid.firstChild);
                
                // Show success message
                showToast('Notebook created successfully!');
            }
        } else if (mode === 'edit') {
            // Update existing notebook card
            const notebookId = this.getAttribute('data-notebook-id');
            const notebookCard = document.querySelector(`.notebook-card[data-notebook-id="${notebookId}"]`);
            
            if (notebookCard) {
                notebookCard.setAttribute('data-tags', selectedTags.join(','));
                notebookCard.querySelector('h3').textContent = title;
                notebookCard.querySelector('.notebook-desc').textContent = description;
                
                // Show success message
                showToast('Notebook updated successfully!');
            }
        }
        
        // Close modal
        const modal = this.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
        }
    });
    
    return modal;
}

function createNotebookCard(data) {
    const card = document.createElement('div');
    card.className = 'notebook-card';
    card.setAttribute('data-notebook-id', data.id);
    card.setAttribute('data-tags', data.tags.join(','));
    
    card.innerHTML = `
        <div class="notebook-icon"><i class="fas fa-book"></i></div>
        <div class="notebook-info">
            <div class="notebook-header">
                <h3>${data.title}</h3>
                <div class="notebook-actions">
                    <button class="favorite-btn" data-notebook-id="${data.id}" data-notebook-title="${data.title}">
                        <i class="far fa-star"></i>
                    </button>
                    <button class="share-btn" data-notebook-id="${data.id}" data-notebook-title="${data.title}">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="edit-notebook-btn" data-notebook-id="${data.id}" data-notebook-title="${data.title}">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
            <p class="notebook-desc">${data.description}</p>
            <div class="notebook-footer">
                <p class="notebook-time">${data.time}</p>
                <div class="notebook-tags">
                    ${data.tags.map(tag => `<span class="notebook-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Initialize favorite button
    const favoriteBtn = card.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle favorite status
            this.classList.toggle('active');
            
            // Update icon
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-star"></i>';
            } else {
                this.innerHTML = '<i class="far fa-star"></i>';
            }
            
            // Update localStorage
            const notebookId = this.getAttribute('data-notebook-id');
            let favorites = JSON.parse(localStorage.getItem('notebookFavorites')) || [];
            
            if (this.classList.contains('active')) {
                if (!favorites.includes(notebookId)) {
                    favorites.push(notebookId);
                }
            } else {
                favorites = favorites.filter(id => id !== notebookId);
            }
            
            localStorage.setItem('notebookFavorites', JSON.stringify(favorites));
        });
    }
    
    // Initialize share button
    const shareBtn = card.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const notebookId = this.getAttribute('data-notebook-id');
            const notebookTitle = this.getAttribute('data-notebook-title');
            
            // Create share modal if it doesn't exist
            let shareModal = document.getElementById('shareModal');
            if (!shareModal) {
                shareModal = createShareModal();
                document.body.appendChild(shareModal);
            }
            
            // Update modal content
            const modalTitle = shareModal.querySelector('.modal-title');
            modalTitle.textContent = `Share "${notebookTitle}"`;
            
            // Show modal
            shareModal.style.display = 'flex';
        });
    }
    
    // Initialize edit button
    const editBtn = card.querySelector('.edit-notebook-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const notebookId = this.getAttribute('data-notebook-id');
            const notebookTitle = this.getAttribute('data-notebook-title');
            const notebookDesc = this.closest('.notebook-card').querySelector('.notebook-desc').textContent;
            const notebookTags = this.closest('.notebook-card').getAttribute('data-tags');
            
            let notebookModal = document.getElementById('notebookModal');
            if (!notebookModal) {
                notebookModal = createNotebookModal();
                document.body.appendChild(notebookModal);
            }
            
            // Fill form with notebook data
            const form = notebookModal.querySelector('form');
            form.reset();
            form.setAttribute('data-mode', 'edit');
            form.setAttribute('data-notebook-id', notebookId);
            
            form.querySelector('#notebook-title').value = notebookTitle;
            form.querySelector('#notebook-description').value = notebookDesc;
            
            // Set tags
            if (notebookTags) {
                const tagArray = notebookTags.split(',');
                const tagInputs = form.querySelectorAll('.tag-checkbox');
                tagInputs.forEach(input => {
                    if (tagArray.includes(input.value)) {
                        input.checked = true;
                    }
                });
            }
            
            // Update modal title
            const modalTitle = notebookModal.querySelector('.modal-title');
            modalTitle.textContent = 'Edit Notebook';
            
            // Show modal
            notebookModal.style.display = 'flex';
        });
    }
    
    return card;
}

// Helper function to show toast messages
function showToast(message) {
    let toast = document.getElementById('toast');
    
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    toast.className = 'show';
    
    setTimeout(() => {
        toast.className = '';
    }, 3000);
}