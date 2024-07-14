import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
// import { GiConversation } from "react-icons/gi";

const ChatPage = () => {
  
  
  
  const [searchingUser,setSearchingUser] = useState(false) //loading state
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [ searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useRecoilState( selectedConversationAtom);
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      //if user is trying to message themselves  //name cinvention always you should try
      const messagingYourself = searchedUser._id === currentUser.id;
      if(messagingYourself){
        showToast("Error", "Cannot start a conversation yourself", "error");
        return;
      }

      //(9:38)if user is already in a conversation with the searched user then we searched in conversation array
      // then we checked searchedUser._id from participants array in conversation
      const conversationAlreadyExists = conversations.find(conversation => conversation.participants[0]._id === searchedUser._id);
      if(conversationAlreadyExists){
        // set the setSelect edConversation
        setSelectedConversation({
          _id: conversationAlreadyExists._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        return ;
      }

      // 9:43 if conversation not exists and we search the username then we create a fake conversation on rightSide

      const mockConversation = {
        mock:true,
        lastMessage: {
          text:"",
          sender:""
        },
        _id:Date.now(),
        participants:[
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          }
        ]
      }

      setConversations( (prevConvs) => [...prevConvs, mockConversation]);

    } catch (error) {
      showToast("Error", error.message, "error");
    }finally{
      setSearchingUser(false);
    }
  };


  return (
    <Box
      position={"absolute"} left={"50%"}
      w={{
        base: "100%",
        md: "80%",
        lg: "750px",
      }}
      p={4} transform={"translateX(-50%)"}  >
      <Flex
        gap={4}
        flexDirection={{
          base: "column",
          md: "row",
        }}
        maxW={{
          sm: "400px",
          md: "full",
        }}
        mx={"auto"}
      >
        <Flex
          flex={30}
          gap={2}
          flexDirection={"column"}
          maxW={{
            sm: "250px",
            md: "full",
          }}
          mx={"auto"}
        >
          <Text
            fontWeight={700}
            color={useColorModeValue("gray.600", "gray.400")}
          >
            Your Conversation
          </Text>
          <form  onSubmit={handleConversationSearch}  >
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder="Search User" onChange={(e)=> setSearchText(e.target.value)}  />
              <Button size={"sm"} onClick={handleConversationSearch} isLoading={searchingUser} >
                <SearchIcon />
              </Button>
            </Flex>
          </form>

          {loadingConversations && //when loadingState it true then show skeleton otherwise show conversation
            [0, 1, 2, 3, 4, 5].map((_, i) => (
              <Flex
                key={i}
                gap={4}
                alignItems={"center"}
                p={"1"}
                borderRadius={"md"}
              >
                <Box>
                  {/* to show user image */}
                  <SkeletonCircle size={"10"} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  {/* to show 1 username and 2 message text */}
                  <SkeletonCircle h={"10px"} w={"80px"} />
                  <SkeletonCircle h={"8px"} w={"90%"} />
                </Flex>
              </Flex>
            ))}

          {!loadingConversations &&
            conversations.map((conversation) => (
              <Conversation
                key={conversation._id}
                conversation={conversation}
              />
            ))}
        </Flex>

        {!selectedConversation._id && (
          <Flex
            flex={70}
            borderRadius={"md"}
            p={2}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"400px"}
          >
            {/* <GiConversation size={100} /> */}
            <Text fontSize={20}>Start a conversation to start messaging</Text>
          </Flex>
        )}

        {
          //if we have selectedConversation then show the conversation or message on right side
          selectedConversation._id && <MessageContainer />
        }
      </Flex>
    </Box>
  );
};

export default ChatPage;
