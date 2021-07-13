import { useParams } from "react-router-dom";
import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import { useHistory } from 'react-router-dom';
import Peer from "simple-peer";
import  { Redirect, withRouter } from 'react-router-dom';
import { Link } from "react-router-dom";



const Team = (props) =>{
    let history = useHistory;
    //state = {redirect:null};

    const [recieve,setRecieve]= useState("");
    const [incoming, setIncoming]= useState(false);
    const [caller,setCaller] = useState("");
    const [room, setRoom] = useState("");
    const [fromTeam,setFromTeam]= useState("");
    const [gotoRoom, setGotoRoom]= useState("");


    const params = useParams();
    const socket = io.connect("/");
    socket.on('connect', ()=>{
        socket.emit('takeData',{
            team :props.team.teams[params.teamID].teamID,
            name : props.team.id,
            id : socket.id
        });
    });
    let link;

  function callFriend(nme,team){
      console.log(nme+" "+team);

      link = `videoCall/${nme + team + props.team.id}`;

      socket.emit("callFriend",{
          link: link,
          to:{
              team : team,
              name: nme
          },
          from : {
              team : team,
              name: props.team.id
          }
      });
      setGotoRoom(true);
  }

  socket.on("incomingCall",(data)=>{
      console.log(data);
      setIncoming(true);
      setCaller(data.from.name);
      setFromTeam(data.from.team);
      setRoom(data.link);
  });

  socket.on("friendOnline", ()=>{
      console.log("friend online");
  });
  socket.on("friendOffline", ()=>{
    console.log("friend offline");
  });

  function recieveCall(){
      console.log(room);
      //this.state.redirect = room;
      //this.props.history.push('/welcome');

      return <Redirect to = 'http://google.com' />;
    socket.emit("Accepted",{
        from:{
            name: caller,
            team : fromTeam
        }
        
    });
    

    
    
  }

  socket.on("yourFriendAccepted", (data)=>{
    <Redirect to = {link} />
  });

  socket.on("yourFriendDeclined", (data)=>{
      console.log("call declined");
  });

  function declineCall(){
      console.log("i dont wnna talk");
    socket.emit("Declined",{
        from:{
            name: caller,
            team : fromTeam
        }
        
    });
  }

  let callingComponent;
  if(incoming){
      callingComponent=(
      <div>
          <h2>Incoming call from {caller}:</h2>
          <Link to = {room}>Accept</Link>
          
      </div>
      );
  }

  let gotoComponent;

  if(gotoRoom){
      console.log(link);
      gotoComponent=(
          <div>
              <Link to = {link}>Go to Room</Link>
          </div>
      )
  }

  //console.log(params);
  //console.log("hi");
  //console.log(props);
  return (
      //{if(this.state.redirect)}
      <div>
          <h1>Hey, {props.team.id} ! <br/>Welcome to {props.team.teams[params.teamID].teamID}!!</h1>
          <ul>
                {props.team.teams[params.teamID].contacts.map((contact)=>(
                    <li>
                       <button onClick={()=>callFriend(contact,props.team.teams[params.teamID].teamID)}>Call {contact}</button>
                    </li>
                ))}
            </ul>
            {gotoComponent}
            {callingComponent}
      </div>
  )
}

export default withRouter(Team);