import { Avatar, Divider, Flex, Text } from "@chakra-ui/react"

const Comment = ({reply, lastReply}) => {



  return (
    <>
        <Flex gap={4} py={2} w={"full"} >
            <Avatar src={reply.userProfilePic} size={"sm"} />
            <Flex flex={1} flexDirection={"column"} gap={2} >
                <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"} >
                    <Text fontWeight={"bold"} fontSize={"sm"} >{reply.username}</Text>
                </Flex>
                <Text>{reply.text}</Text>
            </Flex>
        </Flex>
        {
          !lastReply ? ( <Divider /> ) : null  //if there in last reply then we not show the devider line
        }
    </>

  )
}

export default Comment;