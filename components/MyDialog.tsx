import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
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
import UUID from "react-native-uuid";

interface MyDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: DataItem) => void;
}

export const MyDialog = ({ visible, onClose, onSave }: MyDialogProps) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState(false);
  const [sensorData, setSensorData] = useState({
    humidity: "",
    pressure: "",
    temperature: "",
    rotation_speed: "",
  });
  const resetForm = () => {
    setName("");
    setStatus(false);
    setSensorData({
      humidity: "",
      pressure: "",
      temperature: "",
      rotation_speed: "",
    });
  };
  const handleSave = () => {
    const newItem: DataItem = {
      id: UUID.v4().toString(),
      name,
      status,
      sensor_data: {
        humidity: parseFloat(sensorData.humidity) || 0,
        pressure: parseFloat(sensorData.pressure) || 0,
        temperature: parseFloat(sensorData.temperature) || 0,
        rotation_speed: parseFloat(sensorData.rotation_speed) || 0,
      },
    };
    onSave(newItem);
    resetForm();
    onClose();
  };

  function onCancel() {
    resetForm();
    onClose();
  }

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Добавить элемент</Text>
          <TextInput
            style={styles.input}
            placeholder="Название"
            value={name}
            onChangeText={setName}
          />
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Статус</Text>
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
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Отмена</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
