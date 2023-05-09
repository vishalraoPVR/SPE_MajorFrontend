import React from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginRegistrationStackScreen from "./screens/LoginRegistrationScreen";
import { useEffect, useState } from "react";
import CustomerTabScreen from "./screens/customer/CustomerTabScreen";
import MessOwnerTabScreen from "./screens/mess/MessOwnerTabScreen";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GlobalContext } from "./context/userContext";

const Stack = createNativeStackNavigator();
export default function App() {
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [globalState, setGlobalState] = useState({
    username: "",
    role: "",
    token: "",
    isLoggedIn: true,
  }); //maining a global state as this is passed to child component
  //and when anything changes, useEffect is called as it is dependednt on globalState variable

  useEffect(() => {
    if (Platform.OS !== "web") {
      (async () => {
        try {
          const val = JSON.parse(await AsyncStorage.getItem("logged-in-user"));
          setLoggedinUser(val);
          setGlobalState({ ...loggedinUser, isLoggedIn: true });
          // console.log(val);
        } catch (e) {
          console.log("Error in async storage:", e);
        }
      })();
    }
  }, [globalState]);

  return (
    <GlobalContext.Provider value={{ globalState, setGlobalState }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTitleAlign: "center",
            headerTintColor: "purple",
            headerTitle: "What a Mess",
          }}
        >
          {
            loggedinUser === null ? (
              <Stack.Screen
                name="Setup"
                component={LoginRegistrationStackScreen}
              /> //return login screen if user is null {}
            ) : loggedinUser?.role === "CUSTOMER" ? (
              <Stack.Screen
                name="CustomerScreen"
                component={CustomerTabScreen}
              /> //return customer screens
            ) : (
              <Stack.Screen
                name="MessOwnerScreen"
                component={MessOwnerTabScreen}
              />
            ) //return owner screens
          }
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </GlobalContext.Provider>
  );
}
