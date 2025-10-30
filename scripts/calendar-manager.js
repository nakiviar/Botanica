// Plant Care Calendar Manager

class CalendarManager {
    constructor() {
        this.reminders = JSON.parse(localStorage.getItem('plantReminders')) || [];
        this.currentDate = new Date();
        this.initializeNotifications();
    }

    // Initialize browser notifications
    async initializeNotifications() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            console.log('Notification permission:', permission);
        }
    }

    // Add a new care reminder
    addReminder(plantId, taskType, dueDate, frequency) {
        const reminder = {
            id: Date.now(),
            plantId,
            taskType, // watering, fertilizing, pruning, repotting
            dueDate: new Date(dueDate),
            frequency, // daily, weekly, biweekly, monthly
            completed: false,
            createdAt: new Date()
        };

        this.reminders.push(reminder);
        this.saveReminders();
        this.scheduleNotification(reminder);
        return reminder;
    }

    // Get upcoming reminders
    getUpcomingReminders() {
        const now = new Date();
        return this.reminders
            .filter(reminder => !reminder.completed && reminder.dueDate >= now)
            .sort((a, b) => a.dueDate - b.dueDate);
    }

    // Mark a reminder as completed
    completeReminder(reminderId) {
        const reminder = this.reminders.find(r => r.id === reminderId);
        if (reminder) {
            reminder.completed = true;
            
            // Schedule next reminder based on frequency
            if (reminder.frequency) {
                const nextDueDate = this.calculateNextDueDate(reminder.dueDate, reminder.frequency);
                this.addReminder(reminder.plantId, reminder.taskType, nextDueDate, reminder.frequency);
            }
            
            this.saveReminders();
        }
    }

    // Calculate next due date based on frequency
    calculateNextDueDate(currentDueDate, frequency) {
        const date = new Date(currentDueDate);
        switch (frequency) {
            case 'daily':
                date.setDate(date.getDate() + 1);
                break;
            case 'weekly':
                date.setDate(date.getDate() + 7);
                break;
            case 'biweekly':
                date.setDate(date.getDate() + 14);
                break;
            case 'monthly':
                date.setMonth(date.getMonth() + 1);
                break;
        }
        return date;
    }

    // Schedule browser notification for a reminder
    scheduleNotification(reminder) {
        const now = new Date();
        const timeUntilDue = reminder.dueDate - now;

        if (timeUntilDue > 0 && 'Notification' in window) {
            setTimeout(() => {
                const plant = this.getPlantById(reminder.plantId);
                if (plant && Notification.permission === 'granted') {
                    new Notification('Plant Care Reminder', {
                        body: `Time to ${reminder.taskType} your ${plant.name}!`,
                        icon: '/assets/icons/leaf.png'
                    });
                }
            }, timeUntilDue);
        }
    }

    // Get plant details by ID
    getPlantById(plantId) {
        const plants = JSON.parse(localStorage.getItem('plants')) || [];
        return plants.find(p => p.id == plantId);
    }

    // Save reminders to localStorage
    saveReminders() {
        localStorage.setItem('plantReminders', JSON.stringify(this.reminders));
    }

    // Generate calendar view for a specific month
    generateCalendarMonth(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const calendar = [];
        let week = new Array(7).fill(null);

        // Add empty cells for days before the first of the month
        for (let i = 0; i < startingDay; i++) {
            week[i] = null;
        }

        // Fill in the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayOfWeek = (startingDay + day - 1) % 7;
            week[dayOfWeek] = {
                day,
                reminders: this.getRemindersForDate(new Date(year, month, day))
            };

            if (dayOfWeek === 6 || day === daysInMonth) {
                calendar.push(week);
                week = new Array(7).fill(null);
            }
        }

        return calendar;
    }

    // Get reminders for a specific date
    getRemindersForDate(date) {
        return this.reminders.filter(reminder => {
            const reminderDate = new Date(reminder.dueDate);
            return reminderDate.getDate() === date.getDate() &&
                   reminderDate.getMonth() === date.getMonth() &&
                   reminderDate.getFullYear() === date.getFullYear();
        });
    }

    // Delete a reminder
    deleteReminder(reminderId) {
        this.reminders = this.reminders.filter(r => r.id !== reminderId);
        this.saveReminders();
    }
}

// Create and export calendar manager instance
const calendarManager = new CalendarManager();
