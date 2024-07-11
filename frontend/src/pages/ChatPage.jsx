import { SearchIcon } from "@chakra-ui/icons"
import { Box, Button, Flex, Input,SkeletonCircle,Text, useColorModeValue } from "@chakra-ui/react"
import Conversation from "../components/Conversation"
import MessageContainer from "../components/MessageContainer"
// import GiConversation from 'react-icons/gi'

const ChatPage = () => {
  return (
    <Box position={'absolute'} 
         left={"50%"}
         w={{
            base:"100%",
            md:"80%",
            lg:"750px",
         }}
         p={4}
         transform={"translateX(-50%)"} >
            <Flex gap={4}  
                  flexDirection={{
                    base:"column",
                    md:"row",
                  }}
                  maxW={{
                    sm:"400px",
                    md:"full",
                  }}
                  mx={"auto"}   >
                <Flex flex={30}  
                      gap={2}
                      flexDirection={"column"}
                      maxW={{
                        sm:"250px",
                        md:"full",
                      }} 
                      mx={"auto"} > 
                    <Text fontWeight={700} color={useColorModeValue("gray.600","gray.400")}  >
                        Your Conversation
                    </Text>
                    <form>
                        <Flex alignItems={"center"} gap={2}  >
                            <Input placeholder="Search User" />
                            <Button size={'sm'} >
                                <SearchIcon/>
                            </Button>
                        </Flex>
                    </form>

                    {false && 
                       [0,1,2,3 ,4,5].map((_,i)=>(
                        <Flex key={i} gap={4} alignItems={'center'} p={'1'} borderRadius={'md'} >
                            <Box>
                                {/* to show user image */}
                                <SkeletonCircle size={'10'} />  
                            </Box>
                            <Flex w={'full'} flexDirection={'column'} gap={3}  >
                                {/* to show 1 username and 2 message text */}
                                <SkeletonCircle h={'10px'} w={'80px'}  />
                                <SkeletonCircle h={'8px'} w={'90%'} />
                            </Flex>
                        </Flex>
                       ))}

                       <Conversation/>
                       <Conversation/>
                       <Conversation/>
                       <Conversation/>

                </Flex>

                {/* <Flex
                    flex={70}
                    borderRadius={'md'}
                    p={2}
                    flexDir={'column'}
                    alignItems={'center'}
                    justifyContent={"center"}
                    height={"400px"}
                >
                    {/* <GiConversation size={100} /> */}
                    {/* <Text fontSize={20} > */}
                        {/* Start a conversation to start messaging */}
                    {/* </Text> */}
                {/* </Flex> */} 


                <MessageContainer/>

            </Flex>
    </Box>
  )
}

export default ChatPage