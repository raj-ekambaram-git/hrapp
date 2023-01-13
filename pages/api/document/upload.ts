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
    console.log("req.body::"+JSON.stringify(req.body))
    let { name, type } = req.body;

    const fileParams = {
        Bucket: process.env.BUCKET_NAME,
          Key: "images/"+name,
        ContentType: type,
        Expires: 60, // seconds
      }

    const post = await s3.getSignedUrlPromise("putObject",fileParams)
      

      console.log("post:::"+post.toString())

    res.status(200).json(post)
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