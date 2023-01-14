import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  region: "us-east-1",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let { filePath } = req.body;
    const fileParams = {
        Bucket: process.env.BUCKET_NAME,
        Key: filePath,
        Expires: parseInt(process.env.DOCUMENT_VIEW_EXPIRATION), // seconds
      }

    const viewFile = await s3.getSignedUrlPromise("getObject",fileParams)
    console.log("viewFile:::"+JSON.stringify(viewFile))
    res.status(200).json(viewFile)
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