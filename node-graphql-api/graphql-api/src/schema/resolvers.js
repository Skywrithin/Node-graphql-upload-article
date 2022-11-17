import { Storage } from "@google-cloud/storage";
import { gql } from "apollo-server-express";
import path from "path";

const bucketName = 'minted-nfts'
import test from "../remotify-secret-key.json"

let Data = [];

const storage =  new Storage({
  keyFilename: "./src/remotify-secret-key.json",
  projectId: bucketName
});

async function createBucket() {
  await storage.createBucket('owl-testbucket');
  // await storage.getBuckets('owl-testbucket')
  // console.log(`Bucket ${bucketName} created.`)
}


export const Query = {
  
  getUser: () => {
    createBucket().catch(console.error)
    return Data;
  },
  
  readBucket: ()=> {
    return Data;
  },
};

const removeWhiteSpaces = (name) => {
  let newName = name.replace(/\s+/g, "");

  return newName;
};

export const Mutation = {
  createUser: async (_, { username, image }) => {
    const bucketName = BUCKET ; // our GCS bucket name, should be in kept in our .env file

    const storage = new Storage({
      keyFilename: path.join(__dirname, "../../../../key.json"),
    });
  
  // testCall: async (_, {username, image}) => {

  // }

    const { filename, createReadStream } = await image;

    let sanitizedName = removeWhiteSpaces(filename);
    await new Promise((resolve, reject) => {
      createReadStream().pipe(
        storage
          .bucket(bucketName)
          .file(sanitizedName)
          .createWriteStream()
          .on("finish", () => {
            storage
              .bucket(bucketName)
              .file(sanitizedName)
              .makePublic()
              .then(() => {
                //empties the db-storage-like array :)
                Data = [];
                // pushes a new data into the db-storage-like array :)
                Data.push({
                  id: Math.ceil(Math.random() * 100),
                  username: username,
                  imageuri: `https://storage.googleapis.com/${bucketName}/${sanitizedName}`,
                });
                resolve(Data);
              })
              .catch((e) => {
                reject((e) => console.log(`exec error : ${e}`));
              });
          })
      );
    });
  },


  deleteUser: (_, {}) => {
    Data = [];

    if (Data.length < 1) {
      return true;
    } else {
      return false;
    }
  },
};
