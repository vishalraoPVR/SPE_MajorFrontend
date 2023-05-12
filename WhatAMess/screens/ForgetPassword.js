import {View, Text, Pressable, Alert} from 'react-native'
import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { Form, FormItem } from "react-native-form-component";
import FAIcon from "react-native-vector-icons/FontAwesome";
import { baseUrl } from '../assets/URL';

function ForgetPassword({navigation}) {

    const [email, setEmail] = useState("");
    const emailInput = useRef();

    const sendForgetPasswordMail = async() => {
        Alert.alert(`${"Success"}`, `Please check your email for your new password`, [{ text: "OK" }]);
        axios.get(`${baseUrl}/forgot-password/${email}`)
        .then(res => {
            // console.log(res);
            navigation.navigate("Login");
        })
        .catch(err => console.log(err))
    }
  return (

        <View className="flex-1 p-5">
          {/* <View className="items-center"> */}
            <Text variant="titleMedium" className="mb-5">
              Please Enter your registered e-mail Address
            </Text>
            <Form
              buttonText="Send Email"
              onButtonPress={() => {
                sendForgetPasswordMail()
              }}
            >
              <FormItem
                label="e-mail"
                isRequired
                value={email}
                onChangeText={(i) => setEmail(i)}
                asterik
                underneathText="abc@gmail.com"
                ref={emailInput}
              />
            </Form>
            <Pressable onPress={() => navigation.navigate("Login")}>
              <Text>
                <FAIcon name="times-circle-o" />
                Cancel
              </Text>
            </Pressable>
          {/* </View> */}
        </View>
  )
}

export default ForgetPassword