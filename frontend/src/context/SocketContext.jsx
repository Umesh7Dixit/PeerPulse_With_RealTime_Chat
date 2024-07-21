import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

import io from 'socket.io-client';

const SocketContext = createContext();

// create a hook inorder to get data from anywhere the app
export const useSocket = ()=>{ //when we want to use value i.e socket then we call useSocket hook
    return useContext(SocketContext);
}

//  This defines a context provider component
//  that will wrap other components to provide socket functionality.
export const SocketContextProvider = ({children}) => {
    const [socket , setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const user = useRecoilValue(userAtom);

    useEffect(()=>{
        
        const socket = io("http://localhost:5000",{  //Establishes a Socket.IO connection to "http://localhost:5000"
            query:{
                userId: user?._id //Passes the user's ID as a query parameter
            },
        });

        setSocket(socket);  //Updates the socket state

        socket.on("getOnlineUsers", (users)=>{
            setOnlineUsers(users);//it shows the online users coming from hashmap form server(socket,js)
        });


        return ()=> socket && socket.close();//for disconnectin
        //  Closes the socket connection when the component unmounts
        //  or when dependencies change

    },[user?._id,]); 

   


    return (
        <SocketContext.Provider value={{socket,onlineUsers}}>  {children}  </SocketContext.Provider>
    )

}