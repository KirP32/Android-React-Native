import { Stack, useLocalSearchParams } from 'expo-router'
import { View, Text } from 'react-native'

export default function RootLayout() {
    const { id } = useLocalSearchParams();
    console.log(id);
    return (
        <View>
            <Stack.Screen options={{ title: 'Вторая страница', headerTitleAlign: 'center', }} />
            <Text style={{ color: 'white' }}>secondPage here and ID: {id}</Text>
        </View>
    )
}