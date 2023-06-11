import React from 'react'
import { 
  Container,
  Box, 
   Text, 
   Tab,
   Tabs, 
   TabList, 
   TabPanel,
   TabPanels 
  }
    from "@chakra-ui/react";

import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";


export const HomePage = () => {
  return (
    <Container maxW="xl" centerContent> 
      <Box
       d='flex'
       justifyContent='center'
       textAlign='center'
       p={3}
       bg={'white'}
       w='100%'
       m='40px 0 15px 0'
       borderRadius='lg'      
       borderWidth='1px'

      >
          <Text fontSize='4xl' font-family='work sans'>Chit-Chatra</Text>
      </Box>
      <Box bg='white' w='100%' p={4} borderRadius='lg' borderWidth='1px' >
        <Tabs variant='soft-rounded'>
        {/* mb -> marginBottom */}
          <TabList mb='1em'>
            <Tab width='50%'>Login</Tab>
            <Tab width='50%'>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
             <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}
