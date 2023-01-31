import { NextApiRequest, NextApiResponse } from "next";
const fs = require("fs");
const { parse } = require("csv-parse");

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("req.bodyreq.body::"+req.body)
    // let { name, type } = req.body;

    // fs.createReadStream("./migration_data.csv")
    // .pipe(parse({ delimiter: ",", from_line: 2 }))
    // .on("data", function (row) {
    //   console.log(row);
    // })

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

