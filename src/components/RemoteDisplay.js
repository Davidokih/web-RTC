import React, { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useParams, useNavigate } from 'react-router-dom';

io("http://localhost:2222");
const RemoteDisplay = () => {

    const { roomID } = useParams();
    const navigate = useNavigate();

    const shareVideo = useRef();

    const userVideo = useRef();
    const partnervideo = useRef();
    const userStream = useRef();
    const otherUser = useRef();
    const socketRef = useRef();
    const peerRef = useRef();

    const servers = {
        iceServers: [ {
            url: [
                'stun: stun1.1.google.com:19302', 'stun: stun2.1.google.com:19302'
            ]
        } ]
    };

    const share = () => {
        navigator.mediaDevices.getDisplayMedia().then((stream) => {
            shareVideo.current.srcObject = stream;
        });
    };
    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then(stream => {
                userVideo.current.srcObject = stream;
                userStream.current = stream;

                socketRef.current = io("http://localhost:2222");
                socketRef.current.emit("join room", roomID);

                socketRef.current.on("other user", (userID) => {
                    callUser(userID);
                    socketRef.current = userID;
                });
                socketRef.current.on("user joined", (userID) => {
                    socketRef.current = userID;
                });

                socketRef.current.on("offer", handleReceived);
                socketRef.current.on("answer", handleAnswer);
                socketRef.current.on("ice-candidate", handleIceCandidateMGS);
            });
    }, []);

    const handleReceived = () => {

    };

    const callUser = (userID) => {
        peerRef.current = createPeer(userID);

        userStream.current.getTracks().forEach((track) => {
            peerRef.current.addTrack(track, userStream.current);
        });
    };

    const createPeer = (userID) => {
        const peer = new RTCPeerConnection(servers);

        peer.onicecandidate = handleIceCandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);
    };

    const handleNegotiationNeededEvent = (userID) => {
        peerRef.current.createOffer().then((offer) => {
            peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription,
            };
            socketRef.current.emit("offer", payload);
        });
    };
    const handleTrackEvent = (e) => {
        partnervideo.current.srcObject = e.streams[ 0 ];
    };
    const handleIceCandidateEvent = (e) => {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate
            };
            socketRef.current.emit("ice-candidtae", payload);
        }
    };
    return (
        <div>
            <h1>Remote Display</h1>
            <br />
            <br />
            <video autoPlay playsInline ref={ userVideo } />
            <video autoPlay playsInline ref={ partnervideo } />
            <br />
            <br />
            <button onClick={ share }>Share Screen</button>
            <video ref={ shareVideo } autoPlay playsInline style={ { width: "300px", height: "500px", objectFit: "contain" } } />
        </div>
    );
};

export default RemoteDisplay;