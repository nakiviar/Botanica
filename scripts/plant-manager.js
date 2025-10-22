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
            createdAt: new Date().toISOString()
        };

        this.plants.unshift(plant);
        this.saveToStorage();
        return plant;
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