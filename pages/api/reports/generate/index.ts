// import the necessary node libraries
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from "next"
import puppeteer from 'puppeteer';
import handlers from 'handlebars';
import { util } from '../../../../helpers/util';


export default async (req: NextApiRequest, res: NextApiResponse) => {
  // extract the customer name from the req.body object
  // and also set a default name with the logical operator
  
  // const { name } = JSON.parse(req.body);
  

  try {

    console.log("REPORTS GENERATE:::"+JSON.stringify(req.body))
    const {documentData} = req.body;
    const {templateName} = req.body;
    const {templateCSS} = req.body;
    console.log("documentData::"+JSON.stringify(documentData))
    console.log("templateName::"+JSON.stringify(templateName))
    console.log("templateCSS::"+JSON.stringify(templateCSS))
    //Now make the generate/detail call to get the latest invoice details for the file getting generated

    // read our invoice-template.html file using node fs module
    const file = fs.readFileSync(templateName, 'utf8');

    // compile the file with handlebars and inject the customerName variable
    const template = handlers.compile(`${file}`);
    handlers.registerHelper('dateFormat', util.getFormattedDate)
    handlers.registerHelper('isOdd', util.isOdd)
    const html = template(documentData);

    // simulate a chrome browser with puppeteer and navigate to a new page
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disabled-setupid-sandbox"],
    });
    const page = await browser.newPage();
    // set our compiled html template as the pages content
    // then waitUntil the network is idle to make sure the content has been loaded
    await page.setContent(html, { waitUntil: 'networkidle0' });
    if(templateCSS) {
      await page.addStyleTag({ path: templateCSS })
    }
    

    // convert the page to pdf with the .pdf() method
    const pdf = await page.pdf({ format: 'A4', printBackground: true });
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