import { Avatar, AvatarBadge,Text, Flex,Image, Stack, useColorModeValue, WrapItem, Box, useColorMode } from "@chakra-ui/react"
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from '../atoms/userAtom';
import { BsCheck2All } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";


const Conversation = ({conversation}) => {
    const user = conversation.participants[0];
    const lastMessage = conversation.lastMessage;
    const currentUser = useRecoilValue(userAtom);
    const [selectedConversation,setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const colorMode =  useColorMode();

    console.log("selectedConversation",selectedConversation);

  return (
    <Flex
        gap={4}
        alignItems={'center'}
        p={'1'}
        _hover={{
            cursor: 'pointer',
            bg:useColorModeValue('gray.600','gray.dark'),  // gray.600 for light mode ,gray.dark for dark mode
            color:'white',
        }}

        // 9:02
        onClick={()=>setSelectedConversation({
            _id:conversation._id,
            userId: user._id,
            userProfilePic: user.profilePic,
            username:user.username,
            mock:conversation.mock,
        })}

        bg={selectedConversation?._id === conversation._id ? (colorMode === "light" ? "gray.400":"gray.dark") : "" }
        borderRadius={'md'}
    >
        <WrapItem>
            <Avatar 
                size={{
                    base:'xs',
                    sm:"sm",
                    md:'md',
                }} 
                src={user.profilePic}
            >

            <AvatarBadge boxSize={'1em'} bg={"green.500"}  />
            </Avatar>
        </WrapItem>

        <Stack direction={"column"} fontSize={'sm'} >
            <Text fontWeight='700' display={"flex"}  alignItems={'center'} >
                {user.username}  <Image src='/verified.png' w={4} h={4} ml={1} />
            </Text>
            <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1} >
            {/* 8:57 if we send the message we know that the last message is send by me */}
                {  currentUser._id === lastMessage.sender ? (
						<Box color={lastMessage.seen ? "white.400" : ""}>
							<BsCheck2All size={16} />  
						</Box>
					) : ( "" )}

                {/* if last message is too large then make ... like "umesh please reply..." */}
                {lastMessage.text.length > 18 ? lastMessage.text.substring(0,18) + "..." : lastMessage.text}  
            </Text>
        </Stack>
    </Flex>
  )
}

export default Conversation 