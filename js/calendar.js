// JavaScript for Calendar Page Enhancements

document.addEventListener('DOMContentLoaded', function() {
    // Initialize calendar view controls
    initializeCalendarViewControls();
    
    // Initialize month navigation
    initializeMonthNavigation();
    
    // Initialize task display integration
    initializeTaskDisplay();
    
    // Initialize calendar with current month
    const currentDate = new Date();
    updateCalendarGrid(currentDate.getMonth(), currentDate.getFullYear());
});

// Calendar View Controls
function initializeCalendarViewControls() {
    const btnMonth = document.querySelector('.btn-grid');
    const btnWeek = document.querySelector('.btn-list');
    const btnDay = document.querySelector('.btn-day');
    const calendarGrid = document.querySelector('.calendar-grid');
    const weekView = document.querySelector('.week-view');
    const dayView = document.querySelector('.day-view');
    
    if (!btnMonth || !btnWeek || !calendarGrid) return;
    
    // Enhance view toggle buttons styling
    const viewButtons = [btnMonth, btnWeek];
    if (btnDay) viewButtons.push(btnDay);
    
    viewButtons.forEach(btn => {
        // Apply enhanced styling to all view buttons
        btn.style.padding = '8px 16px';
        btn.style.margin = '0 5px';
        btn.style.borderRadius = '20px';
        btn.style.border = '2px solid #3A3A3A';
        btn.style.backgroundColor = '#2A2A2A';
        btn.style.color = '#FFFFFF';
        btn.style.fontWeight = '600';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.2s ease';
        
        // Add hover effect
        btn.addEventListener('mouseover', function() {
            if (!this.classList.contains('active')) {
                this.style.backgroundColor = '#3A3A3A';
                this.style.borderColor = '#5F9EFF';
            }
        });
        
        btn.addEventListener('mouseout', function() {
            if (!this.classList.contains('active')) {
                this.style.backgroundColor = '#2A2A2A';
                this.style.borderColor = '#3A3A3A';
            }
        });
    });
    
    // Function to update active button styling
    function updateActiveButtonStyle(activeBtn) {
        viewButtons.forEach(btn => {
            if (btn === activeBtn) {
                btn.classList.add('active');
                btn.style.backgroundColor = '#5F9EFF';
                btn.style.borderColor = '#5F9EFF';
                btn.style.color = '#FFFFFF';
            } else {
                btn.classList.remove('active');
                btn.style.backgroundColor = '#2A2A2A';
                btn.style.borderColor = '#3A3A3A';
                btn.style.color = '#FFFFFF';
            }
        });
    }
    
    // Month view (default)
    btnMonth.addEventListener('click', function() {
        updateActiveButtonStyle(this);
        
        // Show only month view
        calendarGrid.style.display = 'grid';
        if (weekView) weekView.style.display = 'none';
        if (dayView) dayView.style.display = 'none';
    });
    
    // Week view
    btnWeek.addEventListener('click', function() {
        updateActiveButtonStyle(this);
        
        // Show only week view
        calendarGrid.style.display = 'none';
        if (dayView) dayView.style.display = 'none';
        
        if (weekView) {
            weekView.style.display = 'block';
        } else {
            // Create week view if it doesn't exist
            const newWeekView = createWeekView();
            weekView = newWeekView; // Store reference to the created view
        }
    });
    
    // Day view (if available)
    if (btnDay) {
        btnDay.addEventListener('click', function() {
            updateActiveButtonStyle(this);
            
            // Show only day view
            calendarGrid.style.display = 'none';
            
            // Make sure week view is hidden
            const existingWeekView = document.querySelector('.week-view');
            if (existingWeekView) existingWeekView.style.display = 'none';
            
            let existingDayView = document.querySelector('.day-view');
            if (existingDayView) {
                existingDayView.style.display = 'block';
            } else {
                // Create day view if it doesn't exist
                const newDayView = createDayView();
                dayView = newDayView; // Store reference to the created view
            }
        });
    }
    
    // Set default active button
    updateActiveButtonStyle(btnMonth);
}

