import axios from "axios";
import fs from 'fs';
import FormData from 'form-data';
require("dotenv").config();
const JWT = process.env.PINATA_JWT;

const saveToIPFS = async (url: string) => {
  try {
    const res = await axios.get(url, {responseType: 'arraybuffer'});
    const fileData = Buffer.from(res.data);
    fs.writeFileSync("./files/tmp.pdf", fileData);
  }
  catch(e) {
    console.log(e);
  }
  const formData = new FormData();
  const file = fs.createReadStream("./files/tmp.pdf")
  // const file = fs.readFileSync(url);
  formData.append("file", file);
  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          // "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT,
        },
      }
    );
    console.log(res.data);
    return res.data.IpfsHash;
  } catch (error) {
    console.log(error);
  }
};
export default saveToIPFS;
