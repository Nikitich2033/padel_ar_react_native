import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';
import Svg, { Polygon, Polyline, Circle, G } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Building data interface
interface Building {
  id: string;
  coordinates: [number, number][];
  height: number;
  name?: string;
}

// Road data interface
interface Road {
  id: string;
  coordinates: [number, number][];
  name?: string;
}

// Tree data interface
interface Tree {
  id: string;
  coordinate: [number, number];
}

// Camera state interface
interface CameraState {
  x: number;
  y: number;
  zoom: number;
  rotation: number;
}

// Building outline component using SVG
function BuildingOutline({ 
  building, 
  centerLat, 
  centerLon, 
  camera 
}: { 
  building: Building; 
  centerLat: number; 
  centerLon: number; 
  camera: CameraState;
}) {
  // Convert lat/lon to screen coordinates
  const screenCoords = building.coordinates.map(([lon, lat]) => {
    const worldX = (lon - centerLon) * 111320;
    const worldY = (lat - centerLat) * 111320;
    
    // Apply camera transformations
    const translatedX = (worldX - camera.x) * camera.zoom;
    const translatedY = (worldY - camera.y) * camera.zoom;
    
    // Apply rotation
    const rotRad = (camera.rotation * Math.PI) / 180;
    const rotatedX = translatedX * Math.cos(rotRad) - translatedY * Math.sin(rotRad);
    const rotatedY = translatedX * Math.sin(rotRad) + translatedY * Math.cos(rotRad);
    
    return [
      screenWidth / 2 + rotatedX,
      screenHeight / 2 + rotatedY,
    ];
  });

  // Create polygon points string
  const points = screenCoords.map(coord => `${coord[0]},${coord[1]}`).join(' ');
  
  // Height-based styling
  const hue = 200 + building.height * 2;
  const lightness = Math.max(30, Math.min(70, 40 + building.height * 0.5));
  const fillColor = `hsl(${hue}, 60%, ${lightness}%)`;
  const strokeColor = `hsl(${hue}, 80%, ${Math.min(90, lightness + 20)}%)`;

  return (
    <G key={building.id}>
      {/* Building fill */}
      <Polygon
        points={points}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="2"
        opacity="0.8"
      />
      
      {/* Building outline */}
      <Polygon
        points={points}
        fill="none"
        stroke="#ffffff"
        strokeWidth="1"
        opacity="0.9"
        strokeDasharray={building.height > 30 ? "5,3" : "none"}
      />
    </G>
  );
}

// Road outline component using SVG
function RoadOutline({ 
  road, 
  centerLat, 
  centerLon, 
  camera 
}: { 
  road: Road; 
  centerLat: number; 
  centerLon: number; 
  camera: CameraState;
}) {
  // Convert coordinates to screen space
  const screenCoords = road.coordinates.map(([lon, lat]) => {
    const worldX = (lon - centerLon) * 111320;
    const worldY = (lat - centerLat) * 111320;
    
    const translatedX = (worldX - camera.x) * camera.zoom;
    const translatedY = (worldY - camera.y) * camera.zoom;
    
    const rotRad = (camera.rotation * Math.PI) / 180;
    const rotatedX = translatedX * Math.cos(rotRad) - translatedY * Math.sin(rotRad);
    const rotatedY = translatedX * Math.sin(rotRad) + translatedY * Math.cos(rotRad);
    
    return [
      screenWidth / 2 + rotatedX,
      screenHeight / 2 + rotatedY,
    ];
  });

  const points = screenCoords.map(coord => `${coord[0]},${coord[1]}`).join(' ');

  return (
    <Polyline
      key={road.id}
      points={points}
      fill="none"
      stroke="#666666"
      strokeWidth="3"
      opacity="0.7"
    />
  );
}

// Tree marker component using SVG
function TreeMarker({ 
  tree, 
  centerLat, 
  centerLon, 
  camera 
}: { 
  tree: Tree; 
  centerLat: number; 
  centerLon: number; 
  camera: CameraState;
}) {
  const [lon, lat] = tree.coordinate;
  const worldX = (lon - centerLon) * 111320;
  const worldY = (lat - centerLat) * 111320;
  
  const translatedX = (worldX - camera.x) * camera.zoom;
  const translatedY = (worldY - camera.y) * camera.zoom;
  
  const rotRad = (camera.rotation * Math.PI) / 180;
  const rotatedX = translatedX * Math.cos(rotRad) - translatedY * Math.sin(rotRad);
  const rotatedY = translatedX * Math.sin(rotRad) + translatedY * Math.cos(rotRad);
  
  const screenX = screenWidth / 2 + rotatedX;
  const screenY = screenHeight / 2 + rotatedY;
  
  const radius = Math.max(2, 6 * camera.zoom);

  return (
    <Circle
      key={tree.id}
      cx={screenX}
      cy={screenY}
      r={radius}
      fill="#228B22"
      stroke="#145214"
      strokeWidth="1"
      opacity="0.8"
    />
  );
}

// Main component
export default function CityMap3D() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [roads, setRoads] = useState<Road[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Camera state for navigation
  const [camera, setCamera] = useState<CameraState>({
    x: 0,
    y: 0,
    zoom: 0.8,
    rotation: 0,
  });

  // Center on Strand, London
  const centerLat = 51.5115;
  const centerLon = -0.1200;

  // Pan responder for map navigation
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt, gestureState) => {
        const { dx, dy, numberActiveTouches } = gestureState;

        if (numberActiveTouches === 1) {
          // Single finger: pan and rotate
          setCamera((prev) => ({
            ...prev,
            x: prev.x - dx * 2,
            y: prev.y - dy * 2,
            rotation: prev.rotation + dx * 0.1,
          }));
        } else if (numberActiveTouches === 2) {
          // Two fingers: zoom
          setCamera((prev) => ({
            ...prev,
            zoom: Math.max(0.1, Math.min(3, prev.zoom + dy * 0.01)),
          }));
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const bbox = `${centerLat - 0.005},${centerLon - 0.006},${centerLat + 0.005},${centerLon + 0.006}`;
        const query = `
          [out:json][timeout:30];
          (
            way["building"](${bbox});
            way["highway"]["highway"!~"footway|cycleway|path|steps|service|track|pedestrian|bridleway|construction"](${bbox});
            node["natural"="tree"](${bbox});
          );
          out geom;
        `;

        const response = await fetch('https://overpass-api.de/api/interpreter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(query)}`,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Process buildings
        const processedBuildings: Building[] = data.elements
          .filter((el: any) => el.type === 'way' && el.tags?.building && el.geometry && el.geometry.length > 2)
          .map((el: any, idx: number) => {
            const coordinates: [number, number][] = el.geometry.map((coord: any) => [coord.lon, coord.lat]);
            const levels = el.tags?.['building:levels'] || Math.floor(Math.random() * 12) + 1;
            const height = levels * 4 + Math.random() * 8 + 5;
            return {
              id: el.id?.toString() || `building-${idx}`,
              coordinates,
              height,
              name: el.tags?.name,
            };
          })
          .slice(0, 50);

        setBuildings(processedBuildings);

        // Process roads
        const processedRoads: Road[] = data.elements
          .filter((el: any) => el.type === 'way' && el.tags?.highway && el.geometry && el.geometry.length > 1)
          .map((el: any, idx: number) => {
            const coordinates: [number, number][] = el.geometry.map((coord: any) => [coord.lon, coord.lat]);
            return {
              id: el.id?.toString() || `road-${idx}`,
              coordinates,
              name: el.tags?.name,
            };
          })
          .slice(0, 25);

        setRoads(processedRoads);

        // Process trees
        const processedTrees: Tree[] = data.elements
          .filter((el: any) => el.type === 'node' && el.tags?.natural === 'tree')
          .map((el: any, idx: number) => ({
            id: el.id?.toString() || `tree-${idx}`,
            coordinate: [el.lon, el.lat],
          }))
          .slice(0, 20);

        setTrees(processedTrees);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load real data. Showing demo city outline.');

        // Demo data for fallback
        const demoBuildings: Building[] = Array.from({ length: 15 }, (_, i) => {
          const angle = (i / 15) * Math.PI * 2;
          const radius = 30 + Math.random() * 60;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return {
            id: `demo-${i}`,
            coordinates: [
              [centerLon + x / 111320, centerLat + y / 111320],
              [centerLon + (x + 8) / 111320, centerLat + y / 111320],
              [centerLon + (x + 8) / 111320, centerLat + (y + 8) / 111320],
              [centerLon + x / 111320, centerLat + (y + 8) / 111320],
            ],
            height: Math.random() * 80 + 10,
            name: i === 7 ? 'Demo Center' : undefined,
          };
        });

        setBuildings(demoBuildings);
        setRoads([]);
        setTrees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading city outline...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* Sky gradient background */}
      <View style={styles.skyGradient} />

      {/* SVG City Map */}
      <Svg 
        style={styles.svgContainer}
        width={screenWidth} 
        height={screenHeight}
      >
        {/* Render roads first (bottom layer) */}
        {roads.map((road) => (
          <RoadOutline 
            key={road.id} 
            road={road} 
            centerLat={centerLat} 
            centerLon={centerLon} 
            camera={camera} 
          />
        ))}

        {/* Render buildings */}
        {buildings.map((building) => (
          <BuildingOutline 
            key={building.id} 
            building={building} 
            centerLat={centerLat} 
            centerLon={centerLon} 
            camera={camera} 
          />
        ))}

        {/* Render trees (top layer) */}
        {trees.map((tree) => (
          <TreeMarker 
            key={tree.id} 
            tree={tree} 
            centerLat={centerLat} 
            centerLon={centerLon} 
            camera={camera} 
          />
        ))}
      </Svg>

      {/* UI Overlays */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.infoText}>
          🏢 {buildings.length} Buildings | 🛣️ {roads.length} Roads | 🌳 {trees.length} Trees
        </Text>
        <Text style={styles.infoSubText}>📍 Strand, London - SVG City Outline</Text>
        <Text style={styles.helpText}>
          One finger: Pan & Rotate | Two fingers: Zoom | Hermes Compatible
        </Text>
        <Text style={styles.cameraInfo}>
          Zoom: {camera.zoom.toFixed(1)} | Rotation: {camera.rotation.toFixed(0)}°
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  skyGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: '#1a1a2e',
    opacity: 0.6,
  },
  svgContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0a0a0a',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ffffff',
  },
  errorContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.15)',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    textAlign: 'center',
  },
  info: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  infoSubText: {
    color: '#cccccc',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 6,
  },
  helpText: {
    color: '#999999',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 4,
  },
  cameraInfo: {
    color: '#999999',
    fontSize: 10,
    textAlign: 'center',
  },
}); 