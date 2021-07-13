import React, { useEffect, useState } from 'react'
import { db, auth } from '../pages/LoginSignup/firebase'
import firebase from 'firebase'
//import { Input, Button } from '@material-ui/core'

function SendMessage(props) {
    const [msg, setMsg] = useState('')
    const collectionName = (props.user>props.contact) ? (props.contact+"****"+props.user) : (props.user+"****"+props.contact);
    useEffect(()=>{
         console.log(props.contact);
    },[props.contact])
    console.log(`${props.user}****${props.contact}`);
    async function sendMessage(e) {
        e.preventDefault()
        
        await db.collection('chats').doc(collectionName).collection('messages').add({
            text: msg,
            from: props.user,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setMsg('')
        props.scroll.current.scrollIntoView({ behavior: 'smooth' })
    }
    return (
        <div className="sendMsg">
            <form onSubmit={sendMessage}>
                <div >
                    <input  style={{borderRadius:7}}placeholder='Message...' type="text" value={msg} onChange={e => setMsg(e.target.value)} />
                    <button style={{borderRadius:7}} type="submit">Send</button>
                </div>
            </form>
        </div>
    )
}

export default SendMessage
