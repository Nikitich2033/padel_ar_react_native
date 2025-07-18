import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import UserProfile from '@/components/UserProfile';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <UserProfile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
