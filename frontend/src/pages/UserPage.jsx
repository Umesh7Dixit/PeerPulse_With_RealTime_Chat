import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import { useParams } from "react-router-dom";
import useShowToast from '../hooks/useShowToast'
import { Flex, Spinner } from "@chakra-ui/react";
import Post from '../components/Post.jsx'
import useGetUserProfile from "../hooks/useGetUserProfile.jsx";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom.js";

const UserPage = () => {

  const {user, loading} = useGetUserProfile();

  const { username } = useParams();  //get username form url (params) by useParams
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);  //post1, post2 , post3
  const [fetchingPosts, setFetchingPosts] = useState(true); //set fetching



  useEffect(()=>{     //fetch user by particular username on url

    const getPosts = async()=> {
      if(!user)return;
      setFetchingPosts(true);
  
      try {
  
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        console.log(data);
        setPosts(data);   //first it is empty array then data is set on setPosts
  
        
      } catch (error) {
        showToast("Error",error.message,"error");
        setPosts([]);
      }finally{
        setFetchingPosts(false);
      }
  
    }

    getPosts();
    
  },[username, showToast,setPosts,user])     //so we will get the user details by sending username on url

  // useEffect will run whenever the username changes
    console.log("posts is here",posts);
 

  if (!user && loading) {
    return (
      <Flex justifyContent={'center'} >
        <Spinner size='xl' />
      </Flex>
    )
  }

  // if (!user && !loading) {
  //   return (
  //     <Flex justifyContent={'center'} >
  //       <h1>User not found</h1>
  //     </Flex>
  //   )
  // }

  return (
    < >
        <UserHeader user={user} />

        { !fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}

        {
          fetchingPosts && (
            <Flex justifyContent={'center'} my={12}  >
              <Spinner size={"xl"} />
            </Flex>
          )
        }

        {
          posts.map((post) => (
            <Post key={post._id} post={post}  postedBy={post.postedBy}   />
          ))
        }
        
    </ >
  )
}

export default UserPage