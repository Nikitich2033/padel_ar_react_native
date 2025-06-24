import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import AppleMap from '@/components/AppleMap';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Padel Map</Text>
      <AppleMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: 'transparent',
  },
});
