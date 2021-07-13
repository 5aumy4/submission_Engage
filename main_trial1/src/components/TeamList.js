import { Link } from "react-router-dom";
import { useParams } from "react-router";

import Navigation from "./Header/Navigation";
import {useEffect, useRef, useState} from "react";
import { Form, Button, Card, Alert } from "react-bootstrap"
import firebase from "firebase";
import { useAuth } from "../pages/LoginSignup/contexts/AuthContext"
import {db} from "../pages/LoginSignup/firebase"
import '../App.css';
//import './TeamList.css';
const TeamList = (props) => {
    console.log(props);
    const params = useParams();
    const newContactRef = useRef();
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [teamObj,setTeamObj] = useState({});
    const contactObj = [];
    const { currentUser } = useAuth();
    useEffect(()=>{
        props.object.teams.forEach(team=>{
            if(team.teamID==params.teamID) setTeamObj(team);
            team.contacts.forEach(contact=>{
                contactObj.push({
                    contact : contact.contactName,
                    chats : []
                })
            })
            contactObj.push({
                contact : currentUser.email,
                chats : []
            })
        })
    },[])
    async function handleSubmit(e) {
        e.preventDefault()
    
        try {
          setError("")
          setLoading(true)
          db.collection('users').where('email','==',newContactRef.current.value).get().then(obj=>{
            if(!obj.docs.length)return new Error;
            obj.docs.forEach(doc=>{
                  doc.ref.update({
                      teams : firebase.firestore.FieldValue.arrayUnion({
                          teamID : params.teamID,
                          contacts : contactObj
                      })
                  })
              })
          })
          db.collection('users').where('email','==',currentUser.email).get().then(obj=>{
            obj.docs.forEach(doc=>{
                doc.ref.teams.update({
                    contacts : firebase.firestore.FieldValue.arrayUnion({
                        contactName : newContactRef.current.value,
                        chats : []
                    })
                });
            });
            console.log(obj.docs[0].data());
            //setObject(obj.docs[0].data());
        });
          
        } catch {
          setError("Failed to add, please recheck the email")
        }
    
        setLoading(false)
      }

    return(<div>
       <Form onSubmit={handleSubmit}>
            <h1>{error}</h1>
            <Form.Group id="newContact">
              <Form.Label>Add a participant by ID :</Form.Label>
              <Form.Control type="email" ref={newContactRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Add
            </Button>
        </Form>
    </div>)
};

export default TeamList;