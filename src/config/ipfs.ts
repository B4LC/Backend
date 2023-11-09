//@ts-nocheck
import { File, Web3Storage } from "web3.storage";
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
  const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
  const response = await fetch(filePath);
  console.log(response.url);
  
  const arrayBuffer = await response.arrayBuffer();
  const imageData = new Uint8Array(arrayBuffer);

  // Process the image data as needed
  console.log("Image data:", imageData);
  const file = new File([imageData], fileName);
  console.log(file);
  
  const cid = await client.put([file], { wrapWithDirectory: false });
  return cid;
};

export default saveToIPFS;