// Month Navigation
function initializeMonthNavigation() {
    // Get or create navigation buttons
    let prevMonthBtn = document.querySelector('.prev-month-btn');
    let nextMonthBtn = document.querySelector('.next-month-btn');
    const calendarHeader = document.querySelector('.section-header h2');
    
    if (!calendarHeader) return;
    
    // Create navigation buttons if they don't exist
    if (!prevMonthBtn || !nextMonthBtn) {
        const navContainer = document.createElement('div');
        navContainer.className = 'month-navigation';
        navContainer.style.display = 'flex';
        navContainer.style.alignItems = 'center';
        navContainer.style.justifyContent = 'space-between';
        navContainer.style.marginTop = '10px';
        navContainer.style.marginBottom = '15px';
        
        prevMonthBtn = document.createElement('button');
        prevMonthBtn.className = 'prev-month-btn';
        prevMonthBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        nextMonthBtn = document.createElement('button');
        nextMonthBtn.className = 'next-month-btn';
        nextMonthBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        // Enhanced styling for navigation buttons
        [prevMonthBtn, nextMonthBtn].forEach(btn => {
            btn.style.width = '40px';
            btn.style.height = '40px';
            btn.style.borderRadius = '50%';
            btn.style.backgroundColor = '#2A2A2A';
            btn.style.border = '2px solid #3A3A3A';
            btn.style.color = '#5F9EFF';
            btn.style.fontSize = '16px';
            btn.style.cursor = 'pointer';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.style.transition = 'all 0.2s ease';
            
            // Add hover effect
            btn.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#3A3A3A';
                this.style.borderColor = '#5F9EFF';
                this.style.transform = 'scale(1.05)';
            });
            
            btn.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#2A2A2A';
                this.style.borderColor = '#3A3A3A';
                this.style.transform = 'scale(1)';
            });
            
            // Add active effect
            btn.addEventListener('mousedown', function() {
                this.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('mouseup', function() {
                this.style.transform = 'scale(1.05)';
            });
        });
        
        navContainer.appendChild(prevMonthBtn);
        navContainer.appendChild(nextMonthBtn);
        
        // Insert navigation buttons next to the calendar header
        calendarHeader.parentNode.insertBefore(navContainer, calendarHeader.nextSibling);
    }
    
    // Current date tracking
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Update calendar header
    updateCalendarHeader(currentMonth, currentYear);
    
    // Previous month button
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendarHeader(currentMonth, currentYear);
        updateCalendarGrid(currentMonth, currentYear);
    });
    
    // Next month button
    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendarHeader(currentMonth, currentYear);
        updateCalendarGrid(currentMonth, currentYear);
    });
}

// Update calendar header with month and year
function updateCalendarHeader(month, year) {
    const calendarHeader = document.querySelector('.section-header h2');
    if (!calendarHeader) return;
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    calendarHeader.textContent = `${monthNames[month]} ${year}`;
}

// Update calendar grid with new month data
function updateCalendarGrid(month, year) {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    // Clear existing calendar days (except header row)
    const headerRow = [];
    for (let i = 0; i < 7; i++) {
        headerRow.push(calendarGrid.children[i]);
    }
    
    calendarGrid.innerHTML = '';
    
    // Re-add header row
    headerRow.forEach(cell => calendarGrid.appendChild(cell));
    
    // Get first day of month and number of days in month
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get number of days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Adjust for Monday as first day of week (if needed)
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    // Add days from previous month
    for (let i = 0; i < startOffset; i++) {
        const day = daysInPrevMonth - startOffset + i + 1;
        const dayCell = createDayCell(day, 'prev-month');
        calendarGrid.appendChild(dayCell);
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = createDayCell(i, 'current-month');
        
        // Check if this is today's date
        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.classList.add('today');
        }
        
        calendarGrid.appendChild(dayCell);
    }
    
    // Add days from next month to complete the grid
    const totalCells = 7 * Math.ceil((startOffset + daysInMonth) / 7);
    const remainingCells = totalCells - (startOffset + daysInMonth);
    
    for (let i = 1; i <= remainingCells; i++) {
        const dayCell = createDayCell(i, 'next-month');
        calendarGrid.appendChild(dayCell);
    }
    
    // Re-integrate tasks into the calendar
    integrateTasksIntoCalendar();
}

