# Plant Location Management

This feature allows you to:

1. Map view of plants in your home/garden
- Visual representation of plant placement in each room
- Interactive room layouts with draggable plant markers
- Window locations and sunlight visualization

2. Track sunlight exposure by location
- Record direct, indirect, partial, or low light areas
- Window directions (N, S, E, W) affect light patterns
- Season-aware sunlight patterns

3. Room-by-room plant organization 
- Organize plants by room/space
- Track number of plants per room
- Light distribution statistics per room

4. Optimal plant placement suggestions
- Recommendations based on plant light requirements
- Matches plants to suitable locations
- Helps with relocating plants as needed

## Implementation Steps

1. Add location fields to PlantManager class
- Room name
- Coordinates for map
- Sunlight level
- Window direction
- Height from floor

2. Create LocationManager class
- Room layout visualization
- Plant marker management 
- Sunlight pattern visualization

3. Update UI
- Add location fields to plant form
- Create room map view  
- Add plant location indicators
- Enable drag & drop placement

4. Add Analytics
- Room light exposure stats
- Plant placement suggestions
- Location-based care reminders