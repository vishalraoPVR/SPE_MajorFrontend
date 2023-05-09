import HomeScreen from "./HomeScreen";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ProfileScreen from "./ProfileScreen";
import Icon from "react-native-vector-icons/Ionicons";
import {View,StyleSheet,Button} from 'react-native';

import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Text,
  TouchableRipple,
  Switch,
  
} from 'react-native-paper'

import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home } from "@mui/icons-material";

const Drawer = createDrawerNavigator();

import UpdateMenu from "./UpdateMenu";
import MessDetails from "./MessDetails";
import CustomerList from "./CustomerList";
import CustomerRequest from "./CustomerRequest";

const Tab = createMaterialBottomTabNavigator();


function MessOwnerTabScreen(){
  
    return(
      <Drawer.Navigator>
      <Drawer.Screen name="Home" component={HomeScreen} 
      options={{
        drawerIcon:({ focused }) => (
          <Icon name="home" />
        )
      }}
      />
      <Drawer.Screen name="profile" component={ProfileScreen} 
      options={{
        drawerIcon:({ focused }) => (
          <Icon name="person-circle-outline" />
        )
      }}
      />
      <Drawer.Screen name="Update Menu" component={UpdateMenu}
      options={{
        drawerIcon:({ focused }) => (
         <></>
        )
      }}
      />
      <Drawer.Screen name="Mess Details" component={MessDetails}/>
      <Drawer.Screen name="Customers" component={CustomerList} />
      <Drawer.Screen name="Requests" component={CustomerRequest}/>

    </Drawer.Navigator>
    );
  }

  const styles =StyleSheet.create({

  });

  export default MessOwnerTabScreen
