// import the necessary node libraries
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from "next"
import puppeteer from 'puppeteer';
import handlers from 'handlebars';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // extract the customer name from the req.body object
  // and also set a default name with the logical operator
  
  // const { name } = JSON.parse(req.body);
  

  try {

    console.log("GENERATE:::"+JSON.stringify(req.body))
    const invoiceDetail = req.body;
    console.log("invoiceDetail::"+JSON.stringify(invoiceDetail))
    //Now make the generate/detail call to get the latest invoice details for the file getting generated

    const customerName = {name: "RRRR", age: "24", items: [{name: "111"}, {name: "222"}]};
    // read our invoice-template.html file using node fs module
    const file = fs.readFileSync('templates/invoice/invoice.html', 'utf8');

    // compile the file with handlebars and inject the customerName variable
    const template = handlers.compile(`${file}`);
    const html = template(invoiceDetail);

    // simulate a chrome browser with puppeteer and navigate to a new page
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // set our compiled html template as the pages content
    // then waitUntil the network is idle to make sure the content has been loaded
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // convert the page to pdf with the .pdf() method
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    // send the result to the client
    res.statusCode = 200;
    res.send(pdf);
  } catch (err) {
    console.log("Generate TSS ::"+err)
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};