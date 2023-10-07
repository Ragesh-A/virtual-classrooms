import React, { useContext, useEffect, useRef } from 'react';
import { MeetupContext } from './MeetUp';
// import { iceServers } from '../../constant/constant';
import { useSelector } from 'react-redux';

const Test = () => {
  const { socket } = useContext(MeetupContext);
  const { user } = useSelector(store => store.user)
  const localVideoRef = useRef()
	const remoteVideoRefs = useRef({})
  const peerConnectionRef = useRef({})
  

	//
	const initPeerConnection = (_id) => {
    const newRTCP = new RTCPeerConnection();
    peerConnectionRef[_id] = newRTCP
		newRTCP.ontrack = (event) => {
			remoteVideoRefs[_id].srcObject = event.streams[0]
    };
  

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(stream => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => newRTCP.addTrack(track, stream))
      })
    
    newRTCP.onicecandidate = (event) => {
      if (event && event?.candidate) {
        socket.emt('candidate', event?.candidate, _id)
      }
    }

    newRTCP.createOffer()
      .then(offer => newRTCP.setLocalDescription(offer))
      .then(() => {
        console.log('i am going to emit offer', newRTCP.localDescription);
      socket.emit('offer', newRTCP.localDescription, _id)
      })
    
    peerConnectionRef[_id] = newRTCP
  };
  
  const joinConference = () => {
    // if (isCreator) {
      
    // } else {
      socket.emit('join')
    // }
  }

  useEffect(() => {
    if (!socket || !user) return 
    joinConference();

    socket.on('joined', _id => {
      console.log('some one is joined');
      initPeerConnection(_id)
    })

    socket.on('candidate', (candidate, userId) => {
      console.log('i got the candidate :', candidate);
      peerConnectionRef[userId].addIceCandidate(candidate);
    })

    socket.on('offer', (offer, userId) => {
      console.log('i got the offer', offer, userId, peerConnectionRef);
      initPeerConnection(userId)
      peerConnectionRef[userId].setRemoteDescription(offer);

      peerConnectionRef[userId].createAnswer()
        .then(answer => peerConnectionRef[userId].setLocalDescription(answer))
        .then(() => {
        socket.emit('answer', peerConnectionRef[userId].localDescription, userId)
      })
    })

    socket.on('answer', (answer, userId) => {
      console.log('i got the answer: ', answer);
      peerConnectionRef[userId].setRemoteDescription(answer);
    })
    
  }, [socket, user])

  console.log('localVideoRef: ', localVideoRef);
  console.log('remote: ' ,remoteVideoRefs);
  console.log('peerConnections : ', peerConnectionRef);

  return <div>
    <video ref={localVideoRef} autoPlay muted />
    {
      Object.keys(remoteVideoRefs).map(participantId => (
        <video
          key={participantId}
          ref={ref => (remoteVideoRefs[participantId] = ref)}
          autoPlay
        />
      )) 
    }
  </div>;
};

export default Test;
