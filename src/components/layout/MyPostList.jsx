import {
  Box,
  Container,
  Divider,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
  Toast,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { motion, LayoutGroup } from "framer-motion";
import React from "react";
import SinglePost from "../posts/SinglePost";
import { useState, useEffect } from "react";

// import { usePosts } from "../../hooks/posts";
// import {useUser} from "../../hooks/user";

import appwriteDatabase from "../../appwrite/database";

export default function MyPostList({ userId }) {
 
  const toast = useToast();
  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const res = await appwriteDatabase.getPosts(userId);
      setPosts(res);
    } catch (error) {
      toast({
        title: "Posts Not Found",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (userId) loadPosts().finally(() => setLoading(false));
  }, [userId]);

  // const { posts, isLoading } = usePosts();

  // const {user, isLoading: userLoading} = useUser();

  if (isLoading)
    return (
      <Container width={"100vw"} height={"100vh"}>
        <Box pos="absolute" top="50%" left="50%">
          <Spinner size="xl" />
        </Box>
      </Container>
    );

  if (posts.length === 0)
    return (
      <Container width={"100vw"} height={"100vh"}>
        <Box pos="absolute" top="50%" left="50%">
          <Text fontSize={"xl"}>No Posts</Text>
        </Box>
      </Container>
    );

  return (
    <Container maxW={"7xl"} p="12">
      <Heading as="h2" marginTop="5">
        Latest articles
      </Heading>
      <Divider marginTop="5" />
      <Grid
        templateColumns="repeat(auto-fill, minmax(300px, 2fr))"
        gap={6}
        marginTop="5"
      >
        {posts.map((post) => (
          <GridItem key={post.$id}>
            <motion.div layout>
              <SinglePost post={post} />
            </motion.div>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
}
