import React, {useEffect, useState} from "react";
import {
  Box,
  Heading,
  Link,
  Image,
  Text,
  Container,
  Divider,
  Grid,
  GridItem,
  IconButton,
  Spinner,
  flexbox,
  Center
} from "@chakra-ui/react";
import {motion} from "framer-motion";
import {Link as routerLink, useParams} from "react-router-dom";

import {doc, onSnapshot} from "firebase/firestore";
import {AiOutlineRollback} from "react-icons/ai";

import Navbar from "./Navbar";
import { useToast } from "@chakra-ui/react";
import appwriteDatabase from '../../appwrite/database'
import appwriteStorage from '../../appwrite/storage'


export default function CurrentPost() {
  const {postId} = useParams();
  const [currentPost, setCurrentPost] = useState();


 

  const toast = useToast();
  const [isLoading, setLoading] = useState(true);
  const [image, setImage] = useState();

  const loadPost = async () => {
    try {
      setLoading(true);
      const res = await appwriteDatabase.getPost(postId);
      setCurrentPost(res);
    } catch (error) {
      toast({
        title: "Post Not Found",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
    }
  };

  const loadImage = async () => {
    try {
      const res = await appwriteStorage.previewFile(currentPost?.featuredImage);
      setImage(res.href);
    } catch (error) {
      toast({
        title: "Image Not Found",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
   if(!currentPost) loadPost().finally(() => setLoading(false));
   if(currentPost?.featuredImage) loadImage();

  }, [currentPost]);


  if (isLoading)
    return (
      <Box pos="absolute" top="50%" left="50%" >
        <Spinner size="xl" />
      </Box>
    );
  return (
    <>
    
      <motion.div layout>
        <Container maxW={"7xl"} p='12'>
          <motion.button
            whileHover={{
              scale: 1.2,
              transition: {duration: 1},
            }}
            whileTap={{scale: 0.9}}
          >
            <IconButton
              colorScheme='#319594'
              as={routerLink}
              to={'/'}
              size='lg'
              icon={<AiOutlineRollback />}
              isRound
              variant='ghost'
            />
          </motion.button>
          <Heading as='h2'>{currentPost.title}</Heading>

          <Divider marginTop='5' />
          <Grid
            templateColumns='repeat(auto-fill, minmax(100%, 1fr))'
            gap={6}
            marginTop='5'
          >
            <GridItem>
              <Box w='100%'>
                <Box borderRadius='lg' overflow='hidden'>
                  <Link textDecoration='none' _hover={{textDecoration: "none"}}>
                    <Image
                      transform='scale(1.0)'
                      src={image}
                      alt='blog image here'
                      width='auto'
                      height={"auto"}
                      objectFit='cover'
                      transition='0.3s ease-in-out'
                      _hover={{
                        // transform: "scale(1.05)",
                        borderColor:'red',
                        borderWidth:'1px',
                        borderStyle:'solid',
                      }}
                    />
                  </Link>
                </Box>
                <Text as='p' fontSize='md' marginTop='2'>
                  {currentPost.content}
                </Text>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </motion.div>
    </>
  );
}
