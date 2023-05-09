import React, {useContext, useEffect, useState} from 'react'
import { GlobalContext } from "../../context/userContext";
import axios from 'axios';
import { baseUrl } from '../../assets/URL';
import { FlashAuto } from '@mui/icons-material';
import { View,Text, StyleSheet,FlatList } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";

const Item = ({firstname,lastname,phone,email}) => {
  
  return( 
    <View style={styles.item}>
      {/* <Text variant="medium"><Icon name="email" /> name: {firstname} {lastname}</Text>
      <Text>e-mail: {email}</Text>
      <Text>Phone: {phone}</Text> */}
      <Text variant="titleMedium" style={styles.text}>
              <Icon name="person" /> Full Name - {firstname}{" "}{lastname}
      </Text>

      <Text variant="titleMedium" style={styles.text}>
              <Icon name="email" /> e-mail - {email}
      </Text>

      <Text variant="titleMedium" style={styles.text}>
              <Icon name="phone" /> Phone - {phone}
      </Text>
    </View>
  );
}



function CustomerList() {
  const { globalState, setGlobalState } = useContext(GlobalContext);
  const [List,setList] = useState([]);
  const [user,setUser] =useState(null);
  const [loading,setLoading] =useState(true);
  

  
  
  
  const getList = async () => {
    console.log("Hello in axios")
    await axios
      .get(`${baseUrl}/mess/owner-details/${globalState?.username}`, {
        //make sure that the token starts with Bearer
        headers: {
          Authorization: `Bearer ${globalState?.token}`,
        },
      })
      .then((res) => {
        console.log("Res",res.data);
        setList(res.data );
        console.log("After retrieving")
        
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
    getList();
  }, []);

  
  // console.log("List",List.body.customers[0].username);
  const renderItem = ({item})=>( 
    <Item firstname={item.firstname} lastname={item.lastname} phone={item.phone} email={item.email}/>
  );
  return (
    <View>
      {loading ? (<Text>Loadingg...</Text>) :(
      <View style={styles.container}>
        <Text style={{textAlign:'center',fontSize:20,fontWeight:'bold'}}>Customer List</Text>
      <FlatList
       data={List.body.customers}
       renderItem={renderItem}
       keyExtractor={item => item.id}
    />
    
    </View>
      ) }
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop:30,
    padding:2,
  },
  item: {
    backgroundColor: '#f5f520',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    
  },
  text: {
    fontSize:18
  },
});
export default CustomerList;