import { Client, Account, ID } from "appwrite";
import conf from "../conf/conf";

class Auth {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async signup({ email, password, username }) {
    {
      try {
        const useracc = await this.account.create(
          ID.unique(),
          email,
          password,
          username
        );
        if (useracc) return await this.login({ email, password });
        else return useracc;
      } catch (error) {
        throw error;
      }
    }
  }

  async login({ email, password }) {
    try {
      const res = await this.account.createEmailPasswordSession(
        email,
        password
      );
      console.log(res);
      return res;
    } catch (error) {
      throw error;
    }
  }

  async currentUser() {
    try {
      const res = await this.account.get();
      return res;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      return error.message;
    }
  }
}

const auth = new Auth();

export default auth;
