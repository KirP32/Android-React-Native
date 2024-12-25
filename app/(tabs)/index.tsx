import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Alert,
  TouchableHighlight,
  Pressable,
  TextInput,
} from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import * as Network from "expo-network";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getBoilers,
  getUnsyncedBoilers,
  insertBoiler,
  updateBoilerSyncStatus,
  DataItem,
  updateBoiler,
  insertOrUpdateBoiler,
  deleteBoilersByIds,
} from "@/db/queries";
import $api from "@/http";
import { MyDialog } from "@/components/MyDialog";
import { useIsFocused } from "@react-navigation/native";

export default function BoilersScreen() {
  const router = useRouter();
  const [data, setData] = useState<DataItem[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [searchQuery, setSearchQuery] = useState(""); // Хранит текст поиска
  const [filteredData, setFilteredData] = useState<DataItem[]>([]); // Отфильтрованные данные

  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const isFocused = useIsFocused();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredData(data); // Если поле поиска пустое, показываем все устройства
    } else {
      const filtered = data.filter(
        (item) => item.name.toLowerCase().includes(query.toLowerCase()) // Фильтруем по имени
      );
      setFilteredData(filtered);
    }
  };

  const handleAdd = async (newItem: DataItem) => {
    try {
      await insertBoiler(newItem);

      setData((prevData) => [newItem, ...prevData]);

      const isConnected = await Network.getNetworkStateAsync();
      if (isConnected.isConnected) {
        try {
          const response = await $api.post("/createBoiler", {
            name: newItem.name,
            status: newItem.status,
            sensor_data: newItem.sensor_data,
          });

          if (response.status === 201) {
            await insertOrUpdateBoiler(newItem);
            syncDataWithServer();
          }
          console.log("Элемент успешно добавлен и синхронизирован с сервером");
        } catch (serverError) {
          console.error("Ошибка при синхронизации с сервером:", serverError);
        }
      } else {
        console.log("Интернет недоступен, элемент добавлен только локально");
      }
    } catch (error) {
      console.error("Ошибка при добавлении элемента:", error);
    }
  };

  const handlePress = () => {
    setDialogVisible(true);
  };

  const saveConnectionState = async (status: boolean) => {
    try {
      await AsyncStorage.setItem("isConnected", JSON.stringify(status));
    } catch (error) {
      console.error("Error saving connection state:", error);
    }
  };

  const loadConnectionState = async () => {
    try {
      const savedState = await AsyncStorage.getItem("isConnected");
      if (savedState !== null) {
        setIsConnected(JSON.parse(savedState));
      }
    } catch (error) {
      console.error("Error loading connection state:", error);
    }
  };

  const syncDataWithServer = async () => {
    try {
      const unsyncedBoilers = await getUnsyncedBoilers();

      if (unsyncedBoilers.length > 0) {
        await Promise.all(
          unsyncedBoilers.map(async (boiler) => {
            const data = {
              id: boiler.id,
              name: boiler.name,
              sensor_data: boiler.sensor_data,
              status: boiler.status,
            };
            try {
              const response = await $api.post("/changeBoiler", data);
              if (response.status === 200) {
                await updateBoilerSyncStatus(boiler.id);
              }
            } catch (error) {
              console.error("Ошибка синхронизации бойлера:", error);
            }
          })
        );
      }

      // После синхронизации принудительно получаем обновлённые данные
      const result = await $api.get("/getBoilers");
      setData(result.data as DataItem[]);
      setFilteredData(result.data as DataItem[]); // Обновляем фильтрованные данные
      console.log("Данные обновлены с сервера");
    } catch (error) {
      console.error("Ошибка в syncDataWithServer:", error);
    }
  };

  useEffect(() => {
    loadConnectionState();

    const checkNetworkAndFetchData = async () => {
      const networkState = await Network.getNetworkStateAsync();
      const isCurrentlyConnected = networkState.isConnected ?? false;

      setIsConnected(isCurrentlyConnected);
      await saveConnectionState(isCurrentlyConnected);

      if (isCurrentlyConnected) {
        await syncDataWithServer();
      } else {
        const boilers = await getBoilers();
        setData(boilers as DataItem[]);
        console.log("Data fetched from local DB");
      }
    };

    checkNetworkAndFetchData();
  }, []);

  useEffect(() => {
    const checkNetworkAndFetchData = async () => {
      const networkState = await Network.getNetworkStateAsync();
      const isCurrentlyConnected = networkState.isConnected ?? false;

      setIsConnected(isCurrentlyConnected);
      await saveConnectionState(isCurrentlyConnected);

      if (isCurrentlyConnected) {
        await syncDataWithServer();
      } else {
        const boilers = await getBoilers();
        setData(boilers as DataItem[]);
        setFilteredData(boilers as DataItem[]); // Изначально показываем все устройства
      }
    };

    checkNetworkAndFetchData();
  }, [isFocused]); // Зависимость от isFocused для перезагрузки данных при возврате на экран

  useEffect(() => {
    const filterData = () => {
      if (searchQuery.trim() === "") {
        setFilteredData(data); // Если поле поиска пустое, показываем все устройства
      } else {
        const filtered = data.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
      }
    };

    filterData(); // Фильтруем данные, когда изменяется data или searchQuery
  }, [data, searchQuery]);

  const renderItem = ({ item }: { item: DataItem }) => (
    <Link href={`/details?id=${item.id}`} asChild>
      <Pressable style={styles.card}>
        <Text style={styles.cardText}>{item.name}</Text>
      </Pressable>
    </Link>
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
      <TextInput
        placeholder="Поиск устройств..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <FlatList
        data={[...filteredData].reverse()}
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
