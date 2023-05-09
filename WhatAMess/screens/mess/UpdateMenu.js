import { View, Text, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import React, { useContext, useState } from 'react';
import Card from './Form/Card';
import Icon from "react-native-vector-icons/Ionicons";
import { GlobalContext } from "../../context/userContext";
import axios from 'axios';
import { baseUrl } from '../../assets/URL';

function UpdateMenu() {
  const [data, setData] = useState([{ day: '', breakfast: '', lunch: '', dinner: '' }]);
  const { globalState, setGlobalState } = useContext(GlobalContext);
  const [visible, setVisible] = useState(false);
  
  const renderDropdown = () => {
    if (visible) {
      return (
          <Text style={styles.dropdown}>
            This is where the dropdown will be rendered.
          </Text>
      );
    }
  };
  const changeDay = (ind, txt) => {
    let temp = data;
    temp.map((item, index) => {
      if (index == ind) {
        item.day = txt;
      }
    });
    console.log(temp);
    setData(temp);
  };

  const changeBreakfast = (ind, txt) => {
    let temp = data;
    temp.map((item, index) => {
      if (index == ind) {
        item.breakfast = txt;
      }
    });
    console.log(temp);
    setData(temp);
  };

  const changeLunch = (ind, txt) => {
    let temp = data;
    temp.map((item, index) => {
      if (index == ind) {
        item.lunch = txt;
      }
    });
    console.log(temp);
    setData(temp);
  };


  const changeDinner = (ind, txt) => {
    let temp = data;
    temp.map((item, index) => {
      if (index == ind) {
        item.dinner = txt;
      }
    });
    console.log(temp);
    setData(temp);
  };

  const MenuUpdate = async () =>{
    await axios
      .post(`${baseUrl}/mess/add-menu/${globalState?.username}`,data,{
        //make sure that the token starts with Bearer
        headers: {
          Authorization: `Bearer ${globalState?.token}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        
      })
      .catch((err) => console.log(err));
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            return (
              <Card
                index={index}
                onChangeDay={txt => {
                  changeDay(index, txt);
                }}
                onChangeBreakfast={txt => {
                  changeBreakfast(index, txt);
                }}
                onChangeLunch={txt => {
                  changeLunch(index, txt);
                }}
                onChangeDinner={txt => {
                  changeDinner(index, txt);
                }}
                onClickRemove={() => {
                  if (data.length > 1) {
                    let temp = data;
                    temp.splice(index, 1);
                    let xyz = [];
                    temp.map(item => {
                      xyz.push(item);
                    });
                    setData(xyz);
                  }
                }}
              />
            );
          }}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          let tempData = data;
          tempData.push({ day: '', breakfast: '', lunch: '', dinner: '' });
          let temp = [];
          tempData.map(item => {
            temp.push(item);
          });
          setData(temp);
        }}>

        <Icon name="add-circle-outline" size={50} style={{ alignSelf: 'flex-end' }} />

          <TouchableOpacity
        style={{
          width:100,
          height: 50,
          backgroundColor: 'purple',
          justifyContent: 'center',
          alignItems: 'center',
          flex:1,
          flexDirection:'row',
          position: 'absolute',
          alignSelf:'center',
          borderRadius: 10,
          marginTop:5
        }}
        onPress={() => {
          MenuUpdate();
        }}>
        
        <Text style={{color: '#fff'}}>Submit</Text>
      </TouchableOpacity>
      </TouchableOpacity>
      
    </ScrollView>

  )
}

export default UpdateMenu;