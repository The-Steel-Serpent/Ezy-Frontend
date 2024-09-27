import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFirebase} from '../../firebase/firebase';
const PrivateRouteSeller = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); 
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authFirebase, (user) => {
            if (user) {
                console.log('User is authenticated');
                setIsAuthenticated(true);
            } else {
                console.log('User is not authenticated');
                setIsAuthenticated(false);
            }
        });
        return () => unsubscribe();
    }, [authFirebase]);

    useEffect(() => {
        // Only navigate if authentication state is resolved
        if (isAuthenticated === false) {
            console.log('Navigating to /seller/login');
            navigate('/seller/login');
        }
    }, [isAuthenticated, navigate]);

    if (isAuthenticated === null) {
        return null;
    }

    return children;
};

export default PrivateRouteSeller;
