import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { util } from "../../../helpers/util";


export default function FinancialSummary(props) {
  useEffect(() => {
    if(props.project) {
      financialSummaryData();
    }    
  }, []);
  


  function financialSummaryData() {

    
  }

  return (
    <>    
      <Card variant="projectFinancialSummary">
        <CardHeader>
          <Heading size='xs'>Summary as of {util.getFormattedDate(new Date())}</Heading>
        </CardHeader>
        <CardBody>
        </CardBody>
      </Card>
    </>
  );
}
