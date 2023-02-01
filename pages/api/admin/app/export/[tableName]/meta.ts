import { TimesheetStatus, TimesheetType } from ".prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../lib/prisma";




export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const tableName = req.query?.tableName;
    const accountId = req.query?.accountId;
    const columNames = await prisma.$queryRaw`
    select colns.column_name, colns.data_type, constr.foreign_table_name, pgi.indexname, colns.table_name from information_schema.columns as colns
      LEFT OUTER JOIN (SELECT
        tc.table_schema, 
        tc.constraint_name, 
        tc.table_name, 
        kcu.column_name, 
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
    FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' ) as constr
      on constr.column_name = colns.column_name
      and constr.table_name = colns.table_name
    LEFT OUTER JOIN pg_indexes pgi
	    on pgi.tablename = colns.table_name
	  and pgi.indexname like '%'||colns.column_name||'%'
    where colns.table_name = ${tableName}`
    
    res.status(200).json(columNames);

  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
};