// Create a day cell for the calendar
function createDayCell(day, monthClass) {
    const dayCell = document.createElement('div');
    dayCell.className = `calendar-day ${monthClass}`;
    dayCell.style.backgroundColor = '#1E1E1E';
    dayCell.style.padding = '10px';
    dayCell.style.minHeight = '100px';
    dayCell.style.borderRadius = '8px';
    dayCell.textContent = day;
    
    return dayCell;
}

// Create week view
function createWeekView() {
    const calendarContainer = document.querySelector('.calendar-grid').parentNode;
    
    // Check if week view already exists
    let weekView = document.querySelector('.week-view');
    if (weekView) {
        weekView.style.display = 'block';
        return weekView;
    }
    
    // Create week view container
    weekView = document.createElement('div');
    weekView.className = 'week-view';
    weekView.style.width = '100%';
    weekView.style.marginBottom = '30px';
    
    // Get current date and start of week
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday as start of week
    
    // Create week navigation
    const weekNavigation = document.createElement('div');
    weekNavigation.className = 'week-navigation';
    weekNavigation.style.display = 'flex';
    weekNavigation.style.justifyContent = 'space-between';
    weekNavigation.style.alignItems = 'center';
    weekNavigation.style.marginBottom = '15px';
    
    // Previous week button
    const prevWeekBtn = document.createElement('button');
    prevWeekBtn.className = 'prev-week-btn';
    prevWeekBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevWeekBtn.style.width = '40px';
    prevWeekBtn.style.height = '40px';
    prevWeekBtn.style.borderRadius = '50%';
    prevWeekBtn.style.backgroundColor = '#2A2A2A';
    prevWeekBtn.style.border = '2px solid #3A3A3A';
    prevWeekBtn.style.color = '#5F9EFF';
    prevWeekBtn.style.fontSize = '16px';
    prevWeekBtn.style.cursor = 'pointer';
    prevWeekBtn.style.display = 'flex';
    prevWeekBtn.style.alignItems = 'center';
    prevWeekBtn.style.justifyContent = 'center';
    prevWeekBtn.style.transition = 'all 0.2s ease';
    
    // Add hover effect
    prevWeekBtn.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#3A3A3A';
        this.style.borderColor = '#5F9EFF';
        this.style.transform = 'scale(1.05)';
    });
    
    prevWeekBtn.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#2A2A2A';
        this.style.borderColor = '#3A3A3A';
        this.style.transform = 'scale(1)';
    });
    
    // Add active effect
    prevWeekBtn.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    prevWeekBtn.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    // Week header
    const weekHeader = document.createElement('h3');
    weekHeader.className = 'week-header-title';
    weekHeader.textContent = `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    weekHeader.style.margin = '0';
    weekHeader.style.fontSize = '18px';
    
    // Next week button
    const nextWeekBtn = document.createElement('button');
    nextWeekBtn.className = 'next-week-btn';
    nextWeekBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextWeekBtn.style.width = '40px';
    nextWeekBtn.style.height = '40px';
    nextWeekBtn.style.borderRadius = '50%';
    nextWeekBtn.style.backgroundColor = '#2A2A2A';
    nextWeekBtn.style.border = '2px solid #3A3A3A';
    nextWeekBtn.style.color = '#5F9EFF';
    nextWeekBtn.style.fontSize = '16px';
    nextWeekBtn.style.cursor = 'pointer';
    nextWeekBtn.style.display = 'flex';
    nextWeekBtn.style.alignItems = 'center';
    nextWeekBtn.style.justifyContent = 'center';
    nextWeekBtn.style.transition = 'all 0.2s ease';
    
    // Add hover effect
    nextWeekBtn.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#3A3A3A';
        this.style.borderColor = '#5F9EFF';
        this.style.transform = 'scale(1.05)';
    });
    
    nextWeekBtn.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#2A2A2A';
        this.style.borderColor = '#3A3A3A';
        this.style.transform = 'scale(1)';
    });
    
    // Add active effect
    nextWeekBtn.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    nextWeekBtn.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    // Add navigation elements
    weekNavigation.appendChild(prevWeekBtn);
    weekNavigation.appendChild(weekHeader);
    weekNavigation.appendChild(nextWeekBtn);
    weekView.appendChild(weekNavigation);
    
    // Create time column
    const weekContainer = document.createElement('div');
    weekContainer.className = 'week-container';
    weekContainer.style.display = 'flex';
    weekContainer.style.width = '100%';
    
    // Create time labels column
    const timeLabels = document.createElement('div');
    timeLabels.className = 'time-labels';
    timeLabels.style.width = '60px';
    timeLabels.style.flexShrink = '0';
    timeLabels.style.marginRight = '10px';
    timeLabels.style.marginTop = '50px'; // Space for day headers
    
    // Create day columns container
    const daysContainer = document.createElement('div');
    daysContainer.className = 'days-container';
    daysContainer.style.flex = '1';
    daysContainer.style.display = 'grid';
    daysContainer.style.gridTemplateColumns = 'repeat(7, 1fr)';
    daysContainer.style.gap = '8px';
    
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Create day headers
    dayNames.forEach((day, index) => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'week-day-header';
        dayHeader.style.backgroundColor = '#2A2A2A';
        dayHeader.style.padding = '10px';
        dayHeader.style.textAlign = 'center';
        dayHeader.style.fontWeight = '600';
        dayHeader.style.borderRadius = '8px 8px 0 0';
        
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + index);
        
        // Highlight today
        if (currentDay.toDateString() === today.toDateString()) {
            dayHeader.style.backgroundColor = '#3A3A3A';
            dayHeader.style.color = '#5F9EFF';
            dayHeader.style.fontWeight = '700';
        }
        
        dayHeader.innerHTML = `${day}<br>${currentDay.getDate()}`;
        daysContainer.appendChild(dayHeader);
    });
    
    // Create time slots
    const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    
    hours.forEach(hour => {
        // Add time label
        const timeLabel = document.createElement('div');
        timeLabel.className = 'time-label';
        timeLabel.textContent = hour;
        timeLabel.style.height = '60px';
        timeLabel.style.display = 'flex';
        timeLabel.style.alignItems = 'center';
        timeLabel.style.justifyContent = 'flex-end';
        timeLabel.style.paddingRight = '10px';
        timeLabel.style.color = '#AAAAAA';
        timeLabel.style.fontSize = '12px';
        timeLabels.appendChild(timeLabel);
        
        // Create time slots for each day
        for (let i = 0; i < 7; i++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'time-slot';
            timeSlot.setAttribute('data-hour', hour);
            timeSlot.setAttribute('data-day', i);
            timeSlot.style.backgroundColor = '#1E1E1E';
            timeSlot.style.height = '60px';
            timeSlot.style.borderRadius = '4px';
            timeSlot.style.position = 'relative';
            timeSlot.style.cursor = 'pointer';
            timeSlot.style.transition = 'background-color 0.2s';
            
            // Hover effect
            timeSlot.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#2A2A2A';
            });
            
            timeSlot.addEventListener('mouseout', function() {
                this.style.backgroundColor = '#1E1E1E';
            });
            
            // Click to add event
            timeSlot.addEventListener('click', function() {
                alert(`Add event on ${dayNames[i]} at ${hour}`);
            });
            
            daysContainer.appendChild(timeSlot);
        }
    });
    
    weekContainer.appendChild(timeLabels);
    weekContainer.appendChild(daysContainer);
    weekView.appendChild(weekContainer);
    
    calendarContainer.appendChild(weekView);
    
    // Week navigation functionality
    let currentWeekStart = new Date(startOfWeek);
    
    prevWeekBtn.addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateWeekView(weekView, currentWeekStart);
    });
    
    nextWeekBtn.addEventListener('click', function() {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateWeekView(weekView, currentWeekStart);
    });
    
    // Set week view to display block
    weekView.style.display = 'block';
    
    return weekView;
}

// Update week view with new dates
function updateWeekView(weekView, startOfWeek) {
    const weekHeader = weekView.querySelector('.week-header-title');
    weekHeader.textContent = `Week of ${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    
    const dayHeaders = weekView.querySelectorAll('.week-day-header');
    const today = new Date();
    
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    dayHeaders.forEach((header, index) => {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + index);
        
        // Reset styles
        header.style.backgroundColor = '#2A2A2A';
        header.style.color = '';
        header.style.fontWeight = '600';
        
        // Highlight today
        if (currentDay.toDateString() === today.toDateString()) {
            header.style.backgroundColor = '#3A3A3A';
            header.style.color = '#5F9EFF';
            header.style.fontWeight = '700';
        }
        
        header.innerHTML = `${dayNames[index]}<br>${currentDay.getDate()}`;
    });
    
    // Clear existing events and re-integrate tasks
    const timeSlots = weekView.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        // Remove existing events
        while (slot.firstChild) {
            slot.removeChild(slot.firstChild);
        }
    });
    
    // Re-integrate tasks (would fetch from database in a real app)
    integrateTasksIntoCalendar();
}

// Create day view
function createDayView() {
    const calendarContainer = document.querySelector('.calendar-grid').parentNode;
    
    // Check if day view already exists
    let dayView = document.querySelector('.day-view');
    if (dayView) {
        dayView.style.display = 'block';
        return dayView;
    }
    
    // Create day view container
    dayView = document.createElement('div');
    dayView.className = 'day-view';
    dayView.style.width = '100%';
    dayView.style.marginBottom = '30px';
    
    // Get current date
    const today = new Date();
    
    // Create day navigation
    const dayNavigation = document.createElement('div');
    dayNavigation.className = 'day-navigation';
    dayNavigation.style.display = 'flex';
    dayNavigation.style.justifyContent = 'space-between';
    dayNavigation.style.alignItems = 'center';
    dayNavigation.style.marginBottom = '15px';
    
    // Previous day button
    const prevDayBtn = document.createElement('button');
    prevDayBtn.className = 'prev-day-btn';
    prevDayBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevDayBtn.style.width = '40px';
    prevDayBtn.style.height = '40px';
    prevDayBtn.style.borderRadius = '50%';
    prevDayBtn.style.backgroundColor = '#2A2A2A';
    prevDayBtn.style.border = '2px solid #3A3A3A';
    prevDayBtn.style.color = '#5F9EFF';
    prevDayBtn.style.fontSize = '16px';
    prevDayBtn.style.cursor = 'pointer';
    prevDayBtn.style.display = 'flex';
    prevDayBtn.style.alignItems = 'center';
    prevDayBtn.style.justifyContent = 'center';
    prevDayBtn.style.transition = 'all 0.2s ease';
    
    // Add hover effect
    prevDayBtn.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#3A3A3A';
        this.style.borderColor = '#5F9EFF';
        this.style.transform = 'scale(1.05)';
    });
    
    prevDayBtn.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#2A2A2A';
        this.style.borderColor = '#3A3A3A';
        this.style.transform = 'scale(1)';
    });
    
    // Add active effect
    prevDayBtn.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    prevDayBtn.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    // Day header
    const dayHeader = document.createElement('h3');
    dayHeader.className = 'day-header-title';
    dayHeader.textContent = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    dayHeader.style.margin = '0';
    dayHeader.style.fontSize = '18px';
    
    // Next day button
    const nextDayBtn = document.createElement('button');
    nextDayBtn.className = 'next-day-btn';
    nextDayBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextDayBtn.style.width = '40px';
    nextDayBtn.style.height = '40px';
    nextDayBtn.style.borderRadius = '50%';
    nextDayBtn.style.backgroundColor = '#2A2A2A';
    nextDayBtn.style.border = '2px solid #3A3A3A';
    nextDayBtn.style.color = '#5F9EFF';
    nextDayBtn.style.fontSize = '16px';
    nextDayBtn.style.cursor = 'pointer';
    nextDayBtn.style.display = 'flex';
    nextDayBtn.style.alignItems = 'center';
    nextDayBtn.style.justifyContent = 'center';
    nextDayBtn.style.transition = 'all 0.2s ease';
    
    // Add hover effect
    nextDayBtn.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#3A3A3A';
        this.style.borderColor = '#5F9EFF';
        this.style.transform = 'scale(1.05)';
    });
    
    nextDayBtn.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#2A2A2A';
        this.style.borderColor = '#3A3A3A';
        this.style.transform = 'scale(1)';
    });
    
    // Add active effect
    nextDayBtn.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    nextDayBtn.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    // Add navigation elements
    dayNavigation.appendChild(prevDayBtn);
    dayNavigation.appendChild(dayHeader);
    dayNavigation.appendChild(nextDayBtn);
    dayView.appendChild(dayNavigation);
    
    // Create time slots container with improved styling
    const timeSlots = document.createElement('div');
    timeSlots.className = 'time-slots';
    timeSlots.style.backgroundColor = '#1A1A1A';
    timeSlots.style.borderRadius = '8px';
    timeSlots.style.padding = '15px';
    timeSlots.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    
    const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
    
    hours.forEach(hour => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        timeSlot.setAttribute('data-hour', hour);
        timeSlot.style.display = 'flex';
        timeSlot.style.marginBottom = '10px';
        timeSlot.style.borderLeft = '2px solid #2A2A2A';
        
        const hourLabel = document.createElement('div');
        hourLabel.className = 'hour-label';
        hourLabel.style.width = '80px';
        hourLabel.style.flexShrink = '0';
        hourLabel.style.color = '#AAAAAA';
        hourLabel.style.fontWeight = '500';
        hourLabel.style.textAlign = 'right';
        hourLabel.style.paddingRight = '15px';
        hourLabel.textContent = hour;
        
        const slotContent = document.createElement('div');
        slotContent.className = 'slot-content';
        slotContent.style.flex = '1';
        slotContent.style.backgroundColor = '#1E1E1E';
        slotContent.style.padding = '15px';
        slotContent.style.borderRadius = '8px';
        slotContent.style.minHeight = '60px';
        slotContent.style.cursor = 'pointer';
        slotContent.style.transition = 'background-color 0.2s';
        
        // Hover effect
        slotContent.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#2A2A2A';
        });
        
        slotContent.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#1E1E1E';
        });
        
        // Click to add event
        slotContent.addEventListener('click', function() {
            alert(`Add event at ${hour}`);
        });
        
        timeSlot.appendChild(hourLabel);
        timeSlot.appendChild(slotContent);
        timeSlots.appendChild(timeSlot);
    });
    
    dayView.appendChild(timeSlots);
    calendarContainer.appendChild(dayView);
    
    // Day navigation functionality
    let currentDay = new Date(today);
    
    prevDayBtn.addEventListener('click', function() {
        currentDay.setDate(currentDay.getDate() - 1);
        updateDayView(dayView, currentDay);
    });
    
    nextDayBtn.addEventListener('click', function() {
        currentDay.setDate(currentDay.getDate() + 1);
        updateDayView(dayView, currentDay);
    });
    
    // Set day view to display block
    dayView.style.display = 'block';
    
    return dayView;
}

// Update day view with new date
function updateDayView(dayView, date) {
    const dayHeader = dayView.querySelector('.day-header-title');
    dayHeader.textContent = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    
    // Clear existing events
    const slotContents = dayView.querySelectorAll('.slot-content');
    slotContents.forEach(slot => {
        // Remove existing events
        while (slot.firstChild) {
            slot.removeChild(slot.firstChild);
        }
    });
    
    // Re-integrate tasks (would fetch from database in a real app)
    integrateTasksIntoCalendar();
}

// Task Display Integration
function initializeTaskDisplay() {
    // This function would integrate tasks from the tasks page into the calendar
    // For demonstration purposes, we'll just add some sample tasks
    integrateTasksIntoCalendar();
}

function integrateTasksIntoCalendar() {
    // In a real application, this would fetch tasks from a database or local storage
    // For now, we'll just add some sample tasks to the calendar
    
    // Integrate tasks into month view
    integrateMonthViewTasks();
    
    // Integrate tasks into week view
    integrateWeekViewTasks();
    
    // Integrate tasks into day view
    integrateDayViewTasks();
}

function integrateMonthViewTasks() {
    // Get all calendar days
    const calendarDays = document.querySelectorAll('.calendar-day.current-month');
    if (!calendarDays.length) return;
    
    // Sample tasks with dates
    const tasks = [
        { title: 'Submit Database Assignment', date: 15, color: '#5F9EFF' },
        { title: 'Security Lab Report', date: 18, color: '#FF5F5F' },
        { title: 'UX Design Presentation', date: 22, color: '#5FFF9E' },
        { title: 'Programming Tutorial', date: 10, color: '#B15FFF' },
        { title: 'Group Project Meeting', date: 5, color: '#FF9E5F' },
        { title: 'Research Paper Draft', date: 12, color: '#5FFFD9' }
    ];
    
    // Add tasks to calendar days
    tasks.forEach(task => {
        // Find the corresponding day cell
        calendarDays.forEach(day => {
            if (parseInt(day.textContent) === task.date) {
                // Create task element
                const taskElement = document.createElement('div');
                taskElement.className = 'calendar-task';
                taskElement.style.backgroundColor = task.color;
                taskElement.style.padding = '5px';
                taskElement.style.borderRadius = '4px';
                taskElement.style.marginTop = '5px';
                taskElement.style.fontSize = '12px';
                taskElement.style.whiteSpace = 'nowrap';
                taskElement.style.overflow = 'hidden';
                taskElement.style.textOverflow = 'ellipsis';
                taskElement.style.cursor = 'pointer';
                taskElement.textContent = task.title;
                
                // Add hover effect
                taskElement.addEventListener('mouseover', function() {
                    this.style.filter = 'brightness(1.1)';
                });
                
                taskElement.addEventListener('mouseout', function() {
                    this.style.filter = 'brightness(1)';
                });
                
                // Add click event
                taskElement.addEventListener('click', function() {
                    alert(`Task details: ${task.title}`);
                });
                
                // Add task to day cell
                day.appendChild(taskElement);
            }
        });
    });
}

function integrateWeekViewTasks() {
    // Get all week view time slots
    const weekTimeSlots = document.querySelectorAll('.week-view .time-slot');
    if (!weekTimeSlots.length) return;
    
    // Sample week tasks with day and hour
    const weekTasks = [
        { title: 'Team Meeting', day: 1, hour: '10:00', color: '#5F9EFF', duration: 60 },
        { title: 'Project Review', day: 3, hour: '14:00', color: '#FF5F5F', duration: 90 },
        { title: 'Client Call', day: 4, hour: '11:00', color: '#5FFF9E', duration: 30 },
        { title: 'Code Review', day: 2, hour: '13:00', color: '#B15FFF', duration: 60 },
        { title: 'Team Lunch', day: 5, hour: '12:00', color: '#FF9E5F', duration: 60 }
    ];
    
    // Add tasks to week view
    weekTasks.forEach(task => {
        weekTimeSlots.forEach(slot => {
            if (slot.getAttribute('data-day') == task.day && 
                slot.getAttribute('data-hour') === task.hour) {
                // Create task element
                const taskElement = document.createElement('div');
                taskElement.className = 'week-task';
                taskElement.style.backgroundColor = task.color;
                taskElement.style.padding = '5px 8px';
                taskElement.style.borderRadius = '4px';
                taskElement.style.position = 'absolute';
                taskElement.style.top = '0';
                taskElement.style.left = '0';
                taskElement.style.right = '0';
                taskElement.style.height = `${task.duration / 60 * 100}%`;
                taskElement.style.zIndex = '5';
                taskElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                taskElement.style.overflow = 'hidden';
                taskElement.style.cursor = 'pointer';
                
                // Add task title
                const taskTitle = document.createElement('div');
                taskTitle.style.fontWeight = '600';
                taskTitle.style.fontSize = '12px';
                taskTitle.style.whiteSpace = 'nowrap';
                taskTitle.style.overflow = 'hidden';
                taskTitle.style.textOverflow = 'ellipsis';
                taskTitle.textContent = task.title;
                taskElement.appendChild(taskTitle);
                
                // Add task time
                const taskTime = document.createElement('div');
                taskTime.style.fontSize = '10px';
                taskTime.style.opacity = '0.8';
                taskTime.textContent = `${task.hour} (${task.duration}min)`;
                taskElement.appendChild(taskTime);
                
                // Add hover effect
                taskElement.addEventListener('mouseover', function() {
                    this.style.filter = 'brightness(1.1)';
                });
                
                taskElement.addEventListener('mouseout', function() {
                    this.style.filter = 'brightness(1)';
                });
                
                // Add click event
                taskElement.addEventListener('click', function(e) {
                    e.stopPropagation();
                    alert(`Task details: ${task.title}\nTime: ${task.hour}\nDuration: ${task.duration} minutes`);
                });
                
                // Add task to time slot
                slot.appendChild(taskElement);
            }
        });
    });
}

function integrateDayViewTasks() {
    // Get all day view time slots
    const dayTimeSlots = document.querySelectorAll('.day-view .slot-content');
    if (!dayTimeSlots.length) return;
    
    // Sample day tasks with hour
    const dayTasks = [
        { title: 'Morning Standup', hour: '9:00', color: '#5F9EFF', duration: 30, description: 'Daily team standup meeting' },
        { title: 'Lunch with Team', hour: '12:00', color: '#5FFF9E', duration: 60, description: 'Team lunch at the cafeteria' },
        { title: 'Project Deadline', hour: '16:00', color: '#FF5F5F', duration: 45, description: 'Submit final project deliverables' },
        { title: 'Weekly Review', hour: '14:00', color: '#B15FFF', duration: 60, description: 'Review weekly progress with manager' }
    ];
    
    // Add tasks to day view
    dayTasks.forEach(task => {
        const hours = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
        const index = hours.indexOf(task.hour);
        
        if (index !== -1 && index < dayTimeSlots.length) {
            const slot = dayTimeSlots[index];
            
            // Create task element
            const taskElement = document.createElement('div');
            taskElement.className = 'day-task';
            taskElement.style.backgroundColor = task.color;
            taskElement.style.padding = '10px';
            taskElement.style.borderRadius = '6px';
            taskElement.style.marginBottom = '5px';
            taskElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            taskElement.style.cursor = 'pointer';
            
            // Add task title
            const taskTitle = document.createElement('div');
            taskTitle.style.fontWeight = '600';
            taskTitle.style.fontSize = '14px';
            taskTitle.style.marginBottom = '5px';
            taskTitle.textContent = task.title;
            taskElement.appendChild(taskTitle);
            
            // Add task time
            const taskTime = document.createElement('div');
            taskTime.style.fontSize = '12px';
            taskTime.style.opacity = '0.8';
            taskTime.textContent = `${task.hour} - ${task.duration} minutes`;
            taskElement.appendChild(taskTime);
            
            // Add hover effect
            taskElement.addEventListener('mouseover', function() {
                this.style.filter = 'brightness(1.1)';
            });
            
            taskElement.addEventListener('mouseout', function() {
                this.style.filter = 'brightness(1)';
            });
            
            // Add click event
            taskElement.addEventListener('click', function(e) {
                e.stopPropagation();
                alert(`Task: ${task.title}\nTime: ${task.hour}\nDuration: ${task.duration} minutes\n\n${task.description}`);
            });
            
            // Add task to time slot
            slot.appendChild(taskElement);
        }
    });
}