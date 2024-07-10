import { AddIcon } from "@chakra-ui/icons"
import { Button,Image, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea,Text, useColorModeValue, useDisclosure, Input, Flex, CloseButton } from "@chakra-ui/react"
import { useRef, useState } from "react"
import usePreviewImg from "../hooks/usePreviewImg"
import { BsFillImageFill } from "react-icons/bs"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom"
import useShowToast from "../hooks/useShowToast"
import postsAtom from "../atoms/postsAtom"
import { useParams } from "react-router-dom"

const MAX_CHAR = 500;  //best practice

const CreatePost = () => {
    
    
        const { isOpen, onOpen, onClose } = useDisclosure()
    
        const [postText, setPostText] = useState("");//1
    
        const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    
        const imageRef = useRef(null)
    
        const [remainingChar,setRemainingChar] = useState(MAX_CHAR);

        const user = useRecoilValue(userAtom);

        const showToast = useShowToast();

        const [loading ,setLoading] = useState(false); //to show the loadingwhen post button is pressed
    
        const [posts , setPosts] = useRecoilState(postsAtom);

        const {username} = useParams();

        const handleTextChange = (e)=> {
            const inputText = e.target.value;
    
            if(inputText.length>MAX_CHAR){
                const truncatedText = inputText.slice(0 ,MAX_CHAR  );
                setPostText(truncatedText);
                setRemainingChar(0);
            }else{
                setPostText(inputText);
                setRemainingChar(MAX_CHAR - inputText.length);
            }   
        };

        const handleCreatePost = async()=> {

          setLoading(true);

            try {
                
              const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
              });
    
                const data  = await res.json();
    
                if(data.error) {
                    showToast("Error" , data.error,"error");
                    return ;
                }
                
                showToast("Success" , "Post created successfully" , "success");//2
    
                if(username === user.username)  //if username from params === loggedIn user then set and show the post
                {
                  setPosts([data, ...posts]); //adding the new posts on posts array post1,post2,post3,newpost4
                }

                onClose();  //after creating post automatically close the post window using onClose coming from chakraUI modal
                setPostText(""); //same post hume na dekhe dubara as a suggestion when we click new +post
                setImgUrl(""); 

            } catch (error) {
                showToast("Error", error , "error");
            }finally{
              setLoading(false);
            }
        }
    
      return (
        <>
          <Button onClick={onOpen} position={"fixed"} bottom={10} right={5} size={{base:"sm", sm:"md"}}  bg={useColorModeValue("gray.300","gray.dark")} ><AddIcon/>   </Button>
    
    {/* using chakra UI for model search model and 2 second wala is modal */}
    
    
          <Modal  isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Post</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6} >
                
                <FormControl>

                    <Textarea placeholder="post content goes here..." onChange={handleTextChange} value={postText}    />

                    <Text fontWeight="xs" textAlign={'right'} m={"1"} color={"gray.100"}  >
                        {remainingChar}/{MAX_CHAR}
                    </Text>
                    <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
                    <BsFillImageFill style={{marginLeft:"5px" ,cursor:"pointer" }} size={16} onClick={()=>imageRef.current.click()}  />  
                        {/* to open imput se use BsFillImageFill onClick={()=>imageRef.current.click()} */}
                </FormControl>
    
                {imgUrl && (
                    <Flex mt={5} w={"full"}  position={"relative"}  >
                        <Image src={imgUrl}  alt="selected img" />
                        <CloseButton  onClick={()=>{
                            setImgUrl("");
                        }}
                        bg={"gray.800"}
                        position={"absolute"}
                        top={2}
                        right={2}
                        />
                    </Flex>
                ) }
                
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading} >
                  Post
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
    
        </>
      );
    

}

export default CreatePost;





 