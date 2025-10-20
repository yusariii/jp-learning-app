import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function IndexPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const navigateToAdmin = () => {
    router.push("/admin");
  };

  return (
    <View style={{
      flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>
      <Text>Welcome to my app!</Text>
      <Button title="Go to Admin Panel" onPress={navigateToAdmin} />
    </View>
  );
}