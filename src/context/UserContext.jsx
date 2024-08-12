import { createContext, useContext, useEffect, useState } from "react";
import appwriteAuth from "../appwrite/auth";
import { useToast } from "@chakra-ui/react";


export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const toast = useToast();

  
 

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await appwriteAuth.currentUser();
      // console.log(data);
      if (data != "User (role: guests) missing scope (account)") {
        setUser(data);
        setLoading(false);
      }
    }

    fetchData().catch(() => setLoading(false));
  }, []);

  async function login({ email, password }) {
    setLoading(true);

    try {
      const res = await appwriteAuth.login({ email, password });
      console.log(res);
      setUser(res);
      toast({
        title: "You are logged in",
        status: "success",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
      return true;
    } catch (error) {
      toast({
        title: "Logging in failed",
        description: error.message,
        status: "error",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
      setLoading(false);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    if (await appwriteAuth.logout()) {
      setUser(null);
      setLoading(false);
      toast({
        title: "Successfully logged out",
        status: "success",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
    } else {
      setLoading(false);
      toast({
        title: "Having difficulty to logging out of you ",
        status: "warning",
        isClosable: true,
        position: "bottom-left",
        duration: 5000,
      });
    }
  }

  async function register({ username, email, password }) {
    setLoading(true);

    try {
      const res = await appwriteAuth.signup({ username, email, password });
      setUser(res);
      toast({
        title: "Account created",
        description: "You are logged in",
        status: "success",
        isClosable: true,
        position: "top",
        duration: 5000,
      });
      return true;
    } catch (error) {
      if (
        error.message ==
        "A user with the same id, email, or phone already exists in this project."
      )
        toast({
          title: "Username already exists",
          status: "error",
          isClosable: true,
          position: "top",
          duration: 5000,
        });
      else
        toast({
          title: "Signing Up failed",
          description: error.message,
          status: "error",
          isClosable: true,
          position: "top",
          duration: 5000,
        });
      return false;
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoading, setLoading, login, logout, register }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
