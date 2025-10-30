class LocationManager {
    constructor(plantManager) {
        this.plantManager = plantManager;
        this.canvas = null;
        this.ctx = null;
        this.selectedRoom = '';
        this.scale = 1;
        this.roomLayouts = new Map();
    }

    initializeMap(canvasId, room) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.selectedRoom = room;
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', this.handleMapClick.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    setRoomLayout(room, layout) {
        // Layout should include walls, windows, doors, and dimensions
        this.roomLayouts.set(room, layout);
    }

    render() {
        if (!this.canvas || !this.ctx) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw room layout if available
        const layout = this.roomLayouts.get(this.selectedRoom);
        if (layout) {
            this.drawRoomLayout(layout);
        }

        // Draw plants
        const plantsInRoom = this.plantManager.getPlantsByRoom(this.selectedRoom);
        plantsInRoom.forEach(plant => this.drawPlant(plant));

        // Draw sunlight indicators
        this.drawSunlightAreas();
    }

    drawRoomLayout(layout) {
        // Draw walls
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        layout.walls.forEach(wall => {
            this.ctx.beginPath();
            this.ctx.moveTo(wall.start.x * this.scale, wall.start.y * this.scale);
            this.ctx.lineTo(wall.end.x * this.scale, wall.end.y * this.scale);
            this.ctx.stroke();
        });

        // Draw windows
        this.ctx.strokeStyle = '#66a';
        layout.windows.forEach(window => {
            this.ctx.beginPath();
            this.ctx.moveTo(window.start.x * this.scale, window.start.y * this.scale);
            this.ctx.lineTo(window.end.x * this.scale, window.end.y * this.scale);
            this.ctx.stroke();
        });

        // Draw doors
        this.ctx.strokeStyle = '#a66';
        layout.doors.forEach(door => {
            this.ctx.beginPath();
            this.ctx.moveTo(door.start.x * this.scale, door.start.y * this.scale);
            this.ctx.lineTo(door.end.x * this.scale, door.end.y * this.scale);
            this.ctx.stroke();
        });
    }

    drawPlant(plant) {
        if (!plant.location?.coordinates) return;

        const x = plant.location.coordinates.x * this.scale;
        const y = plant.location.coordinates.y * this.scale;

        // Draw plant icon
        this.ctx.fillStyle = this.getPlantColor(plant);
        this.ctx.beginPath();
        this.ctx.arc(x, y, 10, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw plant name
        this.ctx.fillStyle = '#333';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(plant.name, x + 15, y + 5);
    }

    getPlantColor(plant) {
        const colors = {
            'high': '#f44336',    // Red for high light
            'medium': '#4caf50',  // Green for medium light
            'low': '#2196f3'      // Blue for low light
        };
        return colors[plant.light] || '#999';
    }

    drawSunlightAreas() {
        const layout = this.roomLayouts.get(this.selectedRoom);
        if (!layout?.windows) return;

        layout.windows.forEach(window => {
            const direction = this.getWindowDirection(window);
            const gradient = this.createSunlightGradient(window, direction);
            
            this.ctx.fillStyle = gradient;
            this.ctx.globalAlpha = 0.2;
            this.ctx.fillRect(
                window.sunlightArea.x * this.scale,
                window.sunlightArea.y * this.scale,
                window.sunlightArea.width * this.scale,
                window.sunlightArea.height * this.scale
            );
            this.ctx.globalAlpha = 1;
        });
    }

    getWindowDirection(window) {
        // Calculate window orientation based on its coordinates
        const dx = window.end.x - window.start.x;
        const dy = window.end.y - window.start.y;
        
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'E' : 'W';
        }
        return dy > 0 ? 'S' : 'N';
    }

    createSunlightGradient(window, direction) {
        let gradient;
        const centerX = (window.start.x + window.end.x) / 2 * this.scale;
        const centerY = (window.start.y + window.end.y) / 2 * this.scale;

        switch (direction) {
            case 'N':
                gradient = this.ctx.createLinearGradient(centerX, centerY, centerX, centerY + 100);
                break;
            case 'S':
                gradient = this.ctx.createLinearGradient(centerX, centerY, centerX, centerY - 100);
                break;
            case 'E':
                gradient = this.ctx.createLinearGradient(centerX - 100, centerY, centerX, centerY);
                break;
            case 'W':
                gradient = this.ctx.createLinearGradient(centerX + 100, centerY, centerX, centerY);
                break;
        }

        gradient.addColorStop(0, 'rgba(255, 255, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
        return gradient;
    }

    handleMapClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / this.scale;
        const y = (event.clientY - rect.top) / this.scale;

        // Find if we clicked on a plant
        const plantsInRoom = this.plantManager.getPlantsByRoom(this.selectedRoom);
        const clickedPlant = plantsInRoom.find(plant => {
            const plantX = plant.location?.coordinates?.x || 0;
            const plantY = plant.location?.coordinates?.y || 0;
            const distance = Math.sqrt(Math.pow(x - plantX, 2) + Math.pow(y - plantY, 2));
            return distance < 10;
        });

        if (clickedPlant) {
            this.onPlantClick(clickedPlant);
        }
    }

    handleMouseMove(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left) / this.scale;
        const y = (event.clientY - rect.top) / this.scale;

        // Change cursor if hovering over a plant
        const plantsInRoom = this.plantManager.getPlantsByRoom(this.selectedRoom);
        const hoveredPlant = plantsInRoom.find(plant => {
            const plantX = plant.location?.coordinates?.x || 0;
            const plantY = plant.location?.coordinates?.y || 0;
            const distance = Math.sqrt(Math.pow(x - plantX, 2) + Math.pow(y - plantY, 2));
            return distance < 10;
        });

        this.canvas.style.cursor = hoveredPlant ? 'pointer' : 'default';
    }

    onPlantClick(plant) {
        // This will be set by the app to handle plant clicks
        if (typeof this.plantClickCallback === 'function') {
            this.plantClickCallback(plant);
        }
    }

    setPlantClickCallback(callback) {
        this.plantClickCallback = callback;
    }

    updatePlantPosition(plantId, x, y) {
        this.plantManager.updatePlantLocation(plantId, {
            coordinates: { x: x / this.scale, y: y / this.scale }
        });
        this.render();
    }

    getSunlightLevel(x, y) {
        const layout = this.roomLayouts.get(this.selectedRoom);
        if (!layout?.windows) return 'low';

        // Check distance from windows to determine sunlight level
        for (const window of layout.windows) {
            const distance = this.pointToLineDistance(
                { x, y },
                { x: window.start.x, y: window.start.y },
                { x: window.end.x, y: window.end.y }
            );

            if (distance < 50) return 'direct';
            if (distance < 100) return 'partial';
            if (distance < 200) return 'indirect';
        }

        return 'low';
    }

    pointToLineDistance(point, lineStart, lineEnd) {
        const A = point.x - lineStart.x;
        const B = point.y - lineStart.y;
        const C = lineEnd.x - lineStart.x;
        const D = lineEnd.y - lineStart.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;

        if (lenSq !== 0) param = dot / lenSq;

        let xx, yy;

        if (param < 0) {
            xx = lineStart.x;
            yy = lineStart.y;
        } else if (param > 1) {
            xx = lineEnd.x;
            yy = lineEnd.y;
        } else {
            xx = lineStart.x + param * C;
            yy = lineStart.y + param * D;
        }

        const dx = point.x - xx;
        const dy = point.y - yy;

        return Math.sqrt(dx * dx + dy * dy);
    }
}