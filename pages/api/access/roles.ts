import S3 from "aws-sdk/clients/s3";

export default async function handler(req, res) {
  //Find the absolute path of the json directory
  // const jsonDirectory = path.join(process.cwd(), 'data');
  //Read the json data file data.json
  // const fileContents = await fs.readFile(jsonDirectory + '/roles.json', 'utf8');
  //Return the content of the data file in json format

  const s3 = new S3({
    region: process.env.ACCESS_REGION,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  });

  const fileParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: process.env.ROLES_FILE,
  }

  const data = (await (s3.getObject(fileParams).promise())).Body.toString('utf-8')
  res.status(200).json(JSON.parse(data));
}