import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom";
import useShowToast from '../hooks/useShowToast'
import { Flex, Spinner } from "@chakra-ui/react";

const UserPage = () => {

  const [user,setUser] = useState(null);

  const showToast = useShowToast();

  const [loading, setLoading] = useState(true);

  const { username } = useParams();  //get username form url (params) by useParams

  useEffect(()=>{     //fetch user by particular username on url

    const getUser = async () => {
      setLoading(true);
      try {

        const res = await fetch(`/api/users/profile/${username}`);   //sending req by sending username (dynamic route)   
        const data = await res.json();

        if(data.error){
          showToast("Error",data.error,"error");  //title,description,status
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error",error,"error");
      }finally {
        setLoading(false);
      }

    };

    getUser();
    
  },[username, showToast])     //so we will get the user details by sending username on url

  // useEffect will run whenever the username changes

  if (!user && loading) {
    return (
      <Flex justifyContent={'center'} >
        <Spinner size='xl' />
      </Flex>
    )
  }

  if (!user && !loading) {
    return (
      <Flex justifyContent={'center'} >
        <h1>User not found</h1>
      </Flex>
    )
  }

  return (
    <div>
        <UserHeader user={user} />
        <UserPost likes={1200} replies={481} postImage="/post1.png" postTitle="Let's talk about threads." /> 
        <UserPost likes={1452} replies={262} postImage="/post2.png" postTitle="Nice tutorial." />
        <UserPost likes={657} replies={972} postImage="/post3.png" postTitle="I Love this guy." />
        <UserPost likes={756} replies={462} postImage="/coolimage.png" postTitle="This is my first thread." />
         
    </div>
  )
}

export default UserPage