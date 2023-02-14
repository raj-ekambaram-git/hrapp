// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next"
import { util } from "../../../../../../helpers";
import prisma from "../../../../../../lib/prisma";


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }



  try {
  
    const {featureConfigData} = req.body;

    console.log("featureConfigData:::"+JSON.stringify(featureConfigData));
    if(featureConfigData.accountId && featureConfigData.id) {
      const updateData = {
        id: featureConfigData.id,
        configuration: {}
      };
      const processorKey = util.getConfigHash(featureConfigData.configuration.processorKey, false)
      if(processorKey.configurationSalt) {
        const processorSecret = util.getConfigHash(featureConfigData.configuration.processorSecret, processorKey.configurationSalt)
        if(processorSecret) {
          const configData = {};
          configData["processor"] = featureConfigData.configuration.processor
          configData["processorConsent"] = featureConfigData.configuration.processorConsent
          configData["processorKey"] = processorKey.configurationHash
          configData["processorSecret"] = processorSecret.configurationHash
          configData["salt"] = processorKey.configurationSalt

          updateData.configuration = configData
        }
      } else {
        res.status(400).json({ message: 'Something went wrong while updating' })
      }

      console.log("updateData:::"+JSON.stringify(updateData))
      const savedAccountFeature = await prisma.accoutFeatures.update({
        where: {
          id: updateData.id,
        },
        data: updateData
      });
      console.log("savedAccountFeature::::"+JSON.stringify(savedAccountFeature))
      res.status(200).json(savedAccountFeature);
     
    }else {
      res.status(200).json(null);
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({ message: 'Something went wrong while updating' })
  }
}
