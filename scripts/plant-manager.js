class PlantManager {
    constructor() {
        this.plants = JSON.parse(localStorage.getItem('botanical-plants')) || [];
        this.currentFilter = 'all';
        this.currentSearch = '';
    }

    addPlant(plantData) {
        const plant = {
            id: Date.now().toString(),
            name: plantData.name,
            species: plantData.species || '',
            type: plantData.type,
            light: plantData.light,
            notes: plantData.notes || '',
            image: plantData.image,
            createdAt: new Date().toISOString(),
            // Initialize the new journal array and health logs for a new plant
            journal: [],
            healthLogs: []
        };

        this.plants.unshift(plant);
        this.saveToStorage();
        return plant;
    }

    /**
     * Adds a health log entry to a plant. A health log can be of types:
     * 'watering', 'fertilizer', 'growth', 'pest', 'general'.
     * @param {string} plantId
     * @param {object} logData - { type, date, notes, image, details }
     */
    addHealthLog(plantId, logData) {
        const entry = {
            id: Date.now().toString(),
            type: logData.type || 'general',
            date: logData.date || new Date().toISOString(),
            notes: logData.notes || '',
            image: logData.image || null,
            details: logData.details || null,
            status: logData.status || 'healthy',
            weather: logData.weather || null
        };

        const plant = this.getPlantById(plantId);
        if (plant) {
            if (!plant.healthLogs) plant.healthLogs = [];
            plant.healthLogs.unshift(entry);
            this.saveToStorage();
            return entry;
        }
        return null;
    }

    getHealthLogs(plantId) {
        const plant = this.getPlantById(plantId);
        return plant && plant.healthLogs ? plant.healthLogs : [];
    }

    deleteHealthLog(plantId, logId) {
        const plant = this.getPlantById(plantId);
        if (plant && plant.healthLogs) {
            const initialLength = plant.healthLogs.length;
            plant.healthLogs = plant.healthLogs.filter(l => l.id !== logId);
            if (plant.healthLogs.length < initialLength) {
                this.saveToStorage();
                return true;
            }
        }
        return false;
    }

    // Convenience helpers
    addWateringEvent(plantId, { date, notes }) {
        return this.addHealthLog(plantId, { type: 'watering', date, notes });
    }

    addFertilizerEvent(plantId, { date, notes }) {
        return this.addHealthLog(plantId, { type: 'fertilizer', date, notes });
    }

    addGrowthPhoto(plantId, { date, notes, image }) {
        return this.addHealthLog(plantId, { type: 'growth', date, notes, image });
    }

    addPestReport(plantId, { date, notes, image, details }) {
        return this.addHealthLog(plantId, { type: 'pest', date, notes, image, details });
    }

    getPlants() {
        let filteredPlants = this.plants;

        // Apply type filter
        if (this.currentFilter !== 'all') {
            filteredPlants = filteredPlants.filter(plant =>
                plant.type === this.currentFilter
            );
        }

        // Apply search filter
        if (this.currentSearch) {
            const searchTerm = this.currentSearch.toLowerCase();
            filteredPlants = filteredPlants.filter(plant =>
                plant.name.toLowerCase().includes(searchTerm) ||
                (plant.species && plant.species.toLowerCase().includes(searchTerm)) ||
                (plant.notes && plant.notes.toLowerCase().includes(searchTerm))
            );
        }

        return filteredPlants;
    }

    getPlantById(id) {
        return this.plants.find(plant => plant.id === id);
    }

    /**
     * Get the most recent health status for a plant.
     * @param {string} plantId - The ID of the plant.
     * @returns {string} - The status (thriving/healthy/struggling/concern).
     */
    getPlantHealthStatus(plantId) {
        const plant = this.getPlantById(plantId);
        if (!plant?.healthLogs?.length) return 'healthy';
        return plant.healthLogs[0].status;
    }

    /**
     * Gets growth photo timeline for a plant.
     * @param {string} plantId - The ID of the plant.
     * @returns {Array<{date: string, image: string}>} Array of dated growth photos.
     */
    getGrowthTimeline(plantId) {
        const plant = this.getPlantById(plantId);
        if (!plant?.healthLogs) return [];
        return plant.healthLogs
            .filter(log => log.type === 'growth' && log.image)
            .map(log => ({
                date: log.date,
                image: log.image,
                notes: log.notes
            }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    /**
     * Analyze watering history to suggest next watering date.
     * @param {string} plantId - The ID of the plant.
     * @returns {Date|null} - Suggested next watering date.
     */
    suggestNextWatering(plantId) {
        const plant = this.getPlantById(plantId);
        if (!plant?.healthLogs) return null;

        const wateringLogs = plant.healthLogs
            .filter(log => log.type === 'watering')
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        if (wateringLogs.length < 2) return null;

        // Calculate average days between waterings
        let totalDays = 0;
        for (let i = 0; i < wateringLogs.length - 1; i++) {
            const daysDiff = (new Date(wateringLogs[i].date) - new Date(wateringLogs[i + 1].date)) / (1000 * 60 * 60 * 24);
            totalDays += daysDiff;
        }
        const avgDays = Math.round(totalDays / (wateringLogs.length - 1));

        // Suggest next date based on most recent watering
        const lastWatering = new Date(wateringLogs[0].date);
        lastWatering.setDate(lastWatering.getDate() + avgDays);
        return lastWatering;
    }

    getRecentPlants(limit = 6) {
        return this.plants.slice(0, limit);
    }

    deletePlant(id) {
        this.plants = this.plants.filter(plant => plant.id !== id);
        this.saveToStorage();
    }

    updatePlant(id, updatedData) {
        const plantIndex = this.plants.findIndex(plant => plant.id === id);
        if (plantIndex !== -1) {
            this.plants[plantIndex] = { ...this.plants[plantIndex], ...updatedData };
            this.saveToStorage();
            return this.plants[plantIndex];
        }
        return null;
    }

    getStats() {
        const total = this.plants.length;
        const needsWater = this.plants.filter(plant =>
            plant.notes && (plant.notes.toLowerCase().includes('water') ||
                plant.notes.toLowerCase().includes('thirsty'))
        ).length;

        const lowLight = this.plants.filter(plant =>
            plant.light === 'low'
        ).length;

        return { total, needsWater, lowLight };
    }

    setFilter(filter) {
        this.currentFilter = filter;
    }

    setSearch(searchTerm) {
        this.currentSearch = searchTerm;
    }

    saveToStorage() {
        localStorage.setItem('botanical-plants', JSON.stringify(this.plants));
    }

    /**
     * Adds a new journal entry to a specific plant.
     * @param {string} plantId - The ID of the plant.
     * @param {object} entryData - { note, image }
     */
    addJournalEntry(plantId, entryData) {
        const entry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            note: entryData.note,
            image: entryData.image || null,
        };

        const plant = this.getPlantById(plantId);
        if (plant) {
            // Ensure journal array exists (for older plants loaded from storage)
            if (!plant.journal) {
                plant.journal = [];
            }
            // Add newest entry to the start of the array (reverse chronological)
            plant.journal.unshift(entry);
            this.saveToStorage();
            return entry;
        }
        return null;
    }

    /**
     * Deletes a specific journal entry from a plant.
     * @param {string} plantId - The ID of the plant.
     * @param {string} entryId - The ID of the entry to delete.
     */
    deleteJournalEntry(plantId, entryId) {
        const plant = this.getPlantById(plantId);
        if (plant && plant.journal) {
            const initialLength = plant.journal.length;
            plant.journal = plant.journal.filter(entry => entry.id !== entryId);

            if (plant.journal.length < initialLength) {
                this.saveToStorage();
                return true;
            }
        }
        return false;
    }

    // Export/Import functionality
    exportData() {
        const data = JSON.stringify(this.plants, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `botanical-plants-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const importedPlants = JSON.parse(e.target.result);

                    if (Array.isArray(importedPlants)) {
                        // Validate plant structure
                        const validPlants = importedPlants.filter(plant =>
                            plant && plant.name && plant.type
                        );

                        this.plants = [...this.plants, ...validPlants];
                        this.saveToStorage();
                        resolve(validPlants.length);
                    } else {
                        reject(new Error('Invalid file format'));
                    }
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }
}