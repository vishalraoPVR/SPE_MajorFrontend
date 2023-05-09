import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import React, { useState, useRef, useEffect } from "react";

import { Form, FormItem, Picker } from "react-native-form-component";
import { baseUrl } from "../assets/URL";

import axios from "axios";
import * as Location from "expo-location";

function RegistrationScreen({ navigation }) {
  //for storing credentials
  const [credentials, setcredentials] = useState({
    username: "",
    password: "",
  });
  const credentialInput = useRef();

  //for managing pages in registration
  const [nextScreen, setNextScreen] = useState(1);

  //for storing location coordinates and error
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  //storing customer details
  const [customerDetails, setCustomerDetails] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const customerInput = useRef();

  //this is used to store the value returned by expo-location api
  let addressResponse;

  //storing mess details
  const [messDetails, setMessDetails] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    messname: "",
    address: addressResponse,
    latitude: "",
    longitude: "",
    service: "Both",
    type: "pure-veg",
    trial: true,
    breakfast: true,
    aboutSundays: "closed",
    pricing: "",
  });
  const messInput = useRef();

  //this state is used to render customer or mess owner form conditionally
  const [number, setNumber] = useState(1);

  //function to get current location
  const getMyAddress = async () => {
    const res = await Location.reverseGeocodeAsync({
      longitude: location.coords.longitude,
      latitude: location.coords.latitude,
    });
    //rewriting the address returned by the api
    const addressResponse = `${res[0]?.name} ${res[0]?.streetNumber} ${res[0]?.street} ${res[0]?.district}, ${res[0]?.city}, ${res[0]?.region} - ${res[0]?.postalCode}`;
    console.log("Address", addressResponse);
    //pre-filling the adress field
    setMessDetails({ address: addressResponse });
  };

  useEffect(() => {
    //example of creating a function and calling it
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.getCurrentPositionAsync({})
        .then((loc) => {
          setLocation(loc);
        })
        .catch((err) => console.log(err));
    })();
  }, []);

  //   let text = 'Waiting..';
  //   if (errorMsg) {
  //     text = errorMsg;
  //   } else if (location) {
  //     text = JSON.stringify(location);
  //     getMyAddress();
  //   }

  let url, data;
  number === 1
    ? ((url = `${baseUrl}/register-new-customer`),
      (data = {
        ...credentials,
        ...customerDetails,
      }))
    : ((url = `${baseUrl}/register-new-mess`),
      (data = {
        ...credentials,
        ...messDetails,
      }));

  return (
    <View style={{ flex: 1, justifyContent: "center" }} className="p-5">
      {/* Form first page here */}
      {nextScreen === 1 && (
        <Form
          buttonText="Next"
          onButtonPress={async () => {
            //api call here -> this api fetches address from coordinates
            getMyAddress();
            setNextScreen(2);
          }}
        >
          <FormItem
            label="User Name"
            isRequired
            value={credentials.username}
            onChangeText={(i) =>
              setcredentials({ ...credentials, username: i })
            }
            asterik
            ref={credentialInput}
            underneathText="Username should be unique"
          />
          <FormItem
            label="Password"
            isRequired
            value={credentials.password}
            onChangeText={(i) =>
              setcredentials({ ...credentials, password: i })
            }
            asterik
            ref={credentialInput}
          />
        </Form>
      )}

      {/* Form second page here */}
      {nextScreen === 2 && (
        <Form
          onButtonPress={async () => {
            let url, data;
            if (number === 1) {
              url = `${baseUrl}/register-new-customer`;
              data = {
                ...credentials,
                ...customerDetails,
              };
            } else {
              url = `${baseUrl}/register-new-mess`;
              data = {
                ...credentials,
                ...messDetails,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              };
            }

            //registration api call

            await axios
              .post(url, data)
              .then(
                //giving alert on status 2xx
                (res) => {
                  console.log(res.data);
                  if (res.data === "Username already taken!")
                    Alert.alert("Oh no!", `${res.data}`, [
                      { text: "OK", onPress: () => setNumber(1) },
                    ]);
                  else
                    Alert.alert("Success", `${res.data}`, [
                      {
                        text: "Continue to Login",
                        onPress: () => {
                          navigation.navigate("Login");
                        },
                      },
                    ]);
                }
              )
              .catch((err) => {
                console.log(err);
                Alert.alert("Oops!", `${err}`, [{ text: "OK" }]);
              });
            // console.log("My form data", data);
          }}
        >
          {/* 1 for customer registration
                        2 for the mess owner registration
                    */}
          <ScrollView contentContainerStyle={{ padding: 5 }}>
            <Picker
              items={[
                { label: "I want to find mess", value: 1 },
                { label: "I want to register my mess", value: 2 },
              ]}
              label="What are you looking for?"
              selectedValue={number}
              onSelection={(item) => setNumber(item.value)}
            />
            {number === 2 ? (
              <>
                <FormItem
                  label="firstname"
                  isRequired
                  value={messDetails.firstname}
                  onChangeText={(i) =>
                    setMessDetails({ ...messDetails, firstname: i })
                  }
                  asterik
                  ref={messInput}
                />
                <FormItem
                  label="lastname"
                  isRequired
                  value={messDetails.lastname}
                  onChangeText={(i) =>
                    setMessDetails({ ...messDetails, lastname: i })
                  }
                  asterik
                  ref={messInput}
                />
                <FormItem
                  label="Contact"
                  isRequired
                  value={messDetails.phone}
                  onChangeText={(i) =>
                    setMessDetails({ ...messDetails, phone: i })
                  }
                  asterik
                  ref={messInput}
                />
                <FormItem
                  label="Mess Name"
                  isRequired
                  value={messDetails.messname}
                  onChangeText={(i) =>
                    setMessDetails({ ...messDetails, messname: i })
                  }
                  asterik
                  ref={messInput}
                />
                <FormItem
                  label="Price (/month)"
                  isRequired
                  value={messDetails.pricing}
                  onChangeText={(i) =>
                    setMessDetails({ ...messDetails, pricing: i })
                  }
                  asterik
                  ref={messInput}
                />
                <FormItem
                  label="Mess Address"
                  isRequired
                  textArea
                  value={messDetails.address}
                  onChangeText={(i) =>
                    setMessDetails({ ...messDetails, address: i })
                  }
                  asterik
                  ref={messInput}
                />
                <Picker
                  items={[
                    { label: "Dine-in", value: "Dine-in" },
                    { label: "Tiffin", value: "Tiffin" },
                    { label: "Both", value: "Both Dine-in and Tiffin" },
                  ]}
                  label="Service Type"
                  selectedValue={messDetails.service}
                  onSelection={(i) =>
                    setMessDetails({ ...messDetails, service: i.value })
                  }
                  isRequired
                  asterik
                />
                <Picker
                  items={[
                    { label: "Pure-veg", value: "pure-veg" },
                    { label: "Non-veg", value: "non-veg" },
                    { label: "Jain", value: "jain" },
                  ]}
                  label="Food Type"
                  selectedValue={messDetails.type}
                  onSelection={(i) =>
                    setMessDetails({ ...messDetails, type: i.value })
                  }
                  isRequired
                  asterik
                />
                <Picker
                  items={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  label="Breakfast included?"
                  selectedValue={messDetails.breakfast}
                  onSelection={(item) =>
                    setMessDetails({ ...messDetails, breakfast: item.value })
                  }
                  isRequired
                  asterik
                />
                <Picker
                  items={[
                    { label: "Sundays closed", value: "closed" },
                    { label: "Sundays open", value: "open" },
                    { label: "Only first half", value: "first-half" },
                  ]}
                  label="What about sundays?"
                  selectedValue={messDetails.aboutSundays}
                  onSelection={(item) =>
                    setMessDetails({ ...messDetails, aboutSundays: item.value })
                  }
                  isRequired
                  asterik
                />
                <Picker
                  items={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  label="Trial available?"
                  selectedValue={messDetails.trial}
                  onSelection={(item) =>
                    setMessDetails({ ...messDetails, trial: item.value })
                  }
                  isRequired
                  asterik
                />
              </>
            ) : (
              <>
                <FormItem
                  label="firstname"
                  isRequired
                  value={customerDetails.firstname}
                  onChangeText={(firstname) =>
                    setCustomerDetails({
                      ...customerDetails,
                      firstname: firstname,
                    })
                  }
                  asterik
                  ref={customerInput}
                />
                <FormItem
                  label="lastname"
                  isRequired
                  value={customerDetails.lastname}
                  onChangeText={(lastname) =>
                    setCustomerDetails({
                      ...customerDetails,
                      lastname: lastname,
                    })
                  }
                  asterik
                  ref={customerInput}
                />
                <FormItem
                  label="email"
                  isRequired
                  value={customerDetails.email}
                  onChangeText={(email) =>
                    setCustomerDetails({ ...customerDetails, email: email })
                  }
                  asterik
                  ref={customerInput}
                />
                <FormItem
                  label="Contact"
                  isRequired
                  value={customerDetails.phone}
                  onChangeText={(contact) =>
                    setCustomerDetails({ ...customerDetails, phone: contact })
                  }
                  asterik
                  ref={customerInput}
                />
              </>
            )}
          </ScrollView>
        </Form>
      )}

      <Pressable
        onPress={() => {
          navigation.navigate("Login");
          // setNextScreen(0);
        }}
        style={{ alignItems: "center" }}
      >
        <Text>Login?</Text>
      </Pressable>
    </View>
  );
}

export default RegistrationScreen;
