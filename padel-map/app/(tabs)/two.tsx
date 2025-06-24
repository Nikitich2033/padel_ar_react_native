import { StyleSheet } from 'react-native';
import CityMap3D from '@/components/CityMap3D';

export default function TabTwoScreen() {
  return <CityMap3D />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
