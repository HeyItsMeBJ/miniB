import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  Textarea,
  useColorModeValue,
  FormHelperText,
  useToast,
  Spacer,
} from "@chakra-ui/react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";

import appwriteDatabase from "../../appwrite/database";
import appwriteStorage from "../../appwrite/storage";
import { useUserContext } from "../../context/UserContext";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewPost({ onModalClose }) {
  // const { addPost, isLoading } = useAddPost();
  const { user } = useUserContext();
  const toast = useToast();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const slugMaker = (title) => {
    const currentDate = new Date();
    const currentSeconds = currentDate.getSeconds();
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/\-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 10)
      .concat(`-${user?.$id || Math.random() * 1000000}`)
      .slice(0, 20)
      .concat(
        `-${currentDate.getFullYear()}${
          currentDate.getMonth() + 1
        }${currentDate.getDate()}-${currentSeconds}`
      )
      .slice(0, 30);
  };

  const handleAddPost = async (data) => {
    try {
      setLoading(true);
      const featuredImage = await appwriteStorage.uploadFile(data.image[0]);
      const post = await appwriteDatabase.createPost(slugMaker(data.title), {
        title: data.title,
        userId: user.$id,
        content: data.content,
        status: "active",
        featuredImage: featuredImage.$id,
      });
      console.log(post);
      toast({
        title: "Posted!! ",
        status: "success",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
      navigate(`/posts/${post.$id}`);
    } catch (error) {
      toast({
        title: "Post Not Created",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <Flex minH={"40vh"} align={"center"} justify={"center"}>
        <Stack spacing={8} mx={"auto"} maxW={"60%"} minW={"60%"} py={12}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Add new post</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack>
              <form onSubmit={handleSubmit(handleAddPost)}>
                <Flex
                  justifyContent={"space-between"}
                  flexDirection={"column"}
                  gap={"20px"}
                  alignItems={"center"}
                >
                  <FormControl id="title">
                    <FormLabel>
                      <Flex
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <FormHelperText
                          as={"span"}
                          color={"whiteAlpha.900"}
                          fontSize={"md"}
                        >
                          Blog Title
                        </FormHelperText>
                        <FormHelperText
                          as={"span"}
                          padding={"10px"}
                          textAlign={"center"}
                        >
                          {watch("title")?.length || 0}/120
                        </FormHelperText>
                      </Flex>
                    </FormLabel>
                    <Input
                      type="text"
                      {...register("title", {
                        required: "Enter The Title",
                        maxLength: {
                          value: 120,
                          message: "Characteres should be in limit",
                        },
                      })}
                    />
                    <FormHelperText>
                      <Flex
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Box as="span">
                          Eg: The Art of Effective Communication
                        </Box>
                        <Box as="span" color={"red.300"}>
                          {errors?.title?.message}
                        </Box>
                      </Flex>
                    </FormHelperText>
                  </FormControl>

                  <FormControl id="image">
                    <FormLabel> Upload Image</FormLabel>
                    <Input
                      variant="unstyled"
                      py={2}
                      px={4}
                      borderRadius="md"
                      border="1px solid"
                      borderColor="gray.200"
                      width={"fit-content"}
                      display={"flex"}
                      justifyContent={"space-around"}
                      alignItems={"center"}
                      _hover={{
                        borderColor: "gray.400",
                      }}
                      _focus={{
                        borderColor: "blue.500",
                        boxShadow: "outline",
                      }}
                      type="file"
                      accept="image/png, image/jpg, image/jpeg, image/gif"
                      {...register("image", {
                        required: "Image Is Required",
                        validate: {
                          checkFileType: (file) =>
                            [
                              "image/png",
                              "image/jpg",
                              "image/jpeg",
                              "image/gif",
                            ].includes(file[0]?.type) ||
                            "Invalid file type. Only PNG, JPG, JPEG, and GIF are allowed.",
                          checkFileSize: (file) =>
                            file[0]?.size <= 2 * 1024 * 1024 || // 2 MB limit
                            "File size must be less than 2 MB",
                        },
                      })}
                    />
                    <FormHelperText>
                      <Flex
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Box as="span">
                          Choose File From System And Size Less Than 2MB
                        </Box>
                        <Box as="span" color={"red.300"}>
                          {errors?.image?.message}
                        </Box>
                      </Flex>
                    </FormHelperText>
                  </FormControl>

                  <FormControl id="content">
                    <FormLabel> Content</FormLabel>
                    <Textarea
                      placeholder='I know writing can be tough, Just type "blah blah blah" to test things out!'
                      as={TextareaAutosize}
                      minRows={5}
                      resize={"none"}
                      {...register("content", {
                        required: "Give Some Description",
                      })}
                    />
                    <FormHelperText>
                      <Flex
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        <Box as="span">Explain Your Post</Box>
                        <Box as="span" color={"red.300"}>
                          {errors?.content?.message}
                        </Box>
                      </Flex>
                    </FormHelperText>
                  </FormControl>
                </Flex>
                <Stack spacing={20} marginTop={"20px"}>
                  <Button
                    mt={"10px"}
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    type="submit"
                    isLoading={isLoading}
                    loadingText="Posting..."
                  >
                    POST
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
