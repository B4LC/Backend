import axios from "axios";
import { Web3Storage } from "web3.storage";
require('dotenv').config;

const saveToIPFS = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  
  var config = {
    method: "post",
    url: process.env.WEB3_STORAGE_URL,
    headers: {
      Authorization: `Bearer ${process.env.WEB3_STORAGE_KEY}`,
      "Content-Type": "text/plain",
    },
    data: formData,
  };

  const response = await axios(config);
  console.log(response.data.cid);
  return response.data.cid;
};

export default saveToIPFS;
