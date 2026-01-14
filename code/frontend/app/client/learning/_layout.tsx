import { Stack } from 'expo-router';

export default function LearningLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="word-swipe/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="grammar/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="listening/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
