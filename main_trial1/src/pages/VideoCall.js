import React, { useEffect, useState, useRef } from 'react';
import VideoComponent from '../components/VideoComponent';
//import './App.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import {Link} from "react-router-dom";

const Container = styled.div`
  height: 100vz
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%
  height:100px
`;

var Video = styled.video`
  border: 1px solid blue;
  
`;

const VideoCall= () => {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  //const stream = null;
  const [stream, setStream] = useState();
  const [partnerStream, setPartnerStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [a1,seta1] = useState(true);
  const [a2,seta2] = useState(true);
  const [v1,setv1] = useState(true);
  const [v2,setv2] = useState(true);
  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io.connect("/");
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(strea => {

      setStream(strea);
      if (userVideo.current) {
        userVideo.current.srcObject = strea;
      }
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    })

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {

        iceServers: [
            {
                urls: "stun:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            },
            {
                urls: "turn:numb.viagenie.ca",
                username: "sultan1640@gmail.com",
                credential: "98376683"
            }
        ]
    },
      stream: stream,
    });

    peer.on("signal", data => {
      socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        setPartnerStream(stream);
        //ideo.current.spartnerVrcObject = stream;
      }
    });

    socket.current.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      setPartnerStream(stream);
      
    });

    peer.signal(callerSignal);
  }
  
  function mute(){
    if(v1)setv1(false);
    if(!v1)setv1(true);
    console.log(v1);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video height={400} playsInline muted ref={userVideo} autoPlay />
    );
  }

  let PartnerVideo;
  if (callAccepted) {
    /*if(v1){
      partnerStream.getVideoTracks()[0].enabled=
      ! partnerStream.getVideoTracks()[0];
    }*/
    if(partnerVideo.current)partnerVideo.current.srcObject=partnerStream;
    PartnerVideo = (
      <Video height= {100} playsInline ref={partnerVideo} autoPlay />
    );
  }

  let incomingCall;
  if (receivingCall) {
  
    incomingCall=(
      <div>
        <button onClick={acceptCall}>Join</button>
      </div>
    )
  }
  else{
    Object.keys(users).map(key => {
      if (key === yourID) {
        return null;
      }
      else callPeer(key);
    })
  }
  
  


  return (
    <Container>
        <Row>
        {UserVideo}
        <button onClick={()=>mute()}>Mute Myself</button>
        {PartnerVideo}
        </Row>
      
        
      
      
      <Row>
        {incomingCall}
        </Row>
        <Row>
        <Link to="/welcome">Leave Meeting</Link>
      </Row>
    </Container>
  );
  
};

export default VideoCall;