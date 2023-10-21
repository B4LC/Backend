import saveToIPFS from "../config/ipfs";

export async function uploadFile(filePath: string) {
    const cid = await saveToIPFS(filePath);
    return cid;
}