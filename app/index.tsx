import { useState } from "react";
import {
  Button,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sha256 } from "js-sha256";
import $api from "../http";
import uuid from "react-native-uuid";
import { Stack, useRouter } from "expo-router";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onPress = async () => {
    const user_UUID = uuid.v4();
    const hash = sha256(password);

    const data = {
      login: login,
      password: hash,
      UUID4: user_UUID,
      isSession: true,
    };

    try {
      await $api.post("/login", data);
      await AsyncStorage.setItem("Logged", "true");
      await AsyncStorage.setItem("username", login);
      router.replace("./(tabs)");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "X R I Z A L",
          headerStyle: {
            backgroundColor: "#A0222A",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
            color: "#fff",
          },
          headerTitleAlign: "center",
        }}
      />
      <View style={[styles.viewWrapper, styles.shadowView]}>
        <View style={styles.signInView}>
          <Text style={styles.text}>Вход в систему</Text>
          <TextInput
            style={styles.input}
            onChangeText={setLogin}
            value={login}
            placeholder="Ваш логин"
            keyboardType="default"
          />
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Пароль"
            secureTextEntry={true}
          />
        </View>
        <Button onPress={onPress} title="Войти" color="#91ee91" />
        <Button
          onPress={() => router.replace("./(tabs)")}
          title="Force"
          color="blue"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 26,
    paddingBottom: 10,
    textAlign: "center",
  },
  viewWrapper: {
    borderWidth: 1,
    maxWidth: 400,
    borderRadius: 8,
    padding: 35,
    maxHeight: 500,
    backgroundColor: "#fff",
    gap: 20,
  },
  shadowView: {
    shadowColor: "red",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
  },
  signInView: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 0,
    backgroundColor: "#dcdbdd",
    borderRadius: 16,
    color: "#000",
    fontWeight: "bold",
    padding: 9,
    fontSize: 18,
    width: 250,
    height: 50,
  },
});
