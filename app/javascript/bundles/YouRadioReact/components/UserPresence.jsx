// import PropTypes from 'prop-types';
// import React, { useEffect, useState } from 'react';
// import ReactionChannel, { server_id } from '../../../channels/reactions_channel'

// let list = []

// const UserPresence = () => {
//     const [userList, setUserList] = useState(list)

//     useEffect(() => {
//         ReactionChannel.received = (data) => {
//             console.log(data.reactionType)
//             switch(data.reactionType) {
//                 case "active":
//                     console.log(data.reactionType)
//                     getUser()
//                     break;
//                 default:
//                     break;
//             }
//         }
//         getUser()
//     }, [])

//     const getUser = async () => {
//         const data = await fetch(`/servers/${server_id}/userlist/`)
//         const userlist = await data.json()
//         console.log(userlist)

//         setUserList(userlist)

//     }

//     if(userList.length != 0) console.log("userid: " + userList[0].user_id)
//     return (
//         userList.length != 0 ? (
//             userList.map(user => (
//                 <>
//                     <li key={user.user_id.toString}>User {user.user_id}</li>
//                 </>
//             ))
//             ) : <h1>moinii</h1>
//     )
// }

// export default UserPresence
