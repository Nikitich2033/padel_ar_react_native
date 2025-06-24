import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text, Image } from 'react-native';
import MapView, { PROVIDER_DEFAULT, Marker, Region, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

interface PadelClub {
  id: string;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  description: string;
  image: string;
  rating: number;
  distance?: number;
}

// Mock data for padel clubs around central London
const allPadelClubs: PadelClub[] = [
  {
    id: '1',
    name: 'Hyde Park Padel Club',
    coordinate: { latitude: 51.5085, longitude: -0.1515 },
    description: 'Premium padel club near Hyde Park with 6 courts',
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=300&fit=crop',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Camden Padel Center',
    coordinate: { latitude: 51.5290, longitude: -0.1255 },
    description: 'Modern facility with professional coaching in Camden',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    rating: 4.2,
  },
  {
    id: '3',
    name: 'Royal Chelsea Padel',
    coordinate: { latitude: 51.4874, longitude: -0.1687 },
    description: 'Exclusive club with tournament facilities in Chelsea',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    rating: 4.8,
  },
  {
    id: '4',
    name: 'Canary Wharf Padel',
    coordinate: { latitude: 51.5054, longitude: -0.0235 },
    description: 'State-of-the-art facility in the financial district',
    image: 'https://images.unsplash.com/photo-1584433144859-68b559dace4e?w=400&h=300&fit=crop',
    rating: 4.1,
  },
  {
    id: '5',
    name: 'Southbank Padel Club',
    coordinate: { latitude: 51.5045, longitude: -0.1097 },
    description: 'Riverside courts with Thames views',
    image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=400&h=300&fit=crop',
    rating: 4.3,
  },
  {
    id: '6',
    name: 'Islington Sports Padel',
    coordinate: { latitude: 51.5416, longitude: -0.1022 },
    description: 'Community-focused club in North London',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop',
    rating: 4.6,
  },
  {
    id: '7',
    name: 'Kensington Padel Academy',
    coordinate: { latitude: 51.4994, longitude: -0.1947 },
    description: 'Premium training academy in affluent Kensington',
    image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop',
    rating: 4.7,
  },
  {
    id: '8',
    name: 'Hackney Padel Courts',
    coordinate: { latitude: 51.5450, longitude: -0.0553 },
    description: 'Hip East London club with vibrant atmosphere',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
    rating: 4.0,
  },
  {
    id: '9',
    name: 'Westminster Padel Elite',
    coordinate: { latitude: 51.4975, longitude: -0.1357 },
    description: 'Central London location near Parliament',
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop',
    rating: 4.4,
  },
  {
    id: '10',
    name: 'Greenwich Padel Park',
    coordinate: { latitude: 51.4816, longitude: 0.0052 },
    description: 'Beautiful courts near Greenwich Observatory',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop',
    rating: 4.2,
  },
];

export default function AppleMap() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [mapRegion, setMapRegion] = useState<Region | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(10); // km
  const [visibleClubs, setVisibleClubs] = useState<PadelClub[]>([]);
  const mapRef = useRef<MapView>(null);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter clubs within radius and calculate distances
  const filterClubsByRadius = (userLat: number, userLng: number, radiusKm: number) => {
    const clubsWithDistance = allPadelClubs.map(club => ({
      ...club,
      distance: calculateDistance(userLat, userLng, club.coordinate.latitude, club.coordinate.longitude)
    })).filter(club => club.distance! <= radiusKm);
    
    setVisibleClubs(clubsWithDistance);
    return clubsWithDistance;
  };

  // Auto-fit map to show all visible clubs
  const fitMapToClubs = (clubs: PadelClub[], userLocation?: { latitude: number; longitude: number }) => {
    if (clubs.length === 0 && !userLocation) return;

    const coordinates = clubs.map(club => club.coordinate);
    if (userLocation) {
      coordinates.push(userLocation);
    }

    if (coordinates.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        Alert.alert('Permission Denied', 'Location permission is required to show your position on the map. Defaulting to Central London.');
        
        // Fallback to Central London if permission denied
        const fallbackRegion = {
          latitude: 51.5074,
          longitude: -0.1278,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setMapRegion(fallbackRegion);
        const clubs = filterClubsByRadius(51.5074, -0.1278, radius);
        setTimeout(() => fitMapToClubs(clubs, { latitude: 51.5074, longitude: -0.1278 }), 1000);
        return;
      }

      try {
        let userLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setLocation(userLocation);
        
        // Set map region to user's location
        const userRegion = {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setMapRegion(userRegion);
        
        // Filter clubs and fit map
        const clubs = filterClubsByRadius(userLocation.coords.latitude, userLocation.coords.longitude, radius);
        setTimeout(() => fitMapToClubs(clubs, { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude }), 1000);
      } catch (error) {
        console.log('Error getting location:', error);
        setErrorMsg('Error getting location');
        
        // Fallback to Central London if location fetch fails
        const fallbackRegion = {
          latitude: 51.5074,
          longitude: -0.1278,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setMapRegion(fallbackRegion);
        const clubs = filterClubsByRadius(51.5074, -0.1278, radius);
        setTimeout(() => fitMapToClubs(clubs, { latitude: 51.5074, longitude: -0.1278 }), 1000);
      }
    })();
  }, []);

  // Update clubs when radius changes
  useEffect(() => {
    if (location || mapRegion) {
      const lat = location?.coords.latitude || 51.5074;
      const lng = location?.coords.longitude || -0.1278;
      const clubs = filterClubsByRadius(lat, lng, radius);
      setTimeout(() => fitMapToClubs(clubs, { latitude: lat, longitude: lng }), 500);
    }
  }, [radius]);

  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
  };

  const renderClubMarker = (club: PadelClub) => (
    <Marker
      key={club.id}
      coordinate={club.coordinate}
      title={club.name}
      description={club.description}
    >
      <View style={styles.markerContainer}>
        <Image
          source={{ uri: club.image }}
          style={styles.markerImage}
          onError={(e) => console.log('Image load error:', e)}
        />
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>⭐ {club.rating}</Text>
        </View>
      </View>
      <Callout style={styles.callout}>
        <View style={styles.calloutContainer}>
          <Image
            source={{ uri: club.image }}
            style={styles.calloutImage}
          />
          <View style={styles.calloutTextContainer}>
            <Text style={styles.calloutTitle}>{club.name}</Text>
            <Text style={styles.calloutDescription}>{club.description}</Text>
            <Text style={styles.calloutRating}>Rating: ⭐ {club.rating}</Text>
            {club.distance && (
              <Text style={styles.calloutDistance}>
                Distance: {club.distance.toFixed(1)} km
              </Text>
            )}
          </View>
        </View>
      </Callout>
    </Marker>
  );

  // Don't render map until we have a region
  if (!mapRegion) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading padel clubs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        showsScale={true}
        mapType="standard"
        followsUserLocation={false}
      >
        {visibleClubs.map(renderClubMarker)}
      </MapView>
      
      {/* Radius Control Panel */}
      <View style={styles.controlPanel}>
        <Text style={styles.controlTitle}>Search Radius: {radius} km</Text>
        <Text style={styles.clubCount}>{visibleClubs.length} clubs found</Text>
        <View style={styles.radiusButtons}>
          {[5, 10, 15, 20].map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.radiusButton,
                radius === r && styles.activeRadiusButton
              ]}
              onPress={() => handleRadiusChange(r)}
            >
              <Text style={[
                styles.radiusButtonText,
                radius === r && styles.activeRadiusButtonText
              ]}>
                {r} km
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={styles.fitButton}
          onPress={() => {
            const lat = location?.coords.latitude || 51.5074;
            const lng = location?.coords.longitude || -0.1278;
            fitMapToClubs(visibleClubs, { latitude: lat, longitude: lng });
          }}
        >
          <Text style={styles.fitButtonText}>📍 Fit All Clubs</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#2E7D32',
  },
  ratingBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  ratingText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  callout: {
    width: 280,
  },
  calloutContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  calloutImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  calloutTextContainer: {
    flex: 1,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2E7D32',
  },
  calloutDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  calloutRating: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF9800',
    marginBottom: 2,
  },
  calloutDistance: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: 'bold',
  },
  controlPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
    color: '#2E7D32',
  },
  clubCount: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666',
  },
  radiusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  radiusButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  activeRadiusButton: {
    backgroundColor: '#4CAF50',
  },
  radiusButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  activeRadiusButtonText: {
    color: 'white',
  },
  fitButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  fitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 