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
    let { name, type } = req.body;
    const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: name,
        ContentType: type,
        Expires: parseInt(process.env.DOCUMENT_VIEW_EXPIRATION), // seconds
      }

    const uploadedFile = await s3.getSignedUrlPromise("putObject",fileParams)
    res.status(200).json(uploadedFile)
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