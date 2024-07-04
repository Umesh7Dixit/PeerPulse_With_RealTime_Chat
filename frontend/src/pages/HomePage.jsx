import { Button, Flex } from "@chakra-ui/react"
import { Link } from "react-router-dom";

const HomePage = () => {

    return (
        <Link to={"/markzuckerberg"}>
        <Flex w={"full"} justifyContent={"center"} >
            <Button variant={"solid"} size={"md"} colorScheme={"blue"} >Visit Mark Zuckerberg's profile</Button>
        </Flex>
    </Link>

    );
};

export default HomePage;