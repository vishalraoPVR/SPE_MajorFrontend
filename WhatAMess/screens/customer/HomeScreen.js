import React, { useEffect, useState, useContext } from "react";
import { View, ScrollView, Linking } from "react-native";

import { Button, FAB, Searchbar, Text, Card, Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

//for distance calculation
import { getPreciseDistance, getDistance } from "geolib";
import * as Location from "expo-location";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../assets/URL";
import { GlobalContext } from "../../context/userContext";

function HomeScreen({ navigation }) {
  const { globalState, setGlobalState } = useContext(GlobalContext);

  const [searchQuery, setSearchQuery] = useState("");
  const onChangeSearch = (query) => setSearchQuery(query);

  const [user, setUser] = useState({});
  const [messList, setMessList] = useState([]);
  const [currLoc, setCurrLoc] = useState({
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    // (async() => {

    //   try{
    //     const data = JSON.parse(await AsyncStorage.getItem('logged-in-user'));
    //     setUser(data);
    //     // console.log(user.token);
    //   }
    //   catch(err){console.log("Async storage error", err)}

    // })();

    //ask for location permisiion if not given
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.getCurrentPositionAsync({})
        .then((loc) => {
          setCurrLoc(loc);
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  //list of all mess
  const getMessList = async () => {
    await axios
      .get(`${baseUrl}/customer/get-all-mess`, {
        //make sure that the token starts with Bearer
        headers: {
          Authorization: `Bearer ${globalState?.token}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        setMessList(res.data);
      })
      .catch((err) => console.log(err));
  };

  //this new messList object stores distances as well as mess details
  const newMessList = messList?.map((mess) =>
    //this is appending  new variable to the messList object, i.e. distance
    ({
      ...mess,
      distance:
        getDistance(
          {
            latitude: currLoc?.coords.latitude,
            longitude: currLoc?.coords.longitude,
          },
          { latitude: mess?.latitude, longitude: mess?.longitude }
        ) * 0.0001,
    })
  );

  const openMaps = async (mapsUrl) => {
    if (Platform.OS === "android") {
      Linking.openURL(mapsUrl);
    }
  };

  const openDialer = async (number) => {
    if (Platform.OS === "android") Linking.openURL(`tel:${number}`);
  };

  return (
    <View className="h-full">
      <Searchbar
        placeholder="Name / veg or non-veg"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      <ScrollView>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {newMessList
            ?.filter((mess) => {
              if (searchQuery === "") {
                return mess;
              } else if (
                mess?.messname.toLowerCase().includes(searchQuery.toLowerCase())
              ) {
                return mess;
              } else if (
                mess?.type.toLowerCase().includes(searchQuery.toLowerCase())
              ) {
                return mess;
              }
            })
            .map((messDetails, index) => {
              const addr = messDetails.address;
              const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                addr
              )}`;

              return (
                <View key={index} style={{ width: "50%", padding: 5 }}>
                  <Card>
                    <Card.Content>
                      <Text className="capitalize" variant="titleMedium">
                        {messDetails?.messname}
                      </Text>
                      <Text variant="bodyMedium">
                        <Icon name="fastfood" /> {messDetails?.type}
                      </Text>
                      <Text variant="bodyMedium">
                        <Icon name="attach-money" /> {messDetails?.pricing}
                        /month
                      </Text>
                      <Text
                        variant="bodyMedium"
                        onPress={() => {
                          openDialer(messDetails?.phone);
                        }}
                      >
                        <Icon name="phone" /> {messDetails?.phone}
                      </Text>
                    </Card.Content>
                    <Card.Actions className="mt-2">
                      <Chip icon="map-marker" onPress={() => openMaps(mapsUrl)}>
                        {messDetails.distance < 1
                          ? `less than a km away`
                          : `${messDetails.distance} km away`}
                      </Chip>
                    </Card.Actions>
                    <Button
                      onPress={() => {
                        navigation.navigate("MessPageScreen", {
                          data: messDetails,
                        });
                      }}
                    >
                      More
                    </Button>
                  </Card>
                </View>
              );
            })}
        </View>
      </ScrollView>
      <View className="items-end mb-2 mr-2">
        <FAB
          icon="map-search-outline"
          label="Get mess"
          onPress={() => getMessList()}
        />
      </View>
    </View>
  );
}

export default HomeScreen;
