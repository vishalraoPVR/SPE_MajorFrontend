import { Update } from '@mui/icons-material';
import { height } from '@mui/system';
import React, { useContext, useState, useRef } from 'react'
import { Alert, Button, StyleSheet } from 'react-native';
import { Text, TextInput, View, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from "react-native-vector-icons/Ionicons";
import { Form, FormItem, Picker } from "react-native-form-component";
import DropDownPicker from 'react-native-dropdown-picker';
import { baseUrl } from "../../../assets/URL";
import axios from 'axios';
import { GlobalContext } from "../../../context/userContext";


function UpdateDetails({ data}) {
    const [number, setNumber] = useState(1);
    //   console.log("from update details screen", data.body);
    const [messDetails, setMessDetails] = useState({
        address: data.body.address,
        phone: data.body.phone,
        type: data.body.type,
        service: data.body.service,
        trial: data.body.trial,
        breakfast: data.body.breakfast,
        pricing: data.body.pricing,
        messname: data.body.messname,
        latitude: data.body.latitude,
        longitude: data.body.longitude,
    });
    const messInput = useRef();
    const { globalState, setGlobalState } = useContext(GlobalContext);

    const DetailsUpdate = async () => {
        await axios
            .post(`${baseUrl}/mess/updateOwner-details/${globalState.username}`, messDetails, {
                //make sure that the token starts with Bearer
                headers: {
                    Authorization: `Bearer ${globalState?.token}`,
                },
            })
            .then((res) => {
                Alert.alert(
                    "Successful",
                    "Updated Mess Details !!",
                    [
                      // {
                      //   text: 'Cancel',
                      //   style: 'cancel',
                      // },
                      {
                        text: "OK",
                        onPress: () => {
                           
                        },
                      },
                    ]
                  );
            })
            .catch((err) => console.log(err));
    }
    return (
        <Form
            onButtonPress={DetailsUpdate}
        >

            <ScrollView>
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
                {/* <Picker
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
                /> */}
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
                    label="Mess Name"
                    isRequired
                    value={messDetails.messname}
                    onChangeText={(i) =>
                        setMessDetails({ ...messDetails, messname: i })
                    }
                    asterik
                    ref={messInput}
                />


            </ScrollView>

        </Form>

    )
}

export default UpdateDetails;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    input: {
        width: '90%',
        height: 50,
        borderWidth: 0.5,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
        paddingLeft: 15,

    },
    text: {
        fontSize: 20,
        marginLeft: 20,
        marginTop: 10
    },
    add: {


    },
})


