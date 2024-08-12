import React, { useContext } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { UserContext, UserContextProvider } from "./context/UserContext";
import PostList from "./components/layout/PostList";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CurrentPost from "./components/layout/CurrentPost";
import NewPost from "./components/posts/NewPost";
import Home from "./components/layout";
import MyPostList from "./components/layout/MyPostList";
function App() {
  const { user } = useContext(UserContext);
 

  return (
    <ChakraProvider>
      <RouterProvider
        router={createBrowserRouter([
          {
            path: "/",
            element: <Home />,
            children: [
              { path: "/", element: <PostList /> },
              { path: "/login", element: <Login /> },
              { path: "/register", element: <Register /> },
              { path: "/posts/:postId", element: <CurrentPost /> },
              { path: "/posts/create-post", element: <NewPost /> },
              { path: "/user-posts", element: <MyPostList userId={user?.$id} /> },
            ],
          },
        ])}
      />
    </ChakraProvider>
  );
}

export default App;
