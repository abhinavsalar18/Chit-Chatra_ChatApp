import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Show, VStack } from '@chakra-ui/react'
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
const Signup = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleClick = () => setShow(!show);
    const toast = useToast();
    const history = useHistory();
    const validateEmail = () => {
        // console.log("validate email: ", email);
        if(email === null) return;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          toast({
            title : "Invalid Email",
            status: "warning",
            description: "Please enter a valid email address!",
            position: "top-right",
            duration: 3000,
            isClosable: true
          });
        }
      };

    const postDetails = (pics) => {
        setLoading(true);
        if(pics === undefined){
            toast({
                title: 'Image is invalid!',
                description: "Please select a valid image!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom-center"
              });
        }

        // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        // I have made a mistake earlier, I have not copied the full path for image upload
        // I have juts copied the "https://api.cloudinary.com/v1_1/dosgdhlal"
        // And as fetch was not able to find the correct end points therefore it was throwing the 
        // CORS error -> read about it   
        const apiUrl = 'https://api.cloudinary.com/v1_1/dosgdhlal/image/upload';
        
        if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
          const data = new FormData();
          data.append('file', pics);
          data.append('upload_preset', "chat-app");
          data.append('cloud_name', "dosgdhlal");
        
          fetch(apiUrl, {
            method: 'POST',
            body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              setPic(data.url.toString());
              console.log([{url : data.url.toString()}, {data: data}]);
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        }
        else{
            toast({
                title: 'Image is invalid!',
                description: "Please select a valid image!",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: "bottom-center"
              });
              setLoading(false);
              return;
        }
    };

    const submitHandler = async () =>{
        setLoading(true);
        if(!name || !email || !password || !confirmPassword){
            toast({
                title : "Please fill all the fields!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom-center'
            });
            setLoading(false);
            return;
        }

        if(password !== confirmPassword){
            toast({
                title : "Passwords do not match!",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: 'bottom-center'
            });
            return;
        }

        try{
            // this configuration is for post method while sending data to backend
            const config = {
                headers: {
                    "Content-type" : "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user",
                {name, email, password, pic}, 
                config);
                toast({
                    title: "Registration successful!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-center"
                });

                // storing the data into local storage
                localStorage.setItem("userInfo", JSON.stringify(data));
                history.push("/chats");
                setLoading(false);
        } catch(err){
            toast({
                title: "Error occured!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-center"
            });
            setLoading(false);
            console.log(err);
        }
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
                onBlur={validateEmail}
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
            isLoading={loading}
        >
            Sign Up
        </Button>
    </VStack>
  )
}

export default Signup