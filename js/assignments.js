// JavaScript for Assignments Page Enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tag filtering system
    initializeTagFiltering();
    
    // Initialize assignment management
    initializeAssignmentManagement();

    // Initialize toast notification system
    initializeToastSystem();
});

// Tag Filtering System
function initializeTagFiltering() {
    const tagContainer = document.querySelector('.tag-filter-container');
    if (!tagContainer) return;
    
    const tags = tagContainer.querySelectorAll('.tag-filter');
    const assignments = document.querySelectorAll('.assignment-card');
    
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
            
            // Filter assignments
            filterAssignments(assignments, activeFilters);
        });
    });
    
    // Clear all filters button
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            tags.forEach(tag => tag.classList.remove('active'));
            activeFilters = [];
            assignments.forEach(assignment => assignment.style.display = '');
        });
    }
}

function filterAssignments(assignments, activeFilters) {
    // If no active filters, show all assignments
    if (activeFilters.length === 0) {
        assignments.forEach(assignment => assignment.style.display = '');
        return;
    }
    
    // Filter assignments based on tags
    assignments.forEach(assignment => {
        const assignmentTags = assignment.getAttribute('data-tags')?.split(',') || [];
        
        // Check if assignment has at least one of the active filters
        const hasMatchingTag = activeFilters.some(filter => assignmentTags.includes(filter));
        
        assignment.style.display = hasMatchingTag ? '' : 'none';
    });
}

// Assignment Management
function initializeAssignmentManagement() {
    // Add New Assignment button functionality
    const addAssignmentBtn = document.querySelector('.add-assignment-btn');
    if (addAssignmentBtn) {
        addAssignmentBtn.addEventListener('click', function() {
            let assignmentModal = document.getElementById('assignmentModal');
            if (!assignmentModal) {
                assignmentModal = createAssignmentModal();
                document.body.appendChild(assignmentModal);
            }
            
            // Reset form for new assignment
            const form = assignmentModal.querySelector('form');
            form.reset();
            form.setAttribute('data-mode', 'create');
            
            // Set default due date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            form.querySelector('#assignment-due-date').valueAsDate = tomorrow;
            
            // Update modal title
            const modalTitle = assignmentModal.querySelector('.modal-title');
            modalTitle.textContent = 'Create New Assignment';
            
            // Show modal
            assignmentModal.style.display = 'flex';
        });
    }
    
    // Edit Assignment buttons functionality
    const editButtons = document.querySelectorAll('.edit-assignment-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const assignmentId = this.getAttribute('data-assignment-id');
            const assignmentTitle = this.getAttribute('data-assignment-title');
            const assignmentDesc = this.closest('.assignment-card').querySelector('.assignment-desc').textContent;
            const assignmentDueDate = this.getAttribute('data-due-date');
            const assignmentTags = this.closest('.assignment-card').getAttribute('data-tags');
            
            let assignmentModal = document.getElementById('assignmentModal');
            if (!assignmentModal) {
                assignmentModal = createAssignmentModal();
                document.body.appendChild(assignmentModal);
            }
            
            // Fill form with assignment data
            const form = assignmentModal.querySelector('form');
            form.reset();
            form.setAttribute('data-mode', 'edit');
            form.setAttribute('data-assignment-id', assignmentId);
            
            form.querySelector('#assignment-title').value = assignmentTitle;
            form.querySelector('#assignment-description').value = assignmentDesc;
            form.querySelector('#assignment-due-date').value = assignmentDueDate;
            
            // Set tags
            if (assignmentTags) {
                const tagArray = assignmentTags.split(',');
                const tagInputs = form.querySelectorAll('.tag-checkbox');
                tagInputs.forEach(input => {
                    if (tagArray.includes(input.value)) {
                        input.checked = true;
                    }
                });
            }
            
            // Update modal title
            const modalTitle = assignmentModal.querySelector('.modal-title');
            modalTitle.textContent = 'Edit Assignment';
            
            // Show modal
            assignmentModal.style.display = 'flex';
        });
    });
}

function createAssignmentModal() {
    const modal = document.createElement('div');
    modal.id = 'assignmentModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Create New Assignment</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="assignment-form" data-mode="create">
                    <div class="form-group">
                        <label for="assignment-title">Title</label>
                        <input type="text" id="assignment-title" required>
                    </div>
                    <div class="form-group">
                        <label for="assignment-description">Description</label>
                        <textarea id="assignment-description" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="assignment-due-date">Due Date</label>
                        <input type="date" id="assignment-due-date" required>
                    </div>
                    <div class="form-group">
                        <label>Module</label>
                        <select id="assignment-module" required>
                            <option value="information-security">Information Security</option>
                            <option value="cyber-security">Cyber Security</option>
                            <option value="software-engineering">Software Engineering</option>
                            <option value="user-centered-design">User-Centered Design</option>
                            <option value="functional-programming">Functional Programming</option>
                            <option value="databases">Databases</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Progress</label>
                        <input type="range" id="assignment-progress" min="0" max="100" step="5" value="0">
                        <div class="progress-value">0%</div>
                    </div>
                    <div class="form-group">
                        <label>Tags</label>
                        <div class="tag-checkboxes">
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="essay"> Essay
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="project"> Project
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="exam"> Exam
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="lab"> Lab
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="report"> Report
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
    
    // Progress slider functionality
    const progressSlider = modal.querySelector('#assignment-progress');
    const progressValue = modal.querySelector('.progress-value');
    
    progressSlider.addEventListener('input', function() {
        progressValue.textContent = this.value + '%';
    });
    
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
        
        const title = this.querySelector('#assignment-title').value;
        const description = this.querySelector('#assignment-description').value;
        const dueDate = this.querySelector('#assignment-due-date').value;
        const module = this.querySelector('#assignment-module').value;
        const progress = parseInt(this.querySelector('#assignment-progress').value);
        
        // Get selected tags
        const selectedTags = [];
        this.querySelectorAll('.tag-checkbox:checked').forEach(checkbox => {
            selectedTags.push(checkbox.value);
        });
        
        // Validate form
        if (!title || !description || !dueDate || selectedTags.length === 0) {
            showToast('Please fill in all required fields and select at least one tag');
            return;
        }
        
        const mode = this.getAttribute('data-mode');
        
        if (mode === 'create') {
            // Create new assignment card and add to grid
            const assignmentsGrid = document.querySelector('.assignments-grid');
            if (assignmentsGrid) {
                const newCard = createAssignmentCard({
                    id: 'new-' + Date.now(),
                    title: title,
                    description: description,
                    dueDate: dueDate,
                    module: module,
                    tags: selectedTags,
                    progress: progress
                });
                
                assignmentsGrid.insertBefore(newCard, assignmentsGrid.firstChild);
                
                // Show success message
                showToast('Assignment created successfully!');
            }
        } else if (mode === 'edit') {
            // Update existing assignment card
            const assignmentId = this.getAttribute('data-assignment-id');
            const assignmentCard = document.querySelector(`.assignment-card[data-assignment-id="${assignmentId}"]`);
            
            if (assignmentCard) {
                assignmentCard.setAttribute('data-tags', selectedTags.join(','));
                assignmentCard.querySelector('h3').textContent = title;
                assignmentCard.querySelector('.assignment-desc').textContent = description;
                assignmentCard.querySelector('.due-date').textContent = 'Due: ' + formatDueDate(dueDate);
                
                // Update progress bar
                const progressBar = assignmentCard.querySelector('.progress');
                if (progressBar) {
                    progressBar.style.width = progress + '%';
                }
                
                // Update tags
                const tagsContainer = assignmentCard.querySelector('.assignment-tags');
                if (tagsContainer) {
                    tagsContainer.innerHTML = selectedTags.map(tag => `<span class="assignment-tag">${tag}</span>`).join('');
                }
                
                // Update edit button attributes
                const editBtn = assignmentCard.querySelector('.edit-assignment-btn');
                if (editBtn) {
                    editBtn.setAttribute('data-assignment-title', title);
                    editBtn.setAttribute('data-due-date', dueDate);
                }
                
                // Show success message
                showToast('Assignment updated successfully!');
            }
        }
        
        // Close modal
        modal.style.display = 'none';
    });
    
    return modal;
}

function createAssignmentCard(data) {
    const card = document.createElement('div');
    card.className = 'assignment-card';
    card.setAttribute('data-assignment-id', data.id);
    card.setAttribute('data-tags', data.tags.join(','));
    
    // Determine accent color based on module
    let accentColor = '#5F9EFF';
    switch(data.module) {
        case 'information-security':
            accentColor = '#FF5F5F';
            break;
        case 'cyber-security':
            accentColor = '#FF8F5F';
            break;
        case 'software-engineering':
            accentColor = '#5FFF9E';
            break;
        case 'user-centered-design':
            accentColor = '#5FFF9E';
            break;
        case 'functional-programming':
            accentColor = '#B15FFF';
            break;
        case 'databases':
            accentColor = '#5F9EFF';
            break;
    }
    
    card.style.setProperty('--accent-color', accentColor);
    
    card.innerHTML = `
        <div class="assignment-header">
            <h3>${data.title}</h3>
            <div class="assignment-actions">
                <button class="edit-assignment-btn" data-assignment-id="${data.id}" data-assignment-title="${data.title}" data-due-date="${data.dueDate}">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        </div>
        <p class="assignment-desc">${data.description}</p>
        <p class="due-date">Due: ${formatDueDate(data.dueDate)}</p>
        <div class="progress-bar">
            <div class="progress" style="width: ${data.progress}%;"></div>
        </div>
        <div class="assignment-footer">
            <div class="assignment-tags">
                ${data.tags.map(tag => `<span class="assignment-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    // Initialize edit button
    const editBtn = card.querySelector('.edit-assignment-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const assignmentId = this.getAttribute('data-assignment-id');
            const assignmentTitle = this.getAttribute('data-assignment-title');
            const assignmentDesc = this.closest('.assignment-card').querySelector('.assignment-desc').textContent;
            const assignmentDueDate = this.getAttribute('data-due-date');
            const assignmentTags = this.closest('.assignment-card').getAttribute('data-tags');
            
            let assignmentModal = document.getElementById('assignmentModal');
            if (!assignmentModal) {
                assignmentModal = createAssignmentModal();
                document.body.appendChild(assignmentModal);
            }
            
            // Fill form with assignment data
            const form = assignmentModal.querySelector('form');
            form.reset();
            form.setAttribute('data-mode', 'edit');
            form.setAttribute('data-assignment-id', assignmentId);
            
            form.querySelector('#assignment-title').value = assignmentTitle;
            form.querySelector('#assignment-description').value = assignmentDesc;
            form.querySelector('#assignment-due-date').value = assignmentDueDate;
            
            // Set tags
            if (assignmentTags) {
                const tagArray = assignmentTags.split(',');
                const tagInputs = form.querySelectorAll('.tag-checkbox');
                tagInputs.forEach(input => {
                    if (tagArray.includes(input.value)) {
                        input.checked = true;
                    }
                });
            }
            
            // Update modal title
            const modalTitle = assignmentModal.querySelector('.modal-title');
            modalTitle.textContent = 'Edit Assignment';
            
            // Show modal
            assignmentModal.style.display = 'flex';
        });
    }
    
    return card;
}

// Helper function to format due date
function formatDueDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
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

// Initialize toast notification system
function initializeToastSystem() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast')) {
        const toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
}