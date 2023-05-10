import axios from 'axios';
import React, {useContext, useEffect, useState} from 'react'
import { View, Text, ActivityIndicator } from 'react-native';
import { baseUrl } from '../../assets/URL';
import { GlobalContext } from '../../context/userContext';
import UpdateDetails from './Form/UpdateDetails';
function MessDetails({route}) {
  const {globalState, setGlobalState} = useContext(GlobalContext)
  const [messData, setMessData] = useState(route.params?.data);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async() => {
    await axios
      .get(`${baseUrl}/mess/owner-details/${globalState?.username}`, {
        //make sure that the token starts with Bearer
        headers: {
          Authorization: `Bearer ${globalState?.token}`,
        },
      })
      .then((res) => {
        console.log("Res",res.data);
        setData(res.data );
        setLoading(false);
        // console.log("After retrieving")
        
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    fetchData();
  },[])

  return (
    <>
    {
      (loading) ? <ActivityIndicator /> : <UpdateDetails data={data} />
    }
    </>
  )
}

export default MessDetails;