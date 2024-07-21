import {  Box, Flex, Spinner } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import useShowToast from '../hooks/useShowToast.jsx'
import Post from "../components/Post.jsx";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom.js";
import SuggestedUsers from "../components/SuggestedUsers.jsx";


const HomePage = () => {

    const [posts , setPosts ] = useRecoilState(postsAtom);

    const [loading , setLoading ] = useState(true);

    const showToast = useShowToast();

    useEffect(() => {

            const getFeedPosts = async () => {
                setLoading(true);
                setPosts([]); //we do this because when i go to home page then it first show posts then all homepage and before we fetch anything the posts gonna be empty array
                try{

                    const res = await fetch("/api/posts/feed");
                    const data = await res.json();

                    if(data.error)
                    {
                        showToast("Error",data.error, "error");
                        return;
                    }

                    console.log(data);
                    setPosts(data);

                    
                }catch(error){
                    showToast("Error",error.message, "error");
                 }
                finally{
                    setLoading(false);
                }

            };
            

            getFeedPosts();


    },[ showToast,setPosts ]);

    return (
       
        <Flex gap={'10'} alignItems={"flex-start"} >
           <Box flex={70} >
                {
                     !loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>
                }

                { loading && (
                         <Flex justify="center" >
                             <Spinner size='xl' />
                         </Flex>
                     ) }

                

                {  posts.map((post) =>(
                         <Post key={post._id} post={post} postedBy={post.postedBy} />
                     )) }
           </Box>

           <Box flex={30} display={{
					base: "none", //for mobile we dont see SuggestedUsers
					md: "block",
				}} >
                     <SuggestedUsers/>
           </Box>
        </Flex>

    );
};

export default HomePage;