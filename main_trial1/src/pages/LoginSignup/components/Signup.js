import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert,Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import { db } from '../firebase'
import 'bootstrap/dist/css/bootstrap.css';
import { Router, Redirect } from "react-router"

export default function Signup() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const unameRef = useRef()
  const passwordConfirmRef = useRef()
  const { currentUser,signup } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match")
    }

    try {
      setError("")
      setLoading(true)
      await signup(emailRef.current.value, passwordRef.current.value)
      db.collection('users').add({
        email : emailRef.current.value,
        name : unameRef.current.value,
        teams : []
      })
      history.push('/login')
    } catch {
      setError("Failed to create an account")
    }

    setLoading(false)
  }
  
  let lhtml ;
  
 return (<div>
    {!currentUser ? (
      <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style ={{backgroundColor : "#ddddff",  width: 400}}>
      <Card.Body>
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="userName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={unameRef} required />
          </Form.Group>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>
          <Form.Group id="password-confirm">
            <Form.Label>Password Confirmation</Form.Label>
            <Form.Control type="password" ref={passwordConfirmRef} required />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            Sign Up
          </Button>
        </Form>
      </Card.Body>
    
    <div className="w-100 text-center mt-2">
      Already have an account? <Link to="/login">Log In</Link>
    </div></Card>
    </Container>
    ) : (<Redirect to={"/user/"+currentUser.email}></Redirect>)}</div>
  )
}
