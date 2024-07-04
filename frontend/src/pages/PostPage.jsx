import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useState } from "react";
import Comment from "../components/Comment";

const PostPage = () => {

  const [liked , setLiked] = useState(false);

  return (
    < >
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3} >
          <Avatar src='/zuck-avatar.png' size={"md"} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}  >markZuckerberg</Text>
            <Image src="/verified.png" w="4" h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"} >
          <Text fontSize={"sm"} color={"gray.light"} >1d</Text>
          <BsThreeDots cursor={"pointer"} />
        </Flex>
      </Flex>

      <Text my={3} >Let&apos;s talk about Threads.</Text>

      <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"} >
            <Image src={"/post1.png"} w={"full"}  />
      </Box>

      <Flex gap={3}  my={1}>
        <Actions liked={liked} setLiked={setLiked}  />
      </Flex>

      <Flex gap={2} alignItems={"center"} >
        <Text color={"gray.light"} fontSize={"sm"} >2 replies </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}  ></Box>
        <Text color={"gray.light"} fontSize={"sm"} >{2 + (liked ? 1 : 0 )} likes </Text>
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"} >
        <Flex gap={2} alignItems={"center"} >
          <Text fontSize={"2xl"}  >👋</Text>
          <Text color={"gray.light"} >Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      <Comment comment="Looks really good!" createdAt="2d" likes={54} username="Kent Dodds" useravatar='https://bit.ly/kent-c-dodds'  />
      <Comment comment="Nice thread 😒!" createdAt="1d" likes={37} username="Christian Nwamba" useravatar='https://bit.ly/code-beast'  />
      <Comment comment="Awesome looking 👌" createdAt="7d" likes={42} username="Segun Adebayo" useravatar='https://bit.ly/sage-adebayo'  />

    </>
  )
}

export default PostPage