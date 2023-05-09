import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { View, Button, StyleSheet, FlatList } from 'react-native'
import { baseUrl } from '../../assets/URL';
import { GlobalContext } from '../../context/userContext'
import {Card,Text} from "react-native-paper";
function HomeScreen() {
    const {globalState, setGlobalState} = useContext(GlobalContext);

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
        console.log("After retrieving")
        
      })
      .catch((err) => console.log(err))
      .finally(()=> setLoading(false))
   
  };
  

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
         onPress = {fetchData}
         title = "Show menu"
         color = "purple"
      />

{loading ? (<Text>Loadingg...</Text>) :(
  
     <View className="h-screen">
     <View className="items-center p-5">
       <Text variant="titleMedium" className="uppercase" style={{marginTop:30}}>
         This Week's Menu
       </Text>
     </View>
     {data.body.menus?.map((menuItem, i) => {
       return (
         <Card className="mt-1 mx-2" key={i}>
           <Card.Content>
             <Text className="capitalize" variant="titleMedium">
               {menuItem?.day}
             </Text>
             <Text variant="bodyMedium" className="capitalize mt-2">
               Breakfast: {menuItem?.breakfast}
             </Text>
             <Text variant="bodyMedium" className="capitalize mt-2">
               Lunch: {menuItem?.lunch}
             </Text>
             <Text variant="bodyMedium" className="capitalize mt-2">
               Dinner: {menuItem?.dinner}
             </Text>
           </Card.Content>
         </Card>
       );
     })}
   </View>
      ) }
        </View>
    )
}
{/* <View className="h-screen">
          <View className="items-center p-5">
            <Text variant="titleMedium" className="uppercase">
              This Week's Menu
            </Text>
          </View>
          {data.body.menus?.map((menuItem, i) => {
            return (
              <Card className="mt-1 mx-2" key={i}>
                <Card.Content>
                  <Text className="capitalize" variant="titleMedium">
                    {menuItem?.day}
                  </Text>
                  <Text variant="bodyMedium" className="capitalize mt-2">
                    Breakfast: {menuItem?.breakfast}
                  </Text>
                  <Text variant="bodyMedium" className="capitalize mt-2">
                    Lunch: {menuItem?.lunch}
                  </Text>
                  <Text variant="bodyMedium" className="capitalize mt-2">
                    Dinner: {menuItem?.dinner}
                  </Text>
                </Card.Content>
              </Card>
            );
          })}
        </View> */}
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

export default HomeScreen