import React from 'react';
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const LocalDisplay = () => {

    const navigate = useNavigate();
    const id = uuidv4();

    const changeScreen = () => {
        navigate(`/display/${id}`);
    };
    return (
        <div>
            <h1>Local Display</h1>
            <center>
                <button onClick={ changeScreen }>Create Conversation</button>
            </center>
        </div>
    );
};

export default LocalDisplay;