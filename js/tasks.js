// JavaScript for Tasks Page Enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tag filtering system
    initializeTagFiltering();
    
    // Initialize task management
    initializeTaskManagement();
});

// Tag Filtering System
function initializeTagFiltering() {
    const tagContainer = document.querySelector('.tag-filter-container');
    if (!tagContainer) return;
    
    const tags = tagContainer.querySelectorAll('.tag-filter');
    const tasks = document.querySelectorAll('.notebook-card');
    
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
            
            // Filter tasks
            filterTasks(tasks, activeFilters);
        });
    });
    
    // Clear all filters button
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            tags.forEach(tag => tag.classList.remove('active'));
            activeFilters = [];
            tasks.forEach(task => task.style.display = '');
        });
    }
}

function filterTasks(tasks, activeFilters) {
    // If no active filters, show all tasks
    if (activeFilters.length === 0) {
        tasks.forEach(task => task.style.display = '');
        return;
    }
    
    // Filter tasks based on tags
    tasks.forEach(task => {
        const taskTags = task.getAttribute('data-tags')?.split(',') || [];
        
        // Check if task has at least one of the active filters
        const hasMatchingTag = activeFilters.some(filter => taskTags.includes(filter));
        
        task.style.display = hasMatchingTag ? '' : 'none';
    });
}

// Task Management
function initializeTaskManagement() {
    // Add New Task button functionality
    const addTaskBtn = document.querySelector('.btn-hide');
    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', function() {
            let taskModal = document.getElementById('taskModal');
            if (!taskModal) {
                taskModal = createTaskModal();
                document.body.appendChild(taskModal);
            }
            
            // Reset form for new task
            const form = taskModal.querySelector('form');
            form.reset();
            form.setAttribute('data-mode', 'create');
            
            // Update modal title
            const modalTitle = taskModal.querySelector('.modal-title');
            modalTitle.textContent = 'Create New Task';
            
            // Show modal
            taskModal.style.display = 'flex';
        });
    }
    
    // Edit Task functionality
    const taskCards = document.querySelectorAll('.notebook-card');
    taskCards.forEach(card => {
        card.addEventListener('click', function() {
            const taskTitle = this.querySelector('h3').textContent;
            const taskDesc = this.querySelector('.notebook-desc').textContent;
            const taskStatus = this.querySelector('.task-status').textContent;
            const taskDueDate = this.querySelector('.notebook-time').textContent;
            
            let taskModal = document.getElementById('taskModal');
            if (!taskModal) {
                taskModal = createTaskModal();
                document.body.appendChild(taskModal);
            }
            
            // Fill form with task data
            const form = taskModal.querySelector('form');
            form.reset();
            form.setAttribute('data-mode', 'edit');
            form.setAttribute('data-task-id', this.getAttribute('data-task-id') || 'task-' + Date.now());
            
            form.querySelector('#task-title').value = taskTitle;
            form.querySelector('#task-description').value = taskDesc;
            
            // Set status
            const statusSelect = form.querySelector('#task-status');
            if (statusSelect) {
                if (taskStatus.includes('In Progress')) {
                    statusSelect.value = 'in-progress';
                } else if (taskStatus.includes('Pending')) {
                    statusSelect.value = 'pending';
                } else if (taskStatus.includes('Done')) {
                    statusSelect.value = 'done';
                }
            }
            
            // Set due date (parse from text)
            const dueDateInput = form.querySelector('#task-due-date');
            if (dueDateInput && taskDueDate) {
                // Simple parsing for demo purposes
                if (taskDueDate.includes('today')) {
                    const today = new Date();
                    dueDateInput.value = today.toISOString().split('T')[0];
                } else if (taskDueDate.includes('tomorrow')) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    dueDateInput.value = tomorrow.toISOString().split('T')[0];
                } else {
                    // Default to today if parsing fails
                    const today = new Date();
                    dueDateInput.value = today.toISOString().split('T')[0];
                }
            }
            
            // Update modal title
            const modalTitle = taskModal.querySelector('.modal-title');
            modalTitle.textContent = 'Edit Task';
            
            // Show modal
            taskModal.style.display = 'flex';
        });
    });
}

function createTaskModal() {
    const modal = document.createElement('div');
    modal.id = 'taskModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3 class="modal-title">Create New Task</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <form id="task-form" data-mode="create">
                    <div class="form-group">
                        <label for="task-title">Title</label>
                        <input type="text" id="task-title" required>
                    </div>
                    <div class="form-group">
                        <label for="task-description">Description</label>
                        <textarea id="task-description" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="task-status">Status</label>
                        <select id="task-status" required>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="task-due-date">Due Date</label>
                        <input type="date" id="task-due-date" required>
                    </div>
                    <div class="form-group">
                        <label for="task-priority">Priority</label>
                        <select id="task-priority" required>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tags</label>
                        <div class="tag-checkboxes">
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="project"> Project
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="research"> Research
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="reading"> Reading
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="writing"> Writing
                            </label>
                            <label class="tag-label">
                                <input type="checkbox" class="tag-checkbox" value="revision"> Revision
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
        
        const title = this.querySelector('#task-title').value;
        const description = this.querySelector('#task-description').value;
        const status = this.querySelector('#task-status').value;
        const dueDate = this.querySelector('#task-due-date').value;
        const priority = this.querySelector('#task-priority').value;
        
        // Get selected tags
        const selectedTags = [];
        this.querySelectorAll('.tag-checkbox:checked').forEach(checkbox => {
            selectedTags.push(checkbox.value);
        });
        
        // In a real app, this would save to a database
        // For now, we'll just show a success message
        const mode = this.getAttribute('data-mode');
        
        if (mode === 'create') {
            // Create new task card and add to grid
            const tasksGrid = document.querySelector('.notebooks-grid');
            if (tasksGrid) {
                const newCard = createTaskCard({
                    id: 'task-' + Date.now(),
                    title: title,
                    description: description,
                    status: status,
                    dueDate: formatDueDate(dueDate),
                    priority: priority,
                    tags: selectedTags
                });
                
                tasksGrid.insertBefore(newCard, tasksGrid.firstChild);
                
                // Show success message
                showToast('Task created successfully!');
            }
        } else if (mode === 'edit') {
            // Update existing task card
            const taskId = this.getAttribute('data-task-id');
            const taskCard = document.querySelector(`.notebook-card[data-task-id="${taskId}"]`);
            
            if (taskCard) {
                // Update task card content
                taskCard.querySelector('h3').textContent = title;
                taskCard.querySelector('.notebook-desc').textContent = description;
                
                // Update status
                const statusElement = taskCard.querySelector('.task-status');
                statusElement.className = 'task-status ' + status;
                statusElement.textContent = status === 'in-progress' ? 'In Progress' : 
                                           status === 'pending' ? 'Pending' : 'Done';
                
                // Update due date
                taskCard.querySelector('.notebook-time').textContent = formatDueDate(dueDate);
                
                // Update priority indicator (visual cue based on priority)
                const iconElement = taskCard.querySelector('.notebook-icon i');
                if (iconElement) {
                    // Change icon color based on priority
                    if (priority === 'high') {
                        iconElement.style.color = '#FF5F5F';
                    } else if (priority === 'medium') {
                        iconElement.style.color = '#FFD700';
                    } else {
                        iconElement.style.color = '#5F9EFF';
                    }
                }
                
                // Show success message
                showToast('Task updated successfully!');
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

function createTaskCard(data) {
    const card = document.createElement('div');
    card.className = 'notebook-card';
    card.setAttribute('data-task-id', data.id);
    card.setAttribute('data-tags', data.tags.join(','));
    
    // Determine icon color based on priority
    let iconColor = '#5F9EFF';
    if (data.priority === 'high') {
        iconColor = '#FF5F5F';
    } else if (data.priority === 'medium') {
        iconColor = '#FFD700';
    }
    
    card.innerHTML = `
        <div class="notebook-icon"><i class="fas fa-exclamation-circle" style="color: ${iconColor};"></i></div>
        <div class="notebook-info">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3>${data.title}</h3>
                <span class="task-status ${data.status}">${data.status === 'in-progress' ? 'In Progress' : 
                                                          data.status === 'pending' ? 'Pending' : 'Done'}</span>
            </div>
            <p class="notebook-desc">${data.description}</p>
            <div class="notebook-footer">
                <p class="notebook-time">${data.dueDate}</p>
                <div class="notebook-tags">
                    ${data.tags.map(tag => `<span class="notebook-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Make the card clickable for editing
    card.style.cursor = 'pointer';
    
    return card;
}

// Helper function to format due date
function formatDueDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
        return 'Due today';
    }
    
    // Check if date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
        return 'Due tomorrow';
    }
    
    // Otherwise, format the date
    const options = { month: 'short', day: 'numeric' };
    return 'Due ' + date.toLocaleDateString('en-US', options);
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