import React, { useState, useEffect } from "react";
import { ScrollView, View, Linking, Alert } from "react-native";
import { Text, SegmentedButtons, Card, Chip } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../assets/URL";

function MessPageScreen({ route }) {
  const [messData, setMessData] = useState(route.params?.data);
  const [screen, setScreen] = React.useState("about");
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = JSON.parse(await AsyncStorage.getItem("logged-in-user"));
        setUser(data);
        // console.log(user.token);
      } catch (err) {
        console.log("Async storage error", err);
      }
    })();
  }, []);

  const openDialer = async (number) => {
    if (Platform.OS === "android") Linking.openURL(`tel:${number}`);
  };

  const joinRequest = async () => {
    await axios
      .post(
        `${baseUrl}/customer/join/${user?.username}/${messData?.username}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        Alert.alert("Hey!", `${res.data}`, [{ text: "OK" }]);
      })
      .catch((err) => console.log(err));
  };

  const openMaps = async (mapsUrl) => {
    if (Platform.OS === "android") {
      Linking.openURL(mapsUrl);
    }
  };

  return (
    <ScrollView>
      <SegmentedButtons
        value={screen}
        onValueChange={setScreen}
        buttons={[
          {
            value: "about",
            label: "About",
          },
          {
            value: "menu",
            label: "Menu",
          },
          { value: "review", label: "Reviews" },
        ]}
      />

      {screen == "about" && (
        <>
          <Card className="">
            <Card.Content>
              <Text className="capitalize" variant="titleLarge">
                {messData?.messname}
              </Text>
              <Text variant="titleMedium" className="capitalize mt-2">
                <Icon name="person" /> {messData?.firstname}{" "}
                {messData?.lastname}
              </Text>
              <Text
                variant="titleMedium"
                onPress={() => {
                  openDialer(messData?.phone);
                }}
              >
                <Icon name="phone" /> {messData?.phone}
              </Text>
              <Text
                variant="titleMedium"
                onPress={() => {
                  openMaps(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      messData?.address
                    )}`
                  );
                }}
              >
                <Icon name="location-pin" /> {messData?.address}
              </Text>
              <View className="mt-5 pl-5">
                <Text variant="bodyLarge" className="capitalize">
                  <Icon name="fastfood" /> {messData?.type} food
                </Text>
                <Text variant="bodyLarge" className="capitalize">
                  <Icon name="free-breakfast" />{" "}
                  {messData?.breakfast
                    ? "Breakfast Included"
                    : "Breakfast Not included"}
                </Text>
                <Text variant="bodyLarge" className="capitalize">
                  <Icon name="weekend" /> Sundays - {messData?.aboutSundays}
                </Text>
                <Text variant="bodyLarge" className="capitalize">
                  <FAIcon
                    name={messData?.trial ? `check-circle-o` : `times-circle-o`}
                  />{" "}
                  {messData?.trial
                    ? "Free trial available"
                    : "Free trial not available"}
                </Text>
                <Text variant="bodyLarge">
                  <Icon name="play-arrow" /> {messData?.service} service
                </Text>
                <Text variant="bodyLarge">
                  <FAIcon name="rupee" /> {messData?.pricing}/month
                </Text>
              </View>
            </Card.Content>
            <Card.Actions className="mt-2">
              <Chip icon="send" onPress={joinRequest}>
                Request to join
              </Chip>
            </Card.Actions>
          </Card>
        </>
      )}

      {screen == "menu" && (
        <View className="h-screen">
          <View className="items-center p-5">
            <Text variant="titleMedium" className="uppercase">
              This Week's Menu
            </Text>
          </View>
          {messData.menus?.map((menuItem, i) => {
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
      )}

      {screen == "review" && (
        <View className="">
          {messData?.reviews.map((review) => {
            // console.log(review)
            return (
              <Card className="mt-1 mx-2" key={review.id}>
                <Card.Content>
                  <Text className="" variant="titleMedium">
                    {" "}
                    <FAIcon name="star" /> {review?.rating} rating
                  </Text>
                  <Text variant="bodyMedium" className="capitalize mt-2">
                    {review?.comment}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>
                    {" "}
                    - {review?.reviewBy}
                  </Text>
                </Card.Content>
              </Card>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
export default MessPageScreen;
