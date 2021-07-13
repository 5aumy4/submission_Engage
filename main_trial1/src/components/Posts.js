import { Button } from 'bootstrap'
import React, { useState, useEffect, useRef } from 'react'
import { Card, FormGroup } from 'react-bootstrap'
import { db, auth } from '../pages/LoginSignup/firebase'
import SendMessage from './SendMessage'


function Posts(props) {
    const scroll = useRef()
    //const collectionName = (props.user>props.contact) ? (props.contact+"****"+props.user) : (props.user+"****"+props.contact);
    const [posts, setPosts] = useState([])
    const commentRef = useRef("");
    useEffect(() => {
        console.log(props.team);
        db.collection('teams').doc(props.team).collection('posts').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => doc.data()));
            console.log('hello')
            snapshot.docs.map(doc=>console.log(doc.data()));
        })
    }, [])
    
    return (
        <div >
            
            <div className="msgs">
                <ul>
                {messages.map(({by,header,content,likes,comments}) => (
                    <li>
                        <Card>
                            <h4>{header}</h4>
                            <Card.Body><p>{content}</p></Card.Body>
                            <p>{likes}</p>
                            <Button>Like</Button>
                            <ul>
                            {comments.map(({by,content})=>(
                                <li>
                                    <h6>{by}</h6>
                                    <p>{content}</p>
                                </li>
                            ))}</ul>
                        </Card>
                    <Form>
                        <Form.Group>
                            <Form.Label>Write Comment:</Form.Label>
                            <Form.Control type="text" ref={commentRef} />
                        </Form.Group>
                    </Form>
                    </li>
                ))}
                </ul>
            </div>
            <SendMessage scroll={scroll}
                user = {props.user}
                contact = {props.contact} />
            <div ref={scroll}></div>
        </div>
    )
}

export default Chat
