import { View, Text, Pressable, Alert, Platform } from "react-native";
import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { Form, FormItem } from "react-native-form-component";
import { baseUrl } from "../assets/URL";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { GlobalContext } from "../context/userContext";

function LoginScreen({ navigation }) {
  const { globalState, setGlobalState } = useContext(GlobalContext);

  //store credentials
  const [credentials, setcredentials] = useState({
    username: "",
    password: "",
  });
  const credentialInput = useRef();

  return (
    <View className="flex-1 justify-center p-5">
      <Form
        buttonText="Login"
        //api call here
        onButtonPress={async () => {
          await axios
            .post(`${baseUrl}/authenticate`, {
              ...credentials,
            })
            .then((res) => {
              console.log(res.data);

              //persisting the user in async storage only on app
              if (Platform.OS !== "web") {
                (async () => {
                  try {
                    await AsyncStorage.setItem(
                      "logged-in-user",
                      JSON.stringify(res.data)
                    );
                  } catch (e) {
                    console.log("Error in async storage:", e);
                  }
                })(); //called the function here itself using '()'
              }

              Alert.alert(
                "Welcome",
                `${res.data.role} :- ${res.data.username}`,
                [
                  // {
                  //   text: 'Cancel',
                  //   style: 'cancel',
                  // },
                  {
                    text: "Thanks",
                    onPress: () => {
                      if (res.data.role === "CUSTOMER")
                        // nav.navigate('CustomerScreen');
                        setGlobalState({ ...res.data, isLoggedIn: true });
                      // nav.navigate('MessOwnerScreen');
                      else setGlobalState({ ...res.data, isLoggedIn: true });
                    },
                  },
                ]
              );
            })
            .catch((err) => {
              console.log(err);
              Alert.alert("Oops!", `Check you credentials.`, [{ text: "OK" }]);
            });
        }}
      >
        <FormItem
          label="User Name"
          isRequired
          value={credentials.username}
          onChangeText={(i) => setcredentials({ ...credentials, username: i })}
          asterik
          ref={credentialInput}
        />
        <FormItem
          label="Password"
          isRequired
          value={credentials.password}
          onChangeText={(i) => setcredentials({ ...credentials, password: i })}
          asterik
          ref={credentialInput}
        />
      </Form>
      <Pressable
        onPress={() => navigation.navigate("Registration")}
        style={{ alignItems: "center" }}
      >
        <Text>Register?</Text>
      </Pressable>
    </View>
  );
}

export default LoginScreen;
