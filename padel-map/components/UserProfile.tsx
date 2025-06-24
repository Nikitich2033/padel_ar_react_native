import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';

interface MatchPerformance {
  id: string;
  date: string;
  opponent: string;
  result: 'win' | 'loss';
  score: string;
  venue: string;
  duration: string;
}

const recentMatches: MatchPerformance[] = [
  {
    id: '1',
    date: '2024-01-20',
    opponent: 'Sarah & Mike',
    result: 'win',
    score: '6-4, 6-3',
    venue: 'Hyde Park Padel Club',
    duration: '1h 25m',
  },
  {
    id: '2',
    date: '2024-01-18',
    opponent: 'James & Emma',
    result: 'loss',
    score: '4-6, 6-7',
    venue: 'Royal Chelsea Padel',
    duration: '1h 48m',
  },
  {
    id: '3',
    date: '2024-01-15',
    opponent: 'Alex & Lisa',
    result: 'win',
    score: '6-2, 6-4',
    venue: 'Camden Padel Center',
    duration: '1h 12m',
  },
  {
    id: '4',
    date: '2024-01-12',
    opponent: 'David & Kate',
    result: 'win',
    score: '6-3, 4-6, 6-4',
    venue: 'Canary Wharf Padel',
    duration: '2h 05m',
  },
];

export default function UserProfile() {
  const calculateWinRate = () => {
    const wins = recentMatches.filter(match => match.result === 'win').length;
    return Math.round((wins / recentMatches.length) * 100);
  };

  const renderMatchCard = (match: MatchPerformance) => (
    <View key={match.id} style={[styles.matchCard, match.result === 'win' ? styles.winCard : styles.lossCard]}>
      <View style={styles.matchHeader}>
        <Text style={styles.matchDate}>{new Date(match.date).toLocaleDateString('en-GB')}</Text>
        <View style={[styles.resultBadge, match.result === 'win' ? styles.winBadge : styles.lossBadge]}>
          <Text style={styles.resultText}>{match.result.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.matchOpponent}>vs {match.opponent}</Text>
      <Text style={styles.matchScore}>{match.score}</Text>
      
      <View style={styles.matchDetails}>
        <Text style={styles.matchVenue}>📍 {match.venue}</Text>
        <Text style={styles.matchDuration}>⏱️ {match.duration}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' }}
            style={styles.avatar}
          />
          <View style={styles.statusIndicator} />
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>Alex Thompson</Text>
          <Text style={styles.userLocation}>📍 Central London, UK</Text>
          <Text style={styles.memberSince}>Member since January 2023</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.2</Text>
          <Text style={styles.statLabel}>Player Rating</Text>
          <Text style={styles.statSubtext}>⭐⭐⭐⭐☆</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{calculateWinRate()}%</Text>
          <Text style={styles.statLabel}>Win Rate</Text>
          <Text style={styles.statSubtext}>Last 10 matches</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Matches Played</Text>
          <Text style={styles.statSubtext}>This month</Text>
        </View>
      </View>

      {/* Achievement Banner */}
      <View style={styles.achievementBanner}>
        <Text style={styles.achievementIcon}>🏆</Text>
        <View style={styles.achievementText}>
          <Text style={styles.achievementTitle}>Tournament Winner!</Text>
          <Text style={styles.achievementDescription}>Camden Winter Championship 2024</Text>
        </View>
      </View>

      {/* Recent Matches */}
      <View style={styles.matchesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Matches</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {recentMatches.map(renderMatchCard)}
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📅</Text>
            <Text style={styles.actionText}>Book Court</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionText}>Find Players</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🏆</Text>
            <Text style={styles.actionText}>Tournaments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#4CAF50',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  achievementBanner: {
    backgroundColor: '#FFD700',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B8860B',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#B8860B',
  },
  matchesSection: {
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E8F5E8',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '600',
  },
  matchCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  winCard: {
    borderLeftColor: '#4CAF50',
  },
  lossCard: {
    borderLeftColor: '#FF5722',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  matchDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  resultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  winBadge: {
    backgroundColor: '#E8F5E8',
  },
  lossBadge: {
    backgroundColor: '#FFEBEE',
  },
  resultText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  matchOpponent: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  matchScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  matchDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  matchVenue: {
    fontSize: 12,
    color: '#666',
  },
  matchDuration: {
    fontSize: 12,
    color: '#666',
  },
  actionsSection: {
    margin: 16,
    marginBottom: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    backgroundColor: 'white',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
}); 