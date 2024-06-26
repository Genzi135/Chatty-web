/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext();


export const SocketProvider = ({ children }) => {
    let socket = io("http://ec2-13-212-80-57.ap-southeast-1.compute.amazonaws.com:8555");
    const currentUser = useSelector((state) => state.user);
    console.log('connect...');
    useEffect(() => {
        if (currentUser && currentUser._id) {
            socket.emit('user_connected', { userId: currentUser._id });

        }
        return () => {
            socket.disconnect();
        }
    }, [currentUser])

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
    return useContext(SocketContext);
}