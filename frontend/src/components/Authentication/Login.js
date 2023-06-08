import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false);

    const handleClick = () => setShow(!show);
    const submitHandler = () => {
        // alert("Submitted");
    };

    const guestHandler = () => {
        setEmail("guest@example.com");
        setPassword("123456");
        // alert("Guest handler");
    };
  return (
    <VStack>
        <FormControl id="email" isRequired={true}>
            <FormLabel>Email</FormLabel>
            <Input 
                type="email"
                placeholder="Enter Your Email"
                onChnage={(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id="password" isRequired={true}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input 
                    type={show ? "text" : "password"}
                    placeholder="Enter Your Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                     <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                              {show ? "Hide" : "Show"}
                          </Button>
                  </InputRightElement>
            </InputGroup>
        </FormControl>
        <Button
            colorScheme="blue"
            width="100%"
            style={{marginTop: 15}}
            onClick={submitHandler}
        >
           Login
        </Button>
        <Button
            colorScheme='red'
            width='100%'
            style={{marginTop: 5}}
            onClick={guestHandler}
        >
        Get Guest User Credentials
        </Button>
    </VStack>
  )
}

export default Login