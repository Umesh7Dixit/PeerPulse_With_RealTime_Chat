import { Avatar, Divider, Flex, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useState } from "react";

const Comment = ({comment,createdAt,likes,username,useravatar}) => {

    const [liked, setLiked] = useState(false);


  return (
    <>
        <Flex gap={4} py={2} w={"full"} >
            <Avatar src={useravatar} size={"sm"} />
            <Flex flex={1} flexDirection={"column"} gap={2} >
                <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"} >
                    <Text fontWeight={"bold"} fontSize={"sm"} >{username}</Text>
                    <Flex  gap={2} alignItems={"center"} >
                        <Text color={"gray.light"} fontSize={"sm"} >{createdAt}</Text>
                        <BsThreeDots/>
                    </Flex>
                </Flex>
                <Text color={"gray.light"} fontSize={"sm"} >{comment}</Text>
                <Actions liked={liked} setLiked={setLiked} />
                <Text color={"gray.light"} fontSize={"sm"} >{likes + (liked?1:0)} likes </Text>
            </Flex>
        </Flex>
        <Divider my={4} />
    </>

  )
}

export default Comment;