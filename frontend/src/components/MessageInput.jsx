import { Input, InputGroup, InputRightElement } from "@chakra-ui/react"
import { useState } from "react";
import {IoSendSharp} from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";

const MessageInput = ({setMessages}) => {

  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);

  const handleSendMessage = async (e) => {
    e.preventDefault(); //it doesn't refresh the page when we submit
    if(!messageText)return //we don't want to send empty messages to db

    try {
      const res = await fetch("/api/messages",{method:"POST",
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
          message:messageText,
          recipientId: selectedConversation.userId,
        })
      });
      const data = await res.json();
      if(data.error){
        showToast("Error", data.error,"error");
      }
      console.log(data);
      setMessages((messages)=> [...messages, data]);  //add message in last of messages array
      
      //(9:29)in this we find current or last message from prevConvs (to set the last message on left side below username)
      setConversations( prevConvs => { 
        const updatedConversations = prevConvs.map(conversation => {
        if(conversation._id === selectedConversation._id){
          return {
             ...conversation,
              lastMessage: {
                text: messageText,
                sender:data.sender
              }
          }
        }
        return conversation;  //if conversation id is not equal to selected conversation id then return the conversation as it is.
      }) 
      return updatedConversations;  
    })
      setMessageText("");

    } catch (error) {
      showToast("Error",error.message,"error");
    }
  }
  return (
    <>
        <form onSubmit={handleSendMessage} >
        <InputGroup>
            <Input  w={'full'} placeholder="Type a message" onChange={(e)=> setMessageText(e.target.value)} value={messageText} />
            <InputRightElement onClick={handleSendMessage} cursor={"pointer"} >
                <IoSendSharp  />
            </InputRightElement>
        </InputGroup>
        </form>
        
    </>
  )
}

export default MessageInput; 