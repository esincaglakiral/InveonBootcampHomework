import * as React from 'react';
import { connect, useDispatch } from 'react-redux';
import userManager from '../utils/userManager';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const CallbackPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const successCallback = (user) => {
        console.log('successCallback');
        // get the user's previous location, passed during signinRedirect()
        const redirectPath = user.state.path;
        // Doing this to make sure data is serializable, otherwise it errors.
        // i guess it has something to do with typescript typing.
        let d = JSON.stringify(user);
        let f = JSON.parse(d);
        dispatch({ type: "user/login", payload: { user: f, status: true } })
        navigate(redirectPath);
    };

    const errorCallback = (error) => {
        console.log('errorCallback');
        console.log(error);
        navigate('/');
    };

    useEffect(() => {
        userManager
            .signinRedirectCallback()
            .then(user => successCallback(user))
            .catch(error => errorCallback(error));
    });

    return <div>Loading...</div>;
};

export default connect()(CallbackPage);