import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useState, useRef } from "react";
import LoginScreen from "./LoginScreen";
import RegistrationScreen from "./RegistrationScreen";

const RegistrationStack = createNativeStackNavigator();
export default function LoginRegistrationStackScreen({ navigation }) {
  return (
    <>
      <RegistrationStack.Navigator
        screenOptions={{ headerTitleAlign: "center", headerTintColor: "green" }}
      >
        <RegistrationStack.Screen name="Login" component={LoginScreen} />
        <RegistrationStack.Screen
          name="Registration"
          component={RegistrationScreen}
        />
      </RegistrationStack.Navigator>
    </>
  );
}
