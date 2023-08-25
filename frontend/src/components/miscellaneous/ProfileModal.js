import { ViewIcon } from '@chakra-ui/icons';
import {Image, Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import {IconButton, Button} from "@chakra-ui/button"
import React from 'react'

export const ProfileModal = ({user, children}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
       {
        children ? (
            <span onClick={onOpen}>{children}</span>
        ) : (
            <IconButton 
                display={{base: "flex"}}
                icon={<ViewIcon />}
                onClick={onOpen}
            />
        )}
          <Modal size="lg" isCentered 
              isOpen={isOpen} onClose={onClose}
            >
              <ModalOverlay />
              <ModalContent height="410px">
                  <ModalHeader>{user.name}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody 
                      display="flex"
                      flexDir="column"
                      alignItems="center"
                      justifyContent="space-between"
                  >
                      <Image
                          borderRadius="full"
                          boxSize="150px"
                          src={user.pic}
                          alt={user.name}
                      >
                      </Image>
                      <Text
                          fontSize={{ base: "28px", md: "30px" }}
                          fontFamily="Work sans"
                          >
                          Email: {user.email}
                      </Text>
                  </ModalBody>

                  <ModalFooter>
                      <Button colorScheme='blue' mr={3} onClick={onClose}>
                          Close
                      </Button>
                      <Button variant='ghost'>Secondary Action</Button>
                  </ModalFooter>
              </ModalContent>
          </Modal>
    </>
  )
}

export default ProfileModal;
