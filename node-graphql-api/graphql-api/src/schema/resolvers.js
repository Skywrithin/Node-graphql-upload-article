import { Storage } from "@google-cloud/storage";
import { gql } from "apollo-server-express";
import path from "path";

const bucketName = 'minted-nfts'

let Data = [];

const storage =  new Storage({
  keyFilename: "./src/remotify-secret-key.json",
  projectId:"test-api"
});

async function listBucket() {
  // const data = await storage.getBuckets('owl-test-bucket-01')
  const [files] = await storage.bucket('owl-test-bucket-01').getFiles();
  console.log(files)
  files.forEach(file => console.log(file.name))
  // return files
}
``


export const Query = {
  
  getUser: () => {
    listBucket().catch(console.error)
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
          .on("finish", () => {``
            storage``
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
