import axios from "axios";
import { Web3Storage } from "web3.storage";
import { getFilesFromPath } from "web3.storage";

require("dotenv").config;

const saveToIPFS = async (filePath: string) => {
  // const formData = new FormData();
  // formData.append("file", file);

  // var config = {
  //   method: "post",
  //   url: process.env.WEB3_STORAGE_URL,
  //   headers: {
  //     Authorization: `Bearer ${process.env.WEB3_STORAGE_KEY}`,
  //     "Content-Type": "text/plain",
  //   },
  //   data: formData,
  // };
  // try {
  //   const response = await axios(config);
  //   console.log(response.data.cid);
  //   return response.data.cid;
  // }catch(err) {
  //   console.log(err.message);
  // }

  const client = new Web3Storage({ token: process.env.WEB3_STORAGE_KEY });
  const files = await getFilesFromPath(filePath);
  const cid = await client.put(files, {wrapWithDirectory: false});
  return cid;
};

export default saveToIPFS;
