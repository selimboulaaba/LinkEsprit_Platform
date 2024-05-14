import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // This should be imported as 'jwtDecode' not 'jwt-decode'
import { getUserById } from "../services/user";
import { io } from "socket.io-client"; // Import 'io' from 'socket.io-client'
import { toast } from 'react-toastify'; // Import 'toast' from 'react-toastify'
import { Bounce } from 'react-toastify';

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext);

export function AuthContextProvider({ children }) {
    const [token, setToken] = useState(Cookies.get('token') || null);
    const [loggedIn, setLoggedIn] = useState(!!token);
    const [user, setUser] = useState({
        _id: ''
    })

    const login = (token) => {
        Cookies.set('token', token, { expires: 7 });
        setToken(token);
        
        setLoggedIn(true);
        setupSocket();
        
        getUserById(jwtDecode(token).userId)
            .then(data => {
                setUser(data)
                
            })
    };

    const logout = () => {
        Cookies.remove('token');
        setToken(null);
        setLoggedIn(false);
        setUser({})
    };


    useEffect(() => {
        const storedToken = Cookies.get('token');
        if (storedToken) {
            setToken(storedToken);
            setLoggedIn(true);
            if (user._id == '') {
                getUserById(jwtDecode(token).userId)
                .then(data => {
                    setUser(data)
                })
            }
        }
    }, []);
    //socketio
    const [socket, setSocket] = useState(null);

    const setupSocket = () => {
      const token = Cookies.get('token');
      
      if (token && !socket) {
        const newSocket = io("http://localhost:3000", {
          query: {
            token: Cookies.get('token'),
          },
        });
        console.log(newSocket)
  
        newSocket.on("disconnect", () => {
          setSocket(null);
          // setTimeout(setupSocket, 3000);
        
          
       
        });
  
        newSocket.on("connect", () => {
       
          
        });
  
        setSocket(newSocket);
      }
    };
    useEffect(() => {
      setupSocket();
      //eslint-disable-next-line
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, token, login, logout, user, setUser,setupSocket,socket, setSocket }}>
            {children}
        </AuthContext.Provider>
    )
}