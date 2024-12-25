import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getBoilerById, updateBoiler, deleteBoilerById } from "@/db/queries";
import * as Network from "expo-network";
import $api from "@/http";

const BoilerDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [boiler, setBoiler] = useState<any | null>(null);
  const boilerId = Array.isArray(id) ? id[0] : id;
  const [name, setName] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);
  const [sensorData, setSensorData] = useState({
    humidity: "",
    pressure: "",
    temperature: "",
    rotation_speed: "",
  });

  // Получаем данные котла при монтировании компонента
  useEffect(() => {
    const fetchBoilerData = async () => {
      if (boilerId) {
        const data = await getBoilerById(boilerId); // Получаем данные котла по id
        if (data) {
          setBoiler(data);
          setName(data.name);
          setStatus(data.status);
          setSensorData({
            humidity: data.humidity.toString(), // Преобразуем число в строку
            pressure: data.pressure.toString(),
            temperature: data.temperature.toString(),
            rotation_speed: data.rotation_speed.toString(),
          });
        }
      }
    };

    fetchBoilerData();
  }, [boilerId]);

  const handleSave = async () => {
    const updatedBoiler = {
      id: boiler?.id,
      name,
      status,
      sensor_data: {
        humidity: parseFloat(sensorData.humidity) || 0,
        pressure: parseFloat(sensorData.pressure) || 0,
        temperature: parseFloat(sensorData.temperature) || 0,
        rotation_speed: parseFloat(sensorData.rotation_speed) || 0,
      },
      synced: false,
    };

    // Обновляем локально
    if (boiler) {
      await updateBoiler(updatedBoiler);
      Alert.alert("Успех", "Данные обновлены локально");

      // Синхронизируем с сервером
      const isConnected = await Network.getNetworkStateAsync();
      if (isConnected.isConnected) {
        try {
          console.log("Улетел на обновление: ", updatedBoiler);
          const response = await $api.post("/changeBoiler", updatedBoiler);
          if (response.status === 200) {
            Alert.alert("Успех", "Данные синхронизированы с сервером");

            // Получаем обновленные данные с сервера
            const serverBoiler = response.data.boiler; // Если сервер возвращает обновлённые данные
            await updateBoiler(serverBoiler); // Обновляем локально
          }
        } catch (error) {
          console.error("Ошибка синхронизации:", error);
        }
      }
    }
  };

  const handleDelete = async () => {
    if (!boiler) return;

    const isConnected = await Network.getNetworkStateAsync();
    try {
      if (isConnected.isConnected) {
        await $api.post("/deleteBoiler", { id: boiler.id }); // Удаляем котел с сервера
        Alert.alert("Удалено", "Элемент удален с сервера");
      } else {
        // Удаляем локально, если нет подключения
        await deleteBoilerById(boiler.id);
        Alert.alert("Удалено", "Элемент удален локально");
      }
    } catch (error) {
      console.error("Error deleting boiler:", error);
    }
    router.push("/(tabs)"); // Вернуться на главную страницу после удаления
  };

  return (
    <View style={styles.container}>
      {boiler ? (
        <>
          <Text style={styles.title}>Редактировать {boiler.name}</Text>

          <TextInput
            style={styles.input}
            placeholder="Название"
            value={name}
            onChangeText={setName}
          />

          <View style={styles.switchContainer}>
            <Text>Статус</Text>
            <Switch value={status} onValueChange={setStatus} />
          </View>

          <Text style={styles.sectionTitle}>Sensor Data</Text>
          <TextInput
            style={styles.input}
            placeholder="Humidity"
            keyboardType="numeric"
            value={sensorData.humidity}
            onChangeText={(value) =>
              setSensorData({ ...sensorData, humidity: value })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Pressure"
            keyboardType="numeric"
            value={sensorData.pressure}
            onChangeText={(value) =>
              setSensorData({ ...sensorData, pressure: value })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Temperature"
            keyboardType="numeric"
            value={sensorData.temperature}
            onChangeText={(value) =>
              setSensorData({ ...sensorData, temperature: value })
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Rotation Speed"
            keyboardType="numeric"
            value={sensorData.rotation_speed}
            onChangeText={(value) =>
              setSensorData({ ...sensorData, rotation_speed: value })
            }
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>Загрузка...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default BoilerDetails;
