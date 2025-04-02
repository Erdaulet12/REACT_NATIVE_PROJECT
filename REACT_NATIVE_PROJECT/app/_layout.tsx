import { Stack } from 'expo-router';

export default function Layout() {
    return (
        <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8f8f8' }, headerTitleAlign: 'center' }}>
            <Stack.Screen name="index" options={{ title: 'Главная' }} />
            <Stack.Screen name="add-note" options={{ title: 'Добавить заметку' }} />
        </Stack>
    );
}
