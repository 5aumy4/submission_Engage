import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container, Row, Navbar, NavbarBrand } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.css';
import { Redirect } from "react-router";

export default function Login() {
  const emailRef = useRef()
  const passwordRef = useRef()
  const { currentUser, login } = useAuth()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const history = useHistory()

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await login(emailRef.current.value, passwordRef.current.value)
      console.log(currentUser);
      history.push(`/user/${currentUser.email}`)
    } catch {
      setError("Failed to log in")
    }

    setLoading(false)
  }

  return (<div>
    {!currentUser ? (
      <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style ={{backgroundColor : "#ddddff",  width: 400}}>
      <Card.Body>
        <h2 className="text-center mb-4">Log In to MyClone</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group id="email">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" ref={emailRef} required />
          </Form.Group>
          <Form.Group id="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" ref={passwordRef} required />
          </Form.Group>
          <Button disabled={loading} className="w-100" type="submit">
            Log In
          </Button>
        </Form>
      </Card.Body>
    
    <div className="w-100 text-center mt-2">
     Don't have an account? <Link to="/register">Sign Up</Link>
    </div></Card>
    
    </Container>
    ) : (<Redirect to={"/user/"+currentUser.email}></Redirect>)}</div>
  )
}
