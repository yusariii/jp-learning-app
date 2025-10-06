import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function IndexPage() {
  const router = useRouter();

  const navigateToAdmin = () => {
    router.push("/admin"); 
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to my app!</Text>
      <Button title="Go to Admin Panel" onPress={navigateToAdmin} />
    </View>
  );
}