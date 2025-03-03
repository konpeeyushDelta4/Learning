import React, { useState, useRef, useEffect } from 'react';

interface City {
    id: number;
    x: number;
    y: number;
    name: string;
}

interface Connection {
    from: number;
    to: number;
    distance: number;
}

const Traveller: React.FC = () => {
    // State for cities and connections
    const [cities, setCities] = useState<City[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [connectingFromId, setConnectingFromId] = useState<number | null>(null);
    const [cityIdCounter, setCityIdCounter] = useState(1);

    // Input states
    const [cityNameInput, setCityNameInput] = useState('');
    const [distanceInput, setDistanceInput] = useState('');
    const [tempPosition, setTempPosition] = useState<{ x: number; y: number } | null>(null);

    // Modal visibility states
    const [showCityNameModal, setShowCityNameModal] = useState(false);
    const [showDistanceModal, setShowDistanceModal] = useState(false);
    const [connectingToId, setConnectingToId] = useState<number | null>(null);

    // Solution states
    const [solution, setSolution] = useState<number[] | null>(null);
    const [solutionDistance, setSolutionDistance] = useState<number>(0);
    const [isCalculating, setIsCalculating] = useState(false);

    // Refs
    const canvasRef = useRef<HTMLDivElement>(null);

    // Handle canvas click to add a new city or select one
    const handleCanvasClick = (e: React.MouseEvent) => {
        if (showCityNameModal || showDistanceModal) return;

        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if clicked near existing city
        const clickedCity = cities.find(city =>
            Math.sqrt((city.x - x) ** 2 + (city.y - y) ** 2) < 20
        );

        if (clickedCity) {
            handleCityClick(clickedCity.id);
        } else {
            // Show modal to name new city
            setTempPosition({ x, y });
            setShowCityNameModal(true);
        }
    };

    // Handle click on a city
    const handleCityClick = (cityId: number) => {
        if (connectingFromId === null) {
            // Start connecting from this city
            setConnectingFromId(cityId);
            setSelectedCityId(cityId);
        } else if (connectingFromId === cityId) {
            // Cancel connecting if same city clicked twice
            setConnectingFromId(null);
        } else {
            // Show distance prompt to complete connection
            setConnectingToId(cityId);
            setShowDistanceModal(true);
        }
    };

    // Create a new city
    const handleCreateCity = () => {
        if (tempPosition && cityNameInput.trim()) {
            const newCity: City = {
                id: cityIdCounter,
                x: tempPosition.x,
                y: tempPosition.y,
                name: cityNameInput.trim()
            };

            setCities(prev => [...prev, newCity]);
            setCityIdCounter(prev => prev + 1);

            // Reset state
            setCityNameInput('');
            setTempPosition(null);
            setShowCityNameModal(false);
        }
    };

    // Create a connection between cities
    const handleCreateConnection = () => {
        if (connectingFromId === null || connectingToId === null || !distanceInput.trim()) return;

        const distance = parseFloat(distanceInput);
        if (isNaN(distance) || distance <= 0) return;

        // Check if connection already exists
        const existingConnection = connections.find(conn =>
            (conn.from === connectingFromId && conn.to === connectingToId) ||
            (conn.from === connectingToId && conn.to === connectingFromId)
        );

        if (existingConnection) {
            // Update existing connection
            setConnections(prev => prev.map(conn =>
                (conn.from === connectingFromId && conn.to === connectingToId) ||
                    (conn.from === connectingToId && conn.to === connectingFromId)
                    ? { ...conn, distance }
                    : conn
            ));
        } else {
            // Create new connection
            const newConnection: Connection = {
                from: connectingFromId,
                to: connectingToId,
                distance
            };
            setConnections(prev => [...prev, newConnection]);
        }

        // Reset state
        setConnectingFromId(null);
        setConnectingToId(null);
        setDistanceInput('');
        setShowDistanceModal(false);
    };

    // Remove a city and its connections
    const handleRemoveCity = (cityId: number) => {
        setCities(prev => prev.filter(city => city.id !== cityId));
        setConnections(prev => prev.filter(conn =>
            conn.from !== cityId && conn.to !== cityId
        ));

        if (selectedCityId === cityId) setSelectedCityId(null);
        if (connectingFromId === cityId) setConnectingFromId(null);
    };

    // Remove a connection
    const handleRemoveConnection = (fromId: number, toId: number) => {
        setConnections(prev => prev.filter(conn =>
            !(conn.from === fromId && conn.to === toId) &&
            !(conn.from === toId && conn.to === fromId)
        ));
    };

    // Clear all data
    const handleClearAll = () => {
        setCities([]);
        setConnections([]);
        setSelectedCityId(null);
        setConnectingFromId(null);
        setCityIdCounter(1);
        setSolution(null);
    };

    // Find the shortest path using a simple algorithm
    const findShortestPath = () => {
        if (cities.length < 3) return;

        setIsCalculating(true);

        // Simple timeout to simulate calculation
        setTimeout(() => {
            try {
                // Implementation of a simplified nearest neighbor algorithm
                const result = calculateTSP(cities, connections);
                setSolution(result.path);
                setSolutionDistance(result.distance);
            } catch (error) {
                console.error("Failed to find solution:", error);
                setSolution(null);
            } finally {
                setIsCalculating(false);
            }
        }, 500);
    };

    // Helper to find a city by ID
    const findCity = (id: number): City | undefined => {
        return cities.find(city => city.id === id);
    };

    // Simple nearest neighbor TSP algorithm
    const calculateTSP = (cities: City[], connections: Connection[]) => {
        if (cities.length < 2) {
            throw new Error("Need at least 2 cities");
        }

        // Create adjacency matrix for distance between cities
        const distanceMatrix: Record<number, Record<number, number>> = {};

        // Initialize with Infinity
        cities.forEach(city1 => {
            distanceMatrix[city1.id] = {};
            cities.forEach(city2 => {
                distanceMatrix[city1.id][city2.id] = city1.id === city2.id ? 0 : Infinity;
            });
        });

        // Fill distances from connections
        connections.forEach(conn => {
            distanceMatrix[conn.from][conn.to] = conn.distance;
            distanceMatrix[conn.to][conn.from] = conn.distance; // Bidirectional
        });

        // Check if the graph is connected
        const visited = new Set<number>();
        const queue = [cities[0].id];
        visited.add(cities[0].id);

        while (queue.length > 0) {
            const currentId = queue.shift()!;

            cities.forEach(city => {
                if (distanceMatrix[currentId][city.id] < Infinity && !visited.has(city.id)) {
                    visited.add(city.id);
                    queue.push(city.id);
                }
            });
        }

        if (visited.size !== cities.length) {
            throw new Error("All cities must be connected");
        }

        // Nearest neighbor algorithm
        const path: number[] = [cities[0].id];
        let current = cities[0].id;
        let totalDistance = 0;

        const unvisited = new Set(cities.map(c => c.id));
        unvisited.delete(current);

        while (unvisited.size > 0) {
            let nearest = -1;
            let minDistance = Infinity;

            unvisited.forEach(cityId => {
                const dist = distanceMatrix[current][cityId];
                if (dist < minDistance) {
                    minDistance = dist;
                    nearest = cityId;
                }
            });

            if (nearest === -1 || minDistance === Infinity) {
                throw new Error("No valid path found");
            }

            path.push(nearest);
            totalDistance += minDistance;
            current = nearest;
            unvisited.delete(nearest);
        }

        // Complete the cycle
        const lastToFirstDistance = distanceMatrix[current][path[0]];
        if (lastToFirstDistance === Infinity) {
            throw new Error("Cannot complete the cycle");
        }

        path.push(path[0]); // Return to start
        totalDistance += lastToFirstDistance;

        return { path, distance: totalDistance };
    };

    // Calculate midpoint of a connection
    const getConnectionMidpoint = (fromId: number, toId: number) => {
        const from = findCity(fromId);
        const to = findCity(toId);

        if (!from || !to) return { x: 0, y: 0 };

        return {
            x: (from.x + to.x) / 2,
            y: (from.y + to.y) / 2
        };
    };

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setShowCityNameModal(false);
                setShowDistanceModal(false);
                setConnectingFromId(null);
                setSelectedCityId(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Reset solution when cities or connections change
    useEffect(() => {
        setSolution(null);
    }, [cities, connections]);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="bg-blue-700 text-white p-4 rounded-t-lg shadow-md">
                <h2 className="text-xl font-bold">Traveling Salesman Problem</h2>
                <p className="text-sm opacity-90 mt-1">
                    Add cities by clicking on the canvas. Create connections between cities to find the shortest path.
                    {connectingFromId !== null && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-600 rounded text-white">
                            Connecting from: {findCity(connectingFromId)?.name || ''}
                        </span>
                    )}
                </p>
            </div>

            {/* Canvas */}
            <div
                ref={canvasRef}
                className="relative bg-gray-100 h-[500px] border-2 border-blue-300 overflow-hidden cursor-crosshair"
                onClick={handleCanvasClick}
            >
                {/* SVG for connections */}
                <svg className="absolute inset-0 w-full h-full">
                    {/* Connection lines */}
                    {connections.map((conn, index) => {
                        const fromCity = findCity(conn.from);
                        const toCity = findCity(conn.to);
                        if (!fromCity || !toCity) return null;

                        const midpoint = getConnectionMidpoint(conn.from, conn.to);

                        return (
                            <g key={`conn-${index}`}>
                                <line
                                    x1={fromCity.x}
                                    y1={fromCity.y}
                                    x2={toCity.x}
                                    y2={toCity.y}
                                    stroke="#666"
                                    strokeWidth={2}
                                    strokeDasharray="5,5"
                                />
                                <circle
                                    cx={midpoint.x}
                                    cy={midpoint.y}
                                    r={12}
                                    fill="white"
                                    stroke="#666"
                                />
                                <text
                                    x={midpoint.x}
                                    y={midpoint.y + 4}
                                    textAnchor="middle"
                                    fontSize={12}
                                    fill="#333"
                                >
                                    {conn.distance}
                                </text>
                                {/* Invisible wider line for better click target */}
                                <line
                                    x1={fromCity.x}
                                    y1={fromCity.y}
                                    x2={toCity.x}
                                    y2={toCity.y}
                                    stroke="transparent"
                                    strokeWidth={15}
                                    className="cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveConnection(conn.from, conn.to);
                                    }}
                                />
                            </g>
                        );
                    })}

                    {/* Solution path if available */}
                    {solution && (
                        <g className="solution-path">
                            {solution.map((cityId, index) => {
                                if (index === solution.length - 1) return null;

                                const from = findCity(cityId);
                                const to = findCity(solution[index + 1]);

                                if (!from || !to) return null;

                                return (
                                    <g key={`solution-${index}`}>
                                        <line
                                            x1={from.x}
                                            y1={from.y}
                                            x2={to.x}
                                            y2={to.y}
                                            stroke="#10B981"
                                            strokeWidth={3}
                                            strokeLinecap="round"
                                        />
                                        {/* Direction arrow */}
                                        <circle
                                            cx={(from.x + to.x) / 2}
                                            cy={(from.y + to.y) / 2}
                                            r={4}
                                            fill="#10B981"
                                        />
                                    </g>
                                );
                            })}
                        </g>
                    )}

                    {/* Active connection line */}
                    {connectingFromId !== null && (
                        <line
                            x1={findCity(connectingFromId)?.x || 0}
                            y1={findCity(connectingFromId)?.y || 0}
                            x2={tempPosition?.x || 0}
                            y2={tempPosition?.y || 0}
                            stroke="#3B82F6"
                            strokeWidth={2}
                            strokeDasharray="5,5"
                            className="pointer-events-none"
                            style={{
                                opacity: tempPosition ? 1 : 0
                            }}
                        />
                    )}
                </svg>

                {/* City nodes */}
                {cities.map(city => (
                    <div
                        key={`city-${city.id}`}
                        className={`absolute w-10 h-10 rounded-full flex items-center justify-center transition-all transform -translate-x-1/2 -translate-y-1/2 cursor-pointer 
                ${city.id === connectingFromId ? 'bg-blue-600 ring-2 ring-blue-300' :
                                city.id === selectedCityId ? 'bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                        style={{ left: city.x, top: city.y }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCityClick(city.id);
                        }}
                    >
                        <span className="text-white text-xs font-bold">{city.name}</span>

                        {/* Delete button */}
                        <button
                            className="absolute -top-2 -right-2 bg-gray-800 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs hover:bg-gray-700"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveCity(city.id);
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}

                {/* City name input modal */}
                {showCityNameModal && tempPosition && (
                    <div
                        className="absolute bg-white rounded-md shadow-lg border border-gray-200 p-3 z-10 w-64"
                        style={{
                            left: tempPosition.x + 10,
                            top: tempPosition.y + 10
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="font-bold text-gray-700 mb-2">Add New City</h3>
                        <input
                            type="text"
                            className="w-full border rounded px-2 py-1 mb-2"
                            placeholder="Enter city name"
                            value={cityNameInput}
                            onChange={e => setCityNameInput(e.target.value)}
                            autoFocus
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleCreateCity();
                                if (e.key === 'Escape') {
                                    setShowCityNameModal(false);
                                    setTempPosition(null);
                                }
                            }}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded"
                                onClick={() => {
                                    setShowCityNameModal(false);
                                    setTempPosition(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                onClick={handleCreateCity}
                                disabled={!cityNameInput.trim()}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                )}

                {/* Distance input modal */}
                {showDistanceModal && connectingFromId !== null && connectingToId !== null && (
                    <div
                        className="absolute bg-white rounded-md shadow-lg border border-gray-200 p-3 z-10 w-72"
                        style={{
                            left: getConnectionMidpoint(connectingFromId, connectingToId).x + 10,
                            top: getConnectionMidpoint(connectingFromId, connectingToId).y + 10
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="font-bold text-gray-700 mb-2">Set Distance</h3>
                        <div className="mb-3 bg-blue-50 p-2 rounded text-sm">
                            <p>
                                <span className="font-bold">From:</span> {findCity(connectingFromId)?.name}
                            </p>
                            <p>
                                <span className="font-bold">To:</span> {findCity(connectingToId)?.name}
                            </p>
                        </div>
                        <input
                            type="number"
                            className="w-full border rounded px-2 py-1 mb-2"
                            placeholder="Enter distance"
                            step="0.1"
                            min="0.1"
                            value={distanceInput}
                            onChange={e => setDistanceInput(e.target.value)}
                            autoFocus
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleCreateConnection();
                                if (e.key === 'Escape') {
                                    setShowDistanceModal(false);
                                    setConnectingToId(null);
                                }
                            }}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded"
                                onClick={() => {
                                    setShowDistanceModal(false);
                                    setConnectingToId(null);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                                onClick={handleCreateConnection}
                                disabled={!distanceInput.trim() || parseFloat(distanceInput) <= 0}
                            >
                                Connect
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls and stats */}
            <div className="p-4 bg-white border-x-2 border-b-2 border-blue-300 rounded-b-lg">
                <div className="flex justify-between flex-wrap gap-4 mb-4">
                    <div>
                        <h3 className="font-bold text-gray-700">Statistics</h3>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                            <div className="bg-blue-50 p-2 rounded text-center">
                                <div className="text-lg font-bold">{cities.length}</div>
                                <div className="text-xs text-gray-600">Cities</div>
                            </div>
                            <div className="bg-blue-50 p-2 rounded text-center">
                                <div className="text-lg font-bold">{connections.length}</div>
                                <div className="text-xs text-gray-600">Connections</div>
                            </div>
                            <div className="bg-blue-50 p-2 rounded text-center">
                                <div className="text-lg font-bold">
                                    {connections.reduce((sum, conn) => sum + conn.distance, 0).toFixed(1)}
                                </div>
                                <div className="text-xs text-gray-600">Total Distance</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded hover:bg-red-200"
                            onClick={handleClearAll}
                        >
                            Clear All
                        </button>
                        <button
                            className={`px-3 py-1 text-white rounded ${isCalculating ? 'bg-blue-400 cursor-wait' : 'bg-green-600 hover:bg-green-700'
                                }`}
                            onClick={findShortestPath}
                            disabled={cities.length < 3 || isCalculating}
                        >
                            {isCalculating ? 'Calculating...' : 'Find Shortest Path'}
                        </button>
                    </div>
                </div>

                {/* Solution display */}
                {solution && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                        <h3 className="font-bold text-green-800 mb-2">Solution Found</h3>
                        <p className="text-sm">
                            <span className="font-bold">Path:</span>{' '}
                            {solution.map(id => findCity(id)?.name).join(' → ')}
                        </p>
                        <p className="text-sm mt-1">
                            <span className="font-bold">Total Distance:</span> {solutionDistance.toFixed(1)}
                        </p>
                    </div>
                )}

                {/* Instructions */}
                <div className="mt-4 text-sm p-3 bg-blue-50 border border-blue-100 rounded">
                    <h3 className="font-bold text-blue-800">How to use:</h3>
                    <ul className="list-disc list-inside mt-1 text-blue-800">
                        <li>Click on the canvas to add a city</li>
                        <li>Click on a city and then another city to create a connection</li>
                        <li>Click on a connection to remove it</li>
                        <li>Add at least 3 connected cities to find the shortest path</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Traveller;