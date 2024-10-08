import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFirebase } from '../../firebase/firebase';
import axios from "axios";

const PrivateRouteSeller = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authFirebase, (user) => {
            if (user) {
                console.log('User is authenticated');
                setIsAuthenticated(true);
                setUser(user);
            } else {
                console.log('User is not authenticated');
                setIsAuthenticated(false);
            }
        });
        return () => unsubscribe();
    }, [authFirebase]);

    useEffect(() => {
        if (isAuthenticated === false) {
            console.log('Navigating to /seller/login');
            navigate('/seller/login');
        }
        else {
            const checkSetUp = async() => {
                try {
                    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/check-email?email=${user.email}`;
                    const res = await axios({
                        method: "GET",
                        url: URL,
                        withCredentials: true
                    });
                    console.log("Setup status:",res.data.user.setup);
                    if(res.data.user.setup === 0)
                    {
                        navigate('/seller/seller-setup');
                    }
                } catch (error) {
                    console.log("Error check setup:", error);
                }
            };
            checkSetUp();            
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated === null) {
        return null;
    }

    return children;
};

export default PrivateRouteSeller;
