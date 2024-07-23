// we create this hook to get user data from any page (like we need data of user on postPage.jsx and post.jsx so instead of 
// creating repeatedly create getUser function we create usegetUserProfile function to get user data from database)

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {

    const [user , setUser] = useState(null);
    const [loading , setLoading] = useState(true);
    const {username} = useParams();

    const showToast = useShowToast();   //from useShowToast hook

    useEffect(()=>{

        const getUser = async () => {
          
          // setLoading(true);
          try {
    
            const res = await fetch(`/api/users/profile/${username}`);   //sending req by sending username (dynamic route)   
            const data = await res.json();
    
            if(data.error){
              showToast("Error",data.error,"error");  //title,description,status
              return;
            }

            if(data.isFrozen)
            {
              setUser(null);
              return;
            }

            setUser(data);
          } catch (error) {
            showToast("Error",error.message,"error");
          }finally {
            setLoading(false);
          }
    
        };
    
        getUser();
    
    
      },[username,showToast])

      return{loading,user}

}

export default useGetUserProfile