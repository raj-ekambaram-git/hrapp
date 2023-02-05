import React, { useEffect, useState } from "react";
import { userService } from "../../../services";
import {
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'
import ManageDocuments from "../../document/manageDocuments";
import { DocumentConstants } from "../../../constants";
import { useDispatch } from "react-redux";
import { setDocumentType } from "../../../store/modules/Document/actions";



const AccountDocuments = (props) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState();

  const [isPageAuthprized, setPageAuthorized] = useState(false);


  useEffect(() => {
    if(userService.isSuperAdmin() || userService.isAccountAdmin() ) {
      setPageAuthorized(true);
    }
    const documentData = {
      type: DocumentConstants.DOCUMENMT_TYPE.Template,
      typeId: parseInt(userService.getAccountDetails().accountId),
      typeName: "Account"
    }
    
    dispatch(setDocumentType(documentData))

  }, []);
  


  return (


    <div>
      {isPageAuthprized?<>
        <Card variant="userSettingCard">
            <CardHeader>
                Document Templates for eSignatures
            </CardHeader>
            <CardBody>      
              <ManageDocuments/>          
            </CardBody>
          </Card>
      </>:<></>}
      </div>

  );
};

export default AccountDocuments;
