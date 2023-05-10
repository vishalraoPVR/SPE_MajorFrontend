import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { View, Text, Button, TouchableOpacity, FlatList, StyleSheet, RefreshControl, ActivityIndicator, SafeAreaView } from 'react-native'
import { baseUrl } from '../../assets/URL';
import { GlobalContext } from '../../context/userContext'
import Icon from "react-native-vector-icons/MaterialIcons";
import { useIsFocused } from "@react-navigation/native";
import { FAB } from 'react-native-paper';

const Item = ({ customer_username, mess_owner_username }) => {
  const { globalState, setGlobalState } = useContext(GlobalContext);

  const acceptRequest = async () => {
    console.log("console logging globalstate from homescreen", globalState);
    await axios.post(`${baseUrl}/mess/accept-request/${mess_owner_username}/${customer_username}`, null, {
      headers: {
        Authorization: `Bearer ${globalState?.token}`,
      },
    })
      .then(res => console.log(res.data))
      .catch(err => console.log(err))
  }
  return (
    <View style={styles.item}>
      <Text variant="titleMedium" style={styles.text}>
        <Icon name="person" /> Customer Name - {customer_username}
        <TouchableOpacity
          style={{
            width: 100,
            height: 50,
            backgroundColor: 'blue',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            flexDirection: 'row',
            position: 'absolute',
            alignSelf: 'center',
            borderRadius: 10,
            marginTop: 5
          }}
          onPress={() => {
            acceptRequest();

          }}>

          <Text style={{ color: '#fff' }}>Approve</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
}

function CustomerRequest({ navigation }) {
  const { globalState, setGlobalState } = useContext(GlobalContext);
  const [requestData, setRequestData] = useState();
  const [refreshing, setRefreshing] = useState(true);


  const fetchData = async () => {
    await axios
      .get(`${baseUrl}/mess/requests/${globalState?.username}`, {
        //make sure that the token starts with Bearer
        headers: {
          Authorization: `Bearer ${globalState?.token}`,
        },
      })
      .then((res) => {
        console.log("Ressponse requests", res.data);
        setRefreshing(false);
        setRequestData(res.data);
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <Item customer_username={item.customer_username} mess_owner_username={item.mess_owner_username} />
  );
  return (
    <View className="h-full">
      <View className="items-end mb-2 mr-2">
        <FAB
          icon="refresh"
          label="Refresh"
          onPress={() => {
            setRefreshing(true);
            fetchData();
          }}
        />
      </View>
      <View>
        <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Customer Requests</Text>
        {refreshing ? <ActivityIndicator /> : null}
        <FlatList
          data={requestData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
          }
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 2,
  },
  item: {
    backgroundColor: '#f5f520',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,

  },
  text: {
    fontSize: 18
  },
});
export default CustomerRequest;