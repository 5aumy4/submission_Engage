import React, { useEffect, useState, useRef } from 'react';
//import './App.css';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { useParams } from "react-router-dom";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;

const VideoCall2= () => {
    const [stream, setStream] = useState();
    const userVideo =useRef();
    const partnerVideo = useRef();
    const params = useParams;
    const ROOM_ID = params.roomID;
    const socket = useRef();
    const myPeer = useRef();
    //const videoGrid = document.getElementById('video-grid')
     
    //const myVideo = document.createElement('video')
    //myVideo.muted = true
    const peers = {}
    useEffect(()=>{
        socket.current = io.connect("/");
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
      if(myPeer.current){
        myPeer.current = new Peer(undefined, {
            host: '/',
            port: '8000'
          })
      }
    })

    socket.current.on('user-connected', userId => {
        console.log("user-connected")
        connectToNewUser(userId, stream)
        
      })

      socket.current.on('user-disconnected', userId => {
        if (peers[userId]) peers[userId].close()
      })
      myPeer.current.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          //addVideoStream(video, userVideoStream)
          partnerVideo.current.srcObject = userVideoStream;
        })
      })
      myPeer.current.on('open', id => {
        socket.emit('join-room', ROOM_ID, id)
        console.log(id+ "opened");
      })
    },[]);
    
    
      
    
      
    
    
    
    
    
    
    function connectToNewUser(userId, stream) {
      const call = myPeer.call(userId, stream)
      const video = document.createElement('video')
      call.on('stream', userVideoStream => {
        partnerVideo.current.srcObject= userVideoStream;
      })
      call.on('close', () => {
        partnerVideo.current.srcObject=null;
      })
    
      peers[userId] = call
    }
    
    /*function addVideoStream(video, stream) {
      video.srcObject = stream
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
      videoGrid.append(video)
    }*/

    let UserVideo = (
        <Video playsInline muted ref={userVideo} autoPlay />
    );
    let PartnerVideo = (
        <Video playsInline ref={partnerVideo} autoPlay />
    );
    return(
        <div>
            <Container>{UserVideo}</Container>
            <Container>{PartnerVideo}</Container>
        </div>
    )
  
};

export default VideoCall2;