import { MyDialog } from "@/components/MyDialog";
import $api from "@/http";
import { Boiler } from "@/models/Boiler";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface DataItem {
  id: string;
  name: string;
  status: boolean;
  sensor_data: {
    humidity: number;
    pressure: number;
    temperature: number;
    rotation_speed: number;
  };
}
export default function BoilersScreen() {
  const [data, setData] = useState<DataItem[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleAdd = (newItem: DataItem) => {
    setData((prev) => [...prev, newItem]);
  };

  const handlePress = () => {
    setDialogVisible(true);
  };

  useEffect(() => {
    $api
      .get("/getBoilers")
      .then((result) => {
        setData(result.data);
        console.log("changed");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const renderItem = ({ item }: { item: DataItem }) => (
    <View style={styles.card} key={item.id}>
      <Text style={styles.cardText}>{item.name}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerRight: () => (
            <View style={{ marginRight: 25 }}>
              <Button title="+" onPress={handlePress} />
            </View>
          ),
        }}
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      <MyDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        onSave={handleAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    paddingBottom: 0,
    paddingTop: 0,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 15,
  },
  cardText: {
    fontSize: 30,
  },
});
