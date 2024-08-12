import { Client, Databases, Query, Storage } from "appwrite";
import conf from "../conf/conf";

class DatabaseServices {
  client;
  databases;
  bucket;
  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }
  // slug == unique document id
  // featured image == id
  // returns document

  async createPost(slug, { title, userId, content, status, featuredImage }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        { title, userId, content, status, featuredImage }
      );
    } catch (error) {
      return error.message;
    }
  }

  // pass slug of particular post
  async updatePost(slug, { title, userId, content, status, featuredImage }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        { title, userId, content, status, featuredImage }
      );
    } catch (error) {
      return error.message;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async getPost(slug) {
    try {
      console.log(slug);

      const res = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async getPosts(userId) {
    try {
      if (userId) {
        const res = await this.databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          [
            Query.equal("status", "active"),
            Query.equal("userId", userId),
            Query.orderDesc("$createdAt"),
          ]
        );
        return res.documents;
      } else {
        const res = await this.databases.listDocuments(
          conf.appwriteDatabaseId,
          conf.appwriteCollectionId,
          [Query.equal("status", "active"), Query.orderDesc("$createdAt")]
        );
        return res.documents;
      }
    } catch (error) {
      throw error;
    }
  }
}

const databaseService = new DatabaseServices();
export default databaseService;
