import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  // HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import useShowToast from '../hooks/useShowToast';
import userAtom from '../atoms/userAtom';

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);

  const setAuthScreen =  useSetRecoilState(authScreenAtom);

  const setUser = useSetRecoilState(userAtom);

  const showToast = useShowToast();

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const handlerLogin = async ()=> {

    try {

      const res = await fetch("/api/users/login",{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify(inputs),
      });

      const data = await res.json();

      if(data.error) {
        showToast("Error", data.error,"error");
        return;
      }

      localStorage.setItem("user-threads", JSON.stringify(data));
      console.log(data);
      setUser(data); //update the user state and naviagte to home page
      
      
    } catch (error) {
      showToast("Error", error,"error");
    }

  }

  return (
    <Flex
       
      align={'center'}
      justify={'center'}
       >
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            LogIn
          </Heading>
 
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.dark')}
          boxShadow={'lg'}
          p={8} w={{base:"full",sm:"400px"}} >
          <Stack spacing={4}>

             
               
              <Box>
                <FormControl id="lastName" isRequired >
                  <FormLabel >username Name</FormLabel>
                  <Input type="text" value={inputs.username} onChange={(e)=> setInputs((inputs) => ({...inputs, username:e.target.value}))} />
                </FormControl>
              </Box>
             
             
            <FormControl   isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={inputs.password} onChange={(e)=> setInputs((inputs) => ({...inputs, password:e.target.value}))}  />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>


            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                size="lg"
                bg={useColorModeValue("gray.600","gray.700")}
                color={'white'}
                _hover={{
                  bg: useColorModeValue("gray.700","gray.800"),
                }}
                   onClick={handlerLogin}>
                logIn
              </Button>
            </Stack>
            <Stack pt={6}>
              <Text align={'center'}>
                Don&apos;t have an account? <Link color={'blue.400'}
                onClick={()=>setAuthScreen("signup")} >
                SignUp
                </Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}