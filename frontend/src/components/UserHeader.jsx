
import { Avatar, Box,  Button,  Flex,  Link,  Menu,  MenuButton,  MenuItem,  MenuList,  Portal,  Text,  VStack, useToast } from "@chakra-ui/react"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

import { Link as RouterLink } from 'react-router-dom';
import useFollowUnfollow from "../hooks/useFollowUnfollow.js";


//for responsive avatar size={{ base:"md" , md:"xl"} base me medium ho jaye and medium screens pr large ho jaye avatar
    

const UserHeader = ({ user }) => {
    
    const toast = useToast();  
    const currentUser = useRecoilValue(userAtom);  //this is the user that logged in
    const {handleFollowUnfollow , updating , following } = useFollowUnfollow(user);
    
    
    // creating the url copy
    const copyURL = ()=>{  
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(()=>{toast({ description: 'URL copied to clipboard',duration:1000,status:"success", isClosable:true})} );
    } ; 
    


  return (

    <VStack gap={4} alignItems={"start"} >
       
        <Flex justifyContent={"space-between"} w={"full"} >
            <Box>
                <Text fontSize={"2xl"} fontWeight={"bold"} >{user.name  || 'Anonymous'}</Text>
                <Flex gap={2} alignItems={"center"} >
                    <Text fontSize={"sm"} >{user.username}</Text>
                    <Text fontSize={"xs"} bg={"gray-dark"}color={"gray.light"}>threads.net</Text>
                </Flex>
            </Box>
            <Box>
                {/* if user have a profile pic then */}
                {     
                    user.profilePic && (
                   
                     <Avatar name={user.name} src={user?.profilePic} size={{ base:"md" , md:"xl"}}/>  

                    )
                }

                {/* if user don't profile pic then */}

                {     
                    !user.profilePic && (
                   
                     <Avatar name={user.name} src='https://bit.ly/broken-link' size={{ base:"md" , md:"xl"}}/>  

                    )
                }
            </Box>
        </Flex>

        {/* <Text>Co-founder, executive chairman ans CEO of Meta Platform.</Text> */}
        <Text>{user.bio}</Text>

        {
            currentUser?._id === user._id && (  //we Link type of react-router-dom so stop reloading and only work on clink side
                <Link as={RouterLink} to='/update'>  
                    <Button size={"sm"}  >Update Profile</Button>
                </Link>
            )
        }
        
        {   currentUser?._id !== user._id &&  (<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating} >
                { following ? "Unfollow":"Follow" }
            </Button>
        )}


        <Flex w={"full"}  justifyContent={"space-between"}>
            <Flex gap={2} alignItems={"center"} >
                {/* <Text color={"gray.light"} >3.6K followers</Text>         followers.length due to it is an array          */} 
                <Text color={"gray.light"} >{user.followers.length}</Text>        
                <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"} ></Box>
                <Link color={"gray.light"} >instagram.com</Link>
            </Flex>
            <Flex>
                <Box className="icon-container" >
                    <BsInstagram size={24} cursor={"pointer"}/>
                </Box>
                <Box className="icon-container" >
                    <Menu>
                     <MenuButton><CgMoreO size={24} cursor={"pointer"}  /> </MenuButton>
                       <Portal>
                        <MenuList bg={"gray.dark"} >
                            <MenuItem bg={"gray.dark"} onClick={copyURL} >Copy Link</MenuItem>
                        </MenuList>
                       </Portal>
                    </Menu>                    
                </Box>
            </Flex>
        </Flex>


        <Flex w={"full"} >
         <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
            <Text fontWeight={"bold"} >Threads</Text>
         </Flex>
         <Flex flex={1}  borderBottom={"1px solid gray"} color={"gray.light"} justifyContent={"center"} pb={3} cursor={"pointer"} >
            <Text fontWeight={"bold"} >Replies</Text>
         </Flex>
        </Flex>

    </VStack>
  )
}

export default UserHeader