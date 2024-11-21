import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";

export default function Login() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const onPress = () => {};

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={[styles.viewWrapper, styles.shadowView]}>
        <Text style={styles.text}>Вход в систему</Text>
        <View style={styles.signInView}>
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
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
