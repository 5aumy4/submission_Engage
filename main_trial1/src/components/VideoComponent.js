import { useEffect, useRef } from "react";
import styled from "styled-components";
const Video = styled.video`
  border: 1px solid blue;
  width: 300px;
  height: 300px;
`;

const VideoComponent = (props) => {

    const vidRef = useRef();
    useEffect(()=>{
        if(vidRef.current)vidRef.current.srcObject = props.strea;
    },[]);
    

    return(<div>
    
    <Video playsInline ref={vidRef} autoPlay />
    <button>Mute</button>
    </div>
    
    )
};

export default VideoComponent;