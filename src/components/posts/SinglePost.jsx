import React from "react";
import {
  Box,
  Heading,
  Link,
  Image,
  Text,
  Avatar,
  Flex,
  IconButton,
} from "@chakra-ui/react";

import { formatDistanceToNow } from "date-fns";
import { AiTwotoneHeart, AiOutlineHeart, AiFillDelete } from "react-icons/ai";

import { Link as routerLink } from "react-router-dom";

import { useUserContext } from "../../context/UserContext";
import appwriteStorage from "../../appwrite/storage";
import { useState, useEffect } from "react";

const SinglePost = ({ post }) => {
  const { user, isLoading } = useUserContext();
  const [image, setImage] = useState();

  const loadImage = async () => {
    try {
      const res = await appwriteStorage.previewFile(post.featuredImage);
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

  function dateDifference(updatedAt) {
    const currentDate = new Date();
    const updatedDate = new Date(updatedAt);

    const differenceInMs = currentDate - updatedDate;

    const differenceInDays = Math.round(differenceInMs / (1000 * 60 * 60 * 24));

    return Math.max(1, differenceInDays);
  }

  useEffect(() => {
    loadImage();
  }, []);

  // const {id, likes, uid} = post;
  // const isLiked = likes.includes(user?.id);
  // const {toggleLike, isLoading} = useToggleLike({
  //   id,
  //   isLiked,
  //   uid: user?.id,
  // });
  // const {deletePost, isLoading: deleteLoading} = useDeletePost(id);
  // const {user: users, isLoading: userLoading} = useUser(uid);

  return (
    <>
      <Box w="100%" key={post.$id}>
        <Link
          textDecoration="none"
          _hover={{ textDecoration: "none" }}
          to={`/posts/${post?.$id}`}
          as={routerLink}
        >
          <Box borderRadius="lg" overflow="hidden">
            <Image
              transform="scale(1.0)"
              src={image}
              alt="some text"
              width="100%"
              objectFit="cover"
              height={"400px"}
              transition="0.3s ease-in-out"
              _hover={{
                transform: "scale(1.05)",
              }}
            />
          </Box>
        </Link>
        <Heading fontSize="xl" marginTop="2">
          <Link
            textDecoration="none"
            _hover={{ textDecoration: "none" }}
            as={routerLink}
            to={`/posts/${post?.$id}`}
          >
            {post.title}
          </Link>
        </Heading>
        <Text as="p" fontSize="md" marginTop="2">
          {post.content.substring(0, 150)}...
        </Text>
        <Box mt={"10px"}>
          <Flex align={"center"}>
            <Avatar name={user?.name} size={"sm"} />
            <Text casing={"capitalize"}>
              <span style={{ paddingLeft: "10px" }}>
                Last Updated: {dateDifference(post.$updatedAt)} days ago
              </span>
            </Text>
            <IconButton
              colorScheme="red"
              // onClick={toggleLike}
              // isLoading={authLoading || isLoading}
              size="md"
              // icon={isLiked ? <AiTwotoneHeart /> : <AiOutlineHeart />}
              isRound
              variant="ghost"
            />
            {/* <Text> {likes.length}</Text> */}
            {/* {!authLoading && user?.id === uid && (
              <IconButton
                colorScheme='red'
                size='lg'
                icon={<AiFillDelete />}
                isRound
                onClick={deletePost}
                isLoading={deleteLoading}
                variant='ghost'
              />
            )} */}
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default SinglePost;
