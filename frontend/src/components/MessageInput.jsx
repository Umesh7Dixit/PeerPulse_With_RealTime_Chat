import { Flex, Image, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react"
import { useRef, useState } from "react";
import {IoSendSharp} from "react-icons/io5";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from '../hooks/usePreviewImg';

const MessageInput = ({setMessages}) => {

  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const {onClose} = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const [isSending, setIsSending] = useState(false);//handle if user press send button multiple time

  const handleSendMessage = async (e) => {
    e.preventDefault(); //it doesn't refresh the page when we submit
    if(!messageText && !imgUrl)return //we don't want to send empty messages to db
    if(isSending)return;

    setIsSending(true);

    try {
      const res = await fetch("/api/messages",{method:"POST",
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({
          message:messageText,
          recipientId: selectedConversation.userId,
          img : imgUrl,
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
      setImgUrl("");

    } catch (error) {
      showToast("Error",error.message,"error");
    } finally{
      setIsSending(false);
    }
  }
  return (
		<Flex gap={2} alignItems={"center"}>
			<form onSubmit={handleSendMessage} style={{ flex: 95 }}>
				<InputGroup>
					<Input
						w={"full"}
						placeholder='Type a message'
						onChange={(e) => setMessageText(e.target.value)}
						value={messageText}
					/>
					<InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
						<IoSendSharp />
					</InputRightElement>
				</InputGroup>
			</form>
			<Flex flex={5} cursor={"pointer"}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
			</Flex>
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
							{!isSending ? ( //if we not sending the image then show button else show spinner
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	);
};

export default MessageInput;





 



