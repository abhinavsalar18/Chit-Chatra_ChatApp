import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Show, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'

const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);

    const handleClick = () => setShow(!show);

    const postDetails = (pics) => {

    };

    const submitHandler = () =>{

    };
  return (
    <VStack>
        <FormControl id='first-name' isRequired={true}>
            <FormLabel>Name</FormLabel>
            <Input 
                placeholder='Enter Your Name'
                onChange={(e) => setName(e.target.value)}
            />
        </FormControl>
        <FormControl id='email' isRequired={true}>
            <FormLabel>Email</FormLabel>
            <Input 
            type={"email"}
                placeholder='Enter Your Email'
                onChange={(e) => setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl id='password' isRequired={true}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                  <Input
                      type={show ? "text" : "password"}
                      placeholder='Enter Your Password'
                      onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='confirmmpassword' isRequired={true}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                  <Input
                      type={show ? "text" : "password"}
                      placeholder='Confirm Password'
                      onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl id='pic'>
            <FormLabel>Upload Your Picture</FormLabel>
            <Input
                type='file'
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
            />
        </FormControl>
        <Button
            colorScheme="blue"
            width="100%"
            style={{marginTop: 15}}
            onClick={submitHandler}
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signup