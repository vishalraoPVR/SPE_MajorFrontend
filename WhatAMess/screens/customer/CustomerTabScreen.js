import HomeScreen from "./HomeScreen";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import ProfileScreen from "./ProfileScreen";

import Icon from "react-native-vector-icons/Ionicons";
import HomeScreenStack from "./HomeScreenStack";

const Tab = createMaterialBottomTabNavigator();

//component to be rendered if user logs in
function CustomerTabScreen() {
  return (
    <Tab.Navigator
    // screenOptions={{headerShown:false}}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreenStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => {
            return <Icon name="person" size={size} color={color} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default CustomerTabScreen;
