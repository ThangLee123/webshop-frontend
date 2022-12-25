import { useEffect } from 'react';
import { useRef } from 'react';
import { createContext } from 'react';
import { io } from 'socket.io-client';
const SocketContext = createContext();

function SocketProvider({ children }) {
    const socket = useRef();

    socket.current = io('ws://webshop-socket-api.onrender.com/');
    // useEffect(() => {
    //     socket.current = io('ws://localhost:8900/');
    //     // socket.current.on("getMessage", (data) => {
    //     //   console.log("io arrival message", data);
    //     // //   setArrivalMessage({
    //     // //     sender: data.senderId,
    //     // //     text: data.text,
    //     // //     createdAt: Date.now(),
    //     // //   });
    //     // });
    // }, []);

    return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
}

export { SocketContext, SocketProvider };
