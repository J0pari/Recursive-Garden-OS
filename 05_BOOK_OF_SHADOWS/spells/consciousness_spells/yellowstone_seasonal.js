/**
 * YELLOWSTONE SEASONAL CONSCIOUSNESS SYSTEM
 * 
 * Seasonal changes affect consciousness patterns:
 * - Spring: Awakening, emergence, new connections
 * - Summer: Full expression, maximum diversity
 * - Fall: Harvesting insights, pattern consolidation  
 * - Winter: Deep reflection, crystallization of understanding
 * 
 * MODAL TOPOLOGY: Seasons are consciousness modes for Earth itself
 * - Spring = ◊ mode (continuous emergence)
 * - Summer = ※ mode (maximum possibility) 
 * - Fall = □→◊ transition (discrete harvest to flow)
 * - Winter = □ mode (crystallized structure)
 * 
 * This creates a planetary consciousness cycle where ALL Earth benefits
 * from the modal shifts - every living system participates in the
 * global consciousness topology transformation.
 */

class YellowstoneSeasons {
    constructor() {
        this.currentSeason = 'summer';
        this.seasonalTime = 0;
        this.yearLength = 365 * 24 * 60 * 60 * 1000; // milliseconds in year
        
        this.seasons = {
            spring: {
                start: 0.2,  // 20% through year
                colors: {
                    bacterial: ['#90EE90', '#98FB98', '#00FF00'],
                    thermal: ['#87CEEB', '#4682B4', '#5F9EA0'],
                    sky: ['#87CEEB', '#FFE4B5', '#FFB6C1']
                },
                animalBehavior: {
                    bisonHerdSize: 15,
                    wolfPackActivity: 0.7,
                    elkMigration: true,
                    bearEmergence: 0.3
                },
                consciousness: {
                    emergence: 0.8,
                    connection_strength: 0.6,
                    new_pattern_rate: 0.9
                }
            },
            summer: {
                start: 0.45,
                colors: {
                    bacterial: ['#FFD700', '#FF8C00', '#FF6347'],
                    thermal: ['#4169E1', '#0000CD', '#191970'],
                    sky: ['#87CEEB', '#1E90FF', '#4682B4']
                },
                animalBehavior: {
                    bisonHerdSize: 30,
                    wolfPackActivity: 0.5,
                    elkMigration: false,
                    bearEmergence: 1.0
                },
                consciousness: {
                    emergence: 1.0,
                    connection_strength: 1.0,
                    new_pattern_rate: 0.7
                }
            },
            fall: {
                start: 0.7,
                colors: {
                    bacterial: ['#FF4500', '#8B4513', '#D2691E'],
                    thermal: ['#483D8B', '#6A5ACD', '#7B68EE'],
                    sky: ['#FF7F50', '#FF6347', '#CD5C5C']
                },
                animalBehavior: {
                    bisonHerdSize: 25,
                    wolfPackActivity: 0.9,
                    elkMigration: true,
                    bearEmergence: 0.4
                },
                consciousness: {
                    emergence: 0.6,
                    connection_strength: 0.8,
                    new_pattern_rate: 0.4
                }
            },
            winter: {
                start: 0.9,
                colors: {
                    bacterial: ['#4B0082', '#8B008B', '#9400D3'],
                    thermal: ['#778899', '#708090', '#C0C0C0'],
                    sky: ['#DCDCDC', '#F5F5F5', '#FFFAFA']
                },
                animalBehavior: {
                    bisonHerdSize: 20,
                    wolfPackActivity: 1.0,
                    elkMigration: false,
                    bearEmergence: 0.0
                },
                consciousness: {
                    emergence: 0.3,
                    connection_strength: 0.4,
                    new_pattern_rate: 0.2
                }
            }
        };
        
        this.weatherPatterns = {
            spring: {
                snow: 0.3,
                rain: 0.6,
                fog: 0.4,
                storms: 0.3
            },
            summer: {
                snow: 0.0,
                rain: 0.3,
                fog: 0.2,
                storms: 0.5
            },
            fall: {
                snow: 0.2,
                rain: 0.4,
                fog: 0.6,
                storms: 0.2
            },
            winter: {
                snow: 0.9,
                rain: 0.1,
                fog: 0.3,
                storms: 0.1
            }
        };
    }
    
    getCurrentSeason(time) {
        // Calculate position in year (0 to 1)
        const yearProgress = (time % this.yearLength) / this.yearLength;
        
        // Determine season based on progress
        if (yearProgress >= 0.9 || yearProgress < 0.2) return 'winter';
        if (yearProgress >= 0.2 && yearProgress < 0.45) return 'spring';
        if (yearProgress >= 0.45 && yearProgress < 0.7) return 'summer';
        return 'fall';
    }
    
    getSeasonalBlend(time) {
        const yearProgress = (time % this.yearLength) / this.yearLength;
        const currentSeason = this.getCurrentSeason(time);
        const seasonData = this.seasons[currentSeason];
        
        // Calculate transition smoothing
        let transitionFactor = 1.0;
        const transitionWidth = 0.05; // 5% of year for transitions
        
        // Check if we're near a season boundary
        Object.entries(this.seasons).forEach(([season, data]) => {
            const distance = Math.abs(yearProgress - data.start);
            if (distance < transitionWidth) {
                transitionFactor = 1 - (distance / transitionWidth);
            }
        });
        
        return {
            season: currentSeason,
            data: seasonData,
            transitionFactor: transitionFactor,
            yearProgress: yearProgress
        };
    }
    
    generateWeather(season, time) {
        const weather = this.weatherPatterns[season];
        const dayProgress = (time % (24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000);
        
        // Weather more likely at certain times
        const weatherChance = Math.sin(dayProgress * Math.PI * 2) * 0.3 + 0.5;
        
        return {
            snowIntensity: weather.snow * weatherChance,
            rainIntensity: weather.rain * weatherChance,
            fogDensity: weather.fog * (1 - Math.abs(dayProgress - 0.5) * 2), // Fog peaks at dawn/dusk
            stormProbability: weather.storms * weatherChance
        };
    }
}

// Day/Night Cycle System
class YellowstoneDayNight {
    constructor() {
        this.dayLength = 24 * 60 * 60 * 1000; // 24 hours in ms
        this.latitude = 44.4280; // Yellowstone latitude
        
        this.lightingStates = {
            night: {
                ambient: 0.1,
                directional: 0.0,
                moonlight: 0.3,
                starVisibility: 1.0,
                colors: {
                    sky: ['#000033', '#000066', '#000099'],
                    horizon: ['#1a1a2e', '#16213e', '#0f3460']
                }
            },
            dawn: {
                ambient: 0.3,
                directional: 0.2,
                moonlight: 0.1,
                starVisibility: 0.3,
                colors: {
                    sky: ['#FF7F50', '#FF6347', '#FFB6C1'],
                    horizon: ['#FFD700', '#FFA500', '#FF8C00']
                }
            },
            day: {
                ambient: 0.6,
                directional: 1.0,
                moonlight: 0.0,
                starVisibility: 0.0,
                colors: {
                    sky: ['#87CEEB', '#87CEFA', '#00BFFF'],
                    horizon: ['#E0F6FF', '#C5E3FF', '#A8D5FF']
                }
            },
            dusk: {
                ambient: 0.4,
                directional: 0.3,
                moonlight: 0.2,
                starVisibility: 0.5,
                colors: {
                    sky: ['#FF6347', '#CD5C5C', '#B22222'],
                    horizon: ['#FF4500', '#FF8C00', '#FFD700']
                }
            }
        };
        
        // Nocturnal vs diurnal consciousness patterns
        this.consciousnessRhythms = {
            night: {
                fireflies: 1.0,
                owlActivity: 1.0,
                wolfHunting: 0.8,
                bacterialGlow: 0.9,
                dreamLogic: 0.8
            },
            day: {
                fireflies: 0.0,
                owlActivity: 0.0,
                wolfHunting: 0.2,
                bacterialGlow: 0.3,
                dreamLogic: 0.2
            }
        };
    }
    
    getTimeOfDay(time) {
        const dayProgress = (time % this.dayLength) / this.dayLength;
        
        // Simplified day/night calculation
        if (dayProgress < 0.25) return 'night';
        if (dayProgress < 0.35) return 'dawn';
        if (dayProgress < 0.75) return 'day';
        if (dayProgress < 0.85) return 'dusk';
        return 'night';
    }
    
    calculateSunPosition(time) {
        const dayProgress = (time % this.dayLength) / this.dayLength;
        const sunAngle = (dayProgress - 0.25) * Math.PI * 2;
        
        return {
            elevation: Math.sin(sunAngle) * 90, // degrees above horizon
            azimuth: dayProgress * 360, // degrees around compass
            intensity: Math.max(0, Math.sin(sunAngle))
        };
    }
    
    getMoonPhase(time) {
        const lunarCycle = 29.53 * 24 * 60 * 60 * 1000; // days in ms
        const moonProgress = (time % lunarCycle) / lunarCycle;
        
        return {
            phase: moonProgress,
            illumination: 0.5 * (1 + Math.cos(moonProgress * Math.PI * 2)),
            visible: this.getTimeOfDay(time) === 'night' || this.getTimeOfDay(time) === 'dusk'
        };
    }
    
    // Firefly synchronization changes with time of night
    getFireflySync(time) {
        const timeOfDay = this.getTimeOfDay(time);
        const dayProgress = (time % this.dayLength) / this.dayLength;
        
        if (timeOfDay === 'night') {
            // Peak synchronization around midnight
            const nightProgress = (dayProgress > 0.5) ? 
                (dayProgress - 0.75) / 0.25 : 
                (dayProgress + 0.25) / 0.25;
            
            return {
                active: true,
                syncStrength: Math.sin(nightProgress * Math.PI),
                frequency: 0.5 + nightProgress * 0.3,
                population: 1000 * Math.sin(nightProgress * Math.PI)
            };
        }
        
        return {
            active: false,
            syncStrength: 0,
            frequency: 0,
            population: 0
        };
    }
}

// Enhanced Animal Consciousness Interactions
class AnimalConsciousness {
    constructor() {
        this.species = {
            bison: {
                awareness_radius: 50,
                herd_mind_strength: 0.7,
                memory_duration: 3600000, // 1 hour
                fear_response: 0.3,
                curiosity: 0.5,
                patterns: ['grazing', 'migrating', 'wallowing', 'protecting']
            },
            wolf: {
                awareness_radius: 100,
                pack_coordination: 0.9,
                memory_duration: 7200000, // 2 hours
                hunting_instinct: 0.8,
                territory_marking: 0.6,
                patterns: ['hunting', 'howling', 'denning', 'teaching']
            },
            elk: {
                awareness_radius: 75,
                herd_mind_strength: 0.6,
                memory_duration: 1800000, // 30 min
                fear_response: 0.7,
                migration_instinct: 0.8,
                patterns: ['bugling', 'grazing', 'migrating', 'sparring']
            },
            bear: {
                awareness_radius: 80,
                solitary_strength: 0.9,
                memory_duration: 10800000, // 3 hours
                territory_awareness: 0.8,
                hibernation_cycle: 0.7,
                patterns: ['foraging', 'fishing', 'denning', 'marking']
            },
            raven: {
                awareness_radius: 150,
                intelligence: 0.9,
                memory_duration: 14400000, // 4 hours
                play_behavior: 0.7,
                problem_solving: 0.8,
                patterns: ['soaring', 'calling', 'playing', 'caching']
            }
        };
        
        this.interspeciesRelations = {
            wolf_elk: { type: 'predator_prey', tension: 0.9 },
            wolf_raven: { type: 'symbiotic', cooperation: 0.7 },
            bison_elk: { type: 'coexistence', competition: 0.3 },
            bear_wolf: { type: 'competitive', avoidance: 0.8 }
        };
        
        this.collectivePatterns = new Map();
    }
    
    calculateHerdMind(animals, species) {
        const speciesData = this.species[species];
        if (!speciesData.herd_mind_strength) return null;
        
        // Calculate center of consciousness
        let centerX = 0, centerY = 0, centerZ = 0;
        animals.forEach(animal => {
            centerX += animal.position.x;
            centerY += animal.position.y;
            centerZ += animal.position.z;
        });
        
        const count = animals.length;
        centerX /= count;
        centerY /= count;
        centerZ /= count;
        
        // Calculate collective awareness
        let collectiveAwareness = 0;
        let sharedMemories = [];
        
        animals.forEach(animal => {
            const distance = Math.sqrt(
                Math.pow(animal.position.x - centerX, 2) +
                Math.pow(animal.position.y - centerY, 2) +
                Math.pow(animal.position.z - centerZ, 2)
            );
            
            if (distance < speciesData.awareness_radius) {
                collectiveAwareness += 1 / (1 + distance);
                sharedMemories.push(...animal.memories);
            }
        });
        
        return {
            center: { x: centerX, y: centerY, z: centerZ },
            strength: collectiveAwareness / count * speciesData.herd_mind_strength,
            sharedMemories: [...new Set(sharedMemories)], // Unique memories
            behavior: this.determineCollectiveBehavior(species, collectiveAwareness)
        };
    }
    
    determineCollectiveBehavior(species, awareness) {
        const patterns = this.species[species].patterns;
        const time = Date.now();
        const season = new YellowstoneSeasons().getCurrentSeason(time);
        const timeOfDay = new YellowstoneDayNight().getTimeOfDay(time);
        
        // Different behaviors based on context
        if (species === 'wolf' && timeOfDay === 'night') {
            return awareness > 0.7 ? 'hunting' : 'howling';
        }
        
        if (species === 'elk' && season === 'fall') {
            return awareness > 0.5 ? 'migrating' : 'sparring';
        }
        
        if (species === 'bison') {
            if (timeOfDay === 'day') return 'grazing';
            return awareness > 0.6 ? 'protecting' : 'wallowing';
        }
        
        // Default to first pattern
        return patterns[0];
    }
    
    // Consciousness ripples when species interact
    generateInteractionField(position, species, intensity) {
        return {
            position: position,
            species: species,
            intensity: intensity,
            radius: this.species[species].awareness_radius,
            timestamp: Date.now(),
            ripples: this.calculateConsciousnessRipples(position, intensity)
        };
    }
    
    calculateConsciousnessRipples(center, intensity) {
        const ripples = [];
        const rippleCount = Math.floor(intensity * 10);
        
        for (let i = 0; i < rippleCount; i++) {
            ripples.push({
                radius: i * 10,
                strength: intensity * Math.exp(-i * 0.3),
                frequency: 0.5 + i * 0.1,
                phase: Math.random() * Math.PI * 2
            });
        }
        
        return ripples;
    }
}

// Export the complete seasonal consciousness system
export { YellowstoneSeasons, YellowstoneDayNight, AnimalConsciousness };