import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import AppleMap from '@/components/AppleMap';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <AppleMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 