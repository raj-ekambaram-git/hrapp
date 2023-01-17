import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  region: process.env.ACCESS_REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let { filePath } = req.body;
    console.log("filePath:::"+JSON.stringify(filePath))
    const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: filePath,
      }

    const deleteFile = await s3.deleteObject(fileParams)
    console.log("deleteFile::"+deleteFile.toString())
    res.status(200).json({message: "successfully deleted file"})
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "8mb", // Set desired value here
    },
  },
};