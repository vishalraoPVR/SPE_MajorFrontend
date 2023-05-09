import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Modal,
  Alert,
  Pressable,
  Linking,
} from "react-native";
import { FAB, Card, SegmentedButtons, Text, Avatar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Icon from "react-native-vector-icons/MaterialIcons";
import { GlobalContext } from "../../context/userContext";
import axios from "axios";
import { baseUrl } from "../../assets/URL";
import { Form, FormItem, Picker } from "react-native-form-component";

function ProfileScreen() {
  const { globalState, setGlobalState } = useContext(GlobalContext);
  const [screen, setScreen] = useState("profile");
  const [loggedinUser, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState({
    rating: 1,
    comment: "",
  });
  const reviewInput = useRef();

  const openDialer = async (number) => {
    if (Platform.OS === "android") Linking.openURL(`tel:${number}`);
  };

  const openMaps = async (mapsUrl) => {
    if (Platform.OS === "android") {
      Linking.openURL(mapsUrl);
    }
  };

  useEffect(() => {
    (async () => {
      // api call to fetch user profile
      await axios
        .get(`${baseUrl}/customer/get-profile/${globalState?.username}`, {
          headers: {
            Authorization: `Bearer ${globalState?.token}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setUserDetails(res.data);
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  //function to write and send review
  const writeReview = async () => {
    axios
      .post(
        `${baseUrl}/customer/add-review`,
        {
          ...review,
          customer_username: globalState?.username,
          mess_owner_username: userDetails?.ownerUsername,
        },
        {
          headers: {
            Authorization: `Bearer ${globalState?.token}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        //show alert on success
        Alert.alert("Success!", `${res.data}`, [{ text: "OK" }]);
      })
      .catch((err) => console.log(err));

    setModalVisible(!modalVisible);
  };

  return (
    <View className="h-full">
      <SegmentedButtons
        value={screen}
        onValueChange={setScreen}
        buttons={[
          {
            value: "profile",
            label: "Profile",
          },
          {
            value: "mess",
            label: "My Mess",
          },
        ]}
      />

      {screen === "profile" && (
        <>
          <View className="flex-1 justify-center ml-10">
            {/* initial two characters are avatar text */}
            <View className="flex-row items-center my-5">
              <Avatar.Text label={globalState?.username.substring(0, 2)} />
              <Text variant="titleLarge" className="ml-5">
                {userDetails?.username}
              </Text>
            </View>
            <Text variant="titleMedium">
              <Icon name="person" /> Full Name - {userDetails?.firstname}{" "}
              {userDetails?.lastname}
            </Text>
            <Text variant="titleMedium">
              <Icon name="email" /> Email - {userDetails?.email}
            </Text>
            <Text variant="titleMedium">
              <Icon name="phone" /> Contact - {userDetails?.phone}
            </Text>
          </View>
          <View className="items-end mb-2 mr-2">
            <FAB
              icon="logout"
              label="LogOut"
              onPress={async () => {
                try {
                  await AsyncStorage.removeItem("logged-in-user");
                  setGlobalState({...globalState, isLoggedIn:false, username:"", role:"", token:""});
                } catch (err) {
                  console.log(err);
                }
              }}
            />
          </View>
        </>
      )}
      {screen === "mess" && (
        <>
          {/* Modal */}
          <Modal
            animationType="fade"
            transparent={false}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View className="flex-1 justify-center items-center">
              <View className="items-center">
                <Text variant="titleMedium" className="mb-5">
                  Write a review for {userDetails?.messname}
                </Text>
                <Form
                  buttonText="Add"
                  onButtonPress={() => {
                    writeReview();
                  }}
                >
                  <Picker
                    items={[
                      { label: "Bad", value: 1 },
                      { label: "Okay-ish...", value: 2 },
                      { label: "Good", value: 3 },
                      { label: "Recommended", value: 4 },
                      { label: "Happy Customer", value: 5 },
                    ]}
                    label="What are your views about the mess?"
                    selectedValue={review.rating}
                    onSelection={(item) =>
                      setReview({ ...review, rating: item.value })
                    }
                    asterik
                  />
                  <FormItem
                    label="Comment"
                    isRequired
                    value={review.comment}
                    onChangeText={(i) => setReview({ ...review, comment: i })}
                    asterik
                    textArea
                    ref={reviewInput}
                  />
                </Form>
                <Pressable onPress={() => setModalVisible(!modalVisible)}>
                  <Text>
                    <FAIcon name="times-circle-o" />
                    Cancel
                  </Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          <View className="justify-center items-center">
            <Card>
              <Card.Content>
                <Text className="capitalize" variant="titleLarge">
                  {userDetails?.messname}
                </Text>
                <Text variant="titleMedium" className="capitalize mt-2">
                  <Icon name="person" /> {userDetails?.ownerFirstname}{" "}
                  {userDetails?.ownerLastname}
                </Text>
                <Text
                  variant="titleMedium"
                  onPress={() => {
                    openDialer(userDetails?.ownerPhone);
                  }}
                >
                  <Icon name="phone" /> {userDetails?.ownerPhone}
                </Text>
                <Text
                  variant="titleMedium"
                  onPress={() => {
                    openMaps(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        userDetails?.address
                      )}`
                    );
                  }}
                >
                  <Icon name="location-pin" /> {userDetails?.address}
                </Text>
              </Card.Content>
            </Card>
            <Text className="m-5 capitalize" variant="titleLarge">
              Menu
            </Text>
          </View>

          <ScrollView>
            {userDetails.menus?.map((menuItem, i) => {
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
          </ScrollView>
          <View className="items-end mb-2 mr-2">
            <FAB
              icon="pencil"
              label="Write Review"
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            />
          </View>
        </>
      )}
    </View>
  );
}

export default ProfileScreen;
