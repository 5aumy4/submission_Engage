import React, { useState, useEffect, useRef } from 'react'
import { db, auth } from '../pages/LoginSignup/firebase'
import SendMessage from './SendMessage'


function Chat(props) {
    const scroll = useRef()
    const collectionName = (props.user>props.contact) ? (props.contact+"****"+props.user) : (props.user+"****"+props.contact);
    const [messages, setMessages] = useState([])
    useEffect(() => {
        console.log("collection:"+collectionName);
        db.collection('chats').doc(collectionName).collection('messages').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => doc.data()));
            console.log('hello')
            snapshot.docs.map(doc=>console.log(doc.data()));
        })
    }, [props.contact])
    
    return (
        <div >
            
            <div className="msgs">
                
                {messages.map(({text,from}) => (
                    <div>
                        <div className={`msg ${from===props.user ? 'sent' : 'received'}`}>
                        {console.log(from)}
                            <p>{text}</p>
                        </div>
                    </div>
                ))}
            </div>
            <SendMessage scroll={scroll}
                user = {props.user}
                contact = {props.contact} />
            <div ref={scroll}></div>
        </div>
    )
}

export default Chat
