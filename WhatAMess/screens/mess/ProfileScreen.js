import React, { useContext, useEffect, useState } from 'react'
import { View, Button, StyleSheet, SafeAreaView } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Avatar, Title, Caption, Text, TouchableRipple } from 'react-native-paper';
import { GlobalContext } from '../../context/userContext'

import FAIcon from "react-native-vector-icons/FontAwesome";
// import Icon from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
import axios from 'axios';
import { baseUrl } from '../../assets/URL';


function ProfileScreen({ navigation }) {
  const { globalState, setGlobalState } = useContext(GlobalContext);
  const[data,setData] = useState();
  const [loading,setLoading] =useState(true);

  const fetchData = async () => {
    console.log("Hello in axios")
    await axios
      .get(`${baseUrl}/mess/owner-details/${globalState.username}`, {
        //make sure that the token starts with Bearer
        headers: {
          Authorization: `Bearer ${globalState?.token}`,
        },
      })
      .then((res) => {
        console.log("Res",res.data);
        setData(res.data );
        // console.log("After retrieving")
        
      })
      .catch((err) => console.log(err))
    await fetch()
    .then(response => response.json())
   .then((json)=>setList(json))
   .catch((error)=>console.log(error))
   .finally(()=> setLoading(false))
  };

  useEffect(() => {
    console.log("Hello")
    fetchData();
  }, []);


  return (
    <>
      {loading ? (<Text>Loadingg...</Text>) :(
       <SafeAreaView style={styles.container}>
    
    <View style={styles.userInfoSection}>
      <View style={{flexDirection: 'row', marginTop: 15}}>
        <Avatar.Image
          source={{
            uri: 'https://api.adorable.io/avatars/80/abott@adorable.png',
          }}
          size={80}
        />
        <View style={{ marginLeft: 20 }}>
          <Title style={[styles.title, {
            marginTop: 15,
            marginBottom: 5,
          }]}>{data.body.firstname} {data.body.lastname}</Title>
          <Caption style={styles.caption}>{data.body.username}</Caption>
        </View>
      </View>
    </View>

    <View style={styles.userInfoSection}>
      <View style={styles.row}>
        <Icon name="location-outline" color="purple" size={20}/>
        <Text style={{color:"#777777", marginLeft: 20}}>{data.body.address} India</Text>
      </View>
      <View style={styles.row}>
        <Icon name="call-outline" color="purple" size={20}/>
        <Text style={{color:"#777777", marginLeft: 20}}>{data.body.phone}</Text>
      </View>
      <View style={styles.row}>
        <Icon name="mail-outline" color="purple" size={20}/>
        <Text style={{color:"#777777", marginLeft: 20}}>{data.body.firstname}@gmail.com</Text>
      </View>
    </View>

    <View style={styles.infoBoxWrapper}>
        <View style={[styles.infoBox, {
          borderRightColor: '#dddddd',
        }]}>
          <Title>{data.body.customers.length}</Title>
          <Caption> Total Customers</Caption>
        </View>
        
    </View>


    <View style={styles.menuWrapper}>
      <TouchableRipple onPress={() => {
                      navigation.navigate("Mess Details", {
                        data: data,
                      });
                    }}>
        <View style={styles.menuItem}>
        <Icon name="create-outline" color="purple" size ={25}/>
          <Text style={styles.menuItemText}>Edit Profile</Text>
            
        </View>
      </TouchableRipple>
      
      <TouchableRipple onPress={() => {
                      navigation.navigate("Customers");
                    }}>
        <View style={styles.menuItem}>
          <Icon name="list-outline" color="purple" size={25}/>
          {/* <Icon baseClassName="fas" className="fa-plus-circle" /> */}
          
          <Text style={styles.menuItemText}>My Customers</Text>
        </View>
      </TouchableRipple>

        <TouchableRipple onPress={() => {
                      navigation.navigate("Requests");
                    }}>
        <View style={styles.menuItem}>
        <Icon name="add-circle-outline" color="purple" size ={25}/>
          <Text style={styles.menuItemText}>Requests</Text>
            
        </View>
      </TouchableRipple>
      
      
      
    </View>
    

    <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
     
      <Button title='Log-Out' onPress={async() => {
          try{
              await AsyncStorage.removeItem('logged-in-user');
              setGlobalState({...globalState, isLoggedIn:false, username:"", role:"", token:""});
          }
          catch(err){
              console.log(err);
          }
      }}  />
  </View>
  </SafeAreaView>
      ) }
    </>
  )
}

 

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});

