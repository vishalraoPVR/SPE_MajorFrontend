
// http://localhost:5000/mess/updateOwner-details/kay
// {

//   "address":"xyz",
//   "phone":"1234567895",
//   "type":"Veg",
//   "service":"tiffin",
//   "trial":true,
//   "breakfast":false,
//   "pricing":"2500",
//   "messname":"kanty-manty",
//   "latitude":"",
//   "longitude":""

// }

import React, {useContext, useState} from 'react'
import UpdateDetails from './Form/UpdateDetails';
function MessDetails({route}) {
  const [messData, setMessData] = useState(route.params?.data);

  return (
    <UpdateDetails data={messData}/>
  )
}

export default MessDetails;