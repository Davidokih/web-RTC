import React, { useEffect, useRef } from 'react';

const ShareScreen = () => {
    const screenShare = useRef();

    useEffect(() => {
        navigator.mediaDevices.getDisplayMedia();
    }, []);
    return (
        <div>ShareScreen</div>
    );
};

export default ShareScreen;