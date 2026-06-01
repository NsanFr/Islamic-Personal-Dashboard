document.addEventListener("DOMContentLoaded", () => {
    
    const todayStr = getLocalDateString(new Date());

    let tasks = JSON.parse(localStorage.getItem("dashboard_tasks")) || [
        { id: 1, text: "Welcome to your Personal Dashboard!", completed: false, dueDate: todayStr },
        { id: 2, text: "Try changing the color theme in the bottom right corner", completed: false, dueDate: "" },
        { id: 3, text: "Add a new task with a deadline", completed: false, dueDate: todayStr }
    ];

    let activeTheme = localStorage.getItem("dashboard_theme") || "cyberpunk";
    let activeBg = localStorage.getItem("dashboard_bg") || "gradient-default";

    let currentNavDate = new Date();
    let selectedDateStr = todayStr;

    const holidays2026 = {
        "2026-01-01": "New Year's Day 2026",
        "2026-01-27": "Isra Mi'raj",
        "2026-02-17": "Chinese New Year 2577",
        "2026-03-19": "Nyepi (Day of Silence)",
        "2026-03-20": "Eid al-Fitr 1447 H (Day 1)",
        "2026-03-21": "Eid al-Fitr 1447 H (Day 2)",
        "2026-04-03": "Good Friday",
        "2026-04-05": "Easter Sunday",
        "2026-05-01": "International Labor Day",
        "2026-05-13": "Ascension of Jesus Christ",
        "2026-05-27": "Eid al-Adha 1447 H",
        "2026-06-01": "Pancasila Day",
        "2026-06-16": "Islamic New Year 1448 H",
        "2026-08-17": "Indonesian Independence Day",
        "2026-08-25": "The Prophet's Birthday",
        "2026-12-25": "Christmas Day"
    };

    const clockTime = document.getElementById("clock-time");
    const clockAmpm = document.getElementById("clock-ampm");
    const currentDate = document.getElementById("current-date");
    const prayerHijriDate = document.getElementById("prayer-hijri-date");

    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoDate = document.getElementById("todo-date");
    const todoList = document.getElementById("todo-list");
    const todoProgress = document.getElementById("todo-progress");
    const progressPercentage = document.getElementById("progress-percentage");
    const taskCounter = document.getElementById("task-counter");

    const calendarDaysGrid = document.getElementById("calendar-days-grid");
    const calendarMonthYear = document.getElementById("calendar-month-year");
    const calendarHijriMonthInfo = document.getElementById("calendar-hijri-month-info");
    const btnPrevMonth = document.getElementById("btn-prev-month");
    const btnNextMonth = document.getElementById("btn-next-month");
    
    const selectedDayPanel = document.getElementById("selected-day-panel");
    const selectedDayTitle = document.getElementById("selected-day-title");
    const selectedDayHijri = document.getElementById("selected-day-hijri");
    const selectedDayTasks = document.getElementById("selected-day-tasks");
    const calendarQuickAddForm = document.getElementById("calendar-quick-add-form");
    const calendarQuickAddInput = document.getElementById("calendar-quick-add-input");

    const notesTextarea = document.getElementById("notes-textarea");
    const notesStatus = document.getElementById("notes-status");

    const btnToggleConfig = document.getElementById("btn-toggle-config");
    const configDrawer = document.getElementById("config-drawer");
    const themeOpts = document.querySelectorAll(".theme-opt");
    const bgOpts = document.querySelectorAll(".bg-opt");

    function updateClock() {
        const now = new Date();
        
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12; 
        
        hours = String(hours).padStart(2, '0');
        minutes = String(minutes).padStart(2, '0');
        seconds = String(seconds).padStart(2, '0');
        
        clockTime.textContent = `${hours}:${minutes}:${seconds}`;
        clockAmpm.textContent = ampm;
    }

    function updateGreetingAndDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', options);
        currentDate.textContent = formattedDate;

        if (prayerHijriDate) {
            const hijri = getHijriData(now);
            prayerHijriDate.textContent = `${hijri.day} ${hijri.monthYear}`;
        }
    }

    setInterval(updateClock, 1000);
    updateClock();
    updateGreetingAndDate();
    setInterval(updateGreetingAndDate, 60000);


    function renderTasks() {
        todoList.innerHTML = "";
        
        const sortedTasks = [...tasks].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate.localeCompare(b.dueDate);
        });

        sortedTasks.forEach(task => {
            const li = document.createElement("li");
            li.className = `todo-item ${task.completed ? 'completed' : ''}`;
            
            let deadlineBadgeHtml = "";
            if (task.dueDate) {
                const formattedBadge = formatShortDate(task.dueDate);
                deadlineBadgeHtml = `
                    <span class="task-deadline-badge" title="Deadline: ${formatDateEn(task.dueDate)}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        ${formattedBadge}
                    </span>
                `;
            }

            li.innerHTML = `
                <div class="todo-item-left" title="Click to toggle completion">
                    <span class="todo-checkbox">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                    <span class="todo-text" title="${escapeHtml(task.text)}">${escapeHtml(task.text)}</span>
                </div>
                ${deadlineBadgeHtml}
                <button class="btn-delete" title="Delete Task">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            `;

            li.querySelector(".todo-item-left").addEventListener("click", () => {
                toggleTask(task.id);
            });

            li.querySelector(".btn-delete").addEventListener("click", (e) => {
                e.stopPropagation();
                deleteTask(task.id);
            });

            todoList.appendChild(li);
        });

        updateProgress();
        saveTasks();
        
        renderCalendar(currentNavDate);
        updateSelectedDayPanel();
    }

    function toggleTask(id) {
        tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }

    function updateProgress() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        todoProgress.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}% completed`;
        taskCounter.textContent = `${completed} / ${total}`;
    }

    function saveTasks() {
        localStorage.setItem("dashboard_tasks", JSON.stringify(tasks));
    }

    todoForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        const dateVal = todoDate.value;

        if (text === "") return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false,
            dueDate: dateVal
        };

        tasks.push(newTask);
        todoInput.value = "";
        todoDate.value = "";
        
        renderTasks();
        todoList.scrollTop = todoList.scrollHeight;
    });


    
    function getHijriData(date) {
        try {
            const formatterDay = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { day: 'numeric' });
            const formatterMonthYear = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', { month: 'long', year: 'numeric' });
            
            return {
                day: formatterDay.format(date),
                monthYear: formatterMonthYear.format(date)
            };
        } catch (e) {
            return { day: "", monthYear: "" };
        }
    }

    function renderCalendar(navDate) {
        calendarDaysGrid.innerHTML = "";
        
        const year = navDate.getFullYear();
        const month = navDate.getMonth();
        
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        const firstDayIndex = new Date(year, month, 1).getDay();
        
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayIndex; i++) {
            const emptyCell = document.createElement("div");
            emptyCell.className = "calendar-day-cell empty";
            calendarDaysGrid.appendChild(emptyCell);
        }

        for (let d = 1; d <= totalDays; d++) {
            const dateObj = new Date(year, month, d);
            const dateStr = getLocalDateString(dateObj);
            
            const hijri = getHijriData(dateObj);
            
            const isToday = (dateStr === todayStr);
            const isSelected = (dateStr === selectedDateStr);
            const isSunday = (dateObj.getDay() === 0);
            const holidayName = holidays2026[dateStr];

            const cell = document.createElement("div");
            cell.className = "calendar-day-cell";
            if (isToday) cell.classList.add("today");
            if (isSelected) cell.classList.add("selected");
            if (isSunday) cell.classList.add("sunday");
            if (holidayName) {
                cell.classList.add("holiday");
                cell.title = holidayName;
            }

            cell.innerHTML = `
                <span class="masehi-num">${d}</span>
                <span class="hijri-num">${hijri.day}</span>
            `;

            const hasTasks = tasks.some(t => t.dueDate === dateStr);
            if (hasTasks) {
                const dot = document.createElement("span");
                dot.className = "calendar-task-dot";
                cell.appendChild(dot);
            }

            cell.addEventListener("click", () => {
                selectedDateStr = dateStr;
                
                document.querySelectorAll(".calendar-day-cell").forEach(c => c.classList.remove("selected"));
                cell.classList.add("selected");
                
                updateSelectedDayPanel(dateObj, dateStr, hijri, holidayName);
            });

            calendarDaysGrid.appendChild(cell);
        }

        const firstDayHijri = getHijriData(new Date(year, month, 1));
        const lastDayHijri = getHijriData(new Date(year, month, totalDays));
        let hijriRange = firstDayHijri.monthYear;
        if (firstDayHijri.monthYear !== lastDayHijri.monthYear) {
            hijriRange = `${firstDayHijri.monthYear} / ${lastDayHijri.monthYear}`;
        }
        calendarHijriMonthInfo.textContent = hijriRange;
    }

    function updateSelectedDayPanel(dateObj, dateStr, hijri, holidayName) {
        if (!dateObj) {
            const [y, m, d] = selectedDateStr.split("-");
            dateObj = new Date(y, m - 1, d);
            hijri = getHijriData(dateObj);
            holidayName = holidays2026[selectedDateStr];
        }

        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        let formattedMasehi = dateObj.toLocaleDateString('en-US', options);
        if (holidayName) {
            formattedMasehi += ` — 🎉 ${holidayName}`;
        }
        selectedDayTitle.textContent = formattedMasehi;

        selectedDayHijri.textContent = hijri ? hijri.monthYear : "Select a date";

        calendarQuickAddForm.classList.remove("hidden");

        const dayTasks = tasks.filter(t => t.dueDate === selectedDateStr);
        selectedDayTasks.innerHTML = "";

        if (dayTasks.length === 0) {
            selectedDayTasks.innerHTML = `<li class="no-tasks-message">No task deadlines for this day.</li>`;
        } else {
            dayTasks.forEach(task => {
                const li = document.createElement("li");
                li.className = `selected-day-task-item ${task.completed ? 'completed' : ''}`;
                
                li.innerHTML = `
                    <span class="todo-checkbox">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </span>
                    <span>${escapeHtml(task.text)}</span>
                `;

                li.addEventListener("click", () => {
                    toggleTask(task.id);
                });

                selectedDayTasks.appendChild(li);
            });
        }
    }

    calendarQuickAddForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = calendarQuickAddInput.value.trim();
        if (text === "") return;

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false,
            dueDate: selectedDateStr
        };

        tasks.push(newTask);
        calendarQuickAddInput.value = "";
        
        renderTasks();
    });

    btnPrevMonth.addEventListener("click", () => {
        currentNavDate.setMonth(currentNavDate.getMonth() - 1);
        renderCalendar(currentNavDate);
    });

    btnNextMonth.addEventListener("click", () => {
        currentNavDate.setMonth(currentNavDate.getMonth() + 1);
        renderCalendar(currentNavDate);
    });

    notesTextarea.value = localStorage.getItem("dashboard_notes") || "";

    let saveTimeout = null;
    notesTextarea.addEventListener("input", () => {
        notesStatus.textContent = "Typing...";
        notesStatus.style.color = "var(--color-accent-alt)";
        
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem("dashboard_notes", notesTextarea.value);
            notesStatus.textContent = "Auto-saved";
            notesStatus.style.color = "var(--text-muted)";
        }, 800); 
    });


    applyTheme(activeTheme);
    applyBg(activeBg);

    btnToggleConfig.addEventListener("click", () => {
        configDrawer.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
        if (!btnToggleConfig.contains(e.target) && !configDrawer.contains(e.target)) {
            configDrawer.classList.add("hidden");
        }
    });

    themeOpts.forEach(opt => {
        opt.addEventListener("click", () => {
            const theme = opt.getAttribute("data-theme");
            applyTheme(theme);
        });
    });

    bgOpts.forEach(opt => {
        opt.addEventListener("click", () => {
            const bg = opt.getAttribute("data-bg");
            applyBg(bg);
        });
    });

    function applyTheme(themeName) {
        document.body.classList.forEach(className => {
            if (className.startsWith("theme-")) {
                document.body.classList.remove(className);
            }
        });

        document.body.classList.add(`theme-${themeName}`);
        activeTheme = themeName;
        localStorage.setItem("dashboard_theme", themeName);

        themeOpts.forEach(o => {
            if (o.getAttribute("data-theme") === themeName) {
                o.classList.add("active");
            } else {
                o.classList.remove("active");
            }
        });
    }

    function applyBg(bgName) {
        document.body.classList.forEach(className => {
            if (className.startsWith("bg-")) {
                document.body.classList.remove(className);
            }
        });

        document.body.classList.add(`bg-${bgName}`);
        activeBg = bgName;
        localStorage.setItem("dashboard_bg", bgName);

        bgOpts.forEach(o => {
            if (o.getAttribute("data-bg") === bgName) {
                o.classList.add("active");
            } else {
                o.classList.remove("active");
            }
        });
    }


    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    function getLocalDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatShortDate(dateStr) {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-");
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${parseInt(d)} ${months[parseInt(m) - 1]}`;
    }

    function formatDateEn(dateStr) {
        if (!dateStr) return "";
        const [y, m, d] = dateStr.split("-");
        const dateObj = new Date(y, m - 1, d);
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return dateObj.toLocaleDateString('en-US', options);
    }


    renderTasks();
    
    renderCalendar(currentNavDate);
    updateSelectedDayPanel();

});
