// Main JavaScript for Student Dashboard

document.addEventListener('DOMContentLoaded', function() {
    // View controls for notebooks (grid/list toggle)
    const btnGrid = document.querySelector('.btn-grid');
    const btnList = document.querySelector('.btn-list');
    const notebooksGrid = document.querySelector('.notebooks-grid');
    
    if (btnGrid && btnList && notebooksGrid) {
        btnGrid.addEventListener('click', function() {
            notebooksGrid.style.display = 'grid';
            btnGrid.classList.add('active');
            btnList.classList.remove('active');
        });
        
        btnList.addEventListener('click', function() {
            notebooksGrid.style.display = 'block';
            btnList.classList.add('active');
            btnGrid.classList.remove('active');
            
            // Adjust card style for list view
            const cards = notebooksGrid.querySelectorAll('.notebook-card');
            cards.forEach(card => {
                card.style.maxWidth = '100%';
            });
        });
    }
    
    // Hide/Show modules section
    const btnHide = document.querySelector('.btn-hide');
    const modulesGrid = document.querySelector('.modules-grid');
    
    if (btnHide && modulesGrid) {
        btnHide.addEventListener('click', function() {
            if (modulesGrid.style.display === 'none') {
                modulesGrid.style.display = 'grid';
                btnHide.textContent = 'Hide';
            } else {
                modulesGrid.style.display = 'none';
                btnHide.textContent = 'Show';
            }
        });
    }
    
    // Dynamic greeting based on time of day
    const greeting = document.querySelector('.greeting-section h1');
    if (greeting) {
        const hour = new Date().getHours();
        let greetingText = 'Good ';
        
        if (hour < 12) {
            greetingText += 'morning';
        } else if (hour < 18) {
            greetingText += 'afternoon';
        } else {
            greetingText += 'evening';
        }
        
        // Extract the name from the existing greeting
        const nameMatch = greeting.textContent.match(/Good (?:morning|afternoon|evening), (.+)!/);
        if (nameMatch && nameMatch[1]) {
            greetingText += ', ' + nameMatch[1] + '!';
            greeting.textContent = greetingText;
        }
    }
    
    // Mobile menu toggle (for responsive design)
    // This would be implemented if we had a hamburger menu for mobile
    
    // Join button functionality
    const joinButtons = document.querySelectorAll('.btn-join');
    joinButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real app, this would redirect to a meeting URL
            alert('Joining virtual class session...');
        });
    });
});