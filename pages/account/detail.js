import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { accountService, userService } from "../../services";
import {
  Stack,
  Flex,
  Accordion,
  HStack
} from '@chakra-ui/react';
import AccountDetailSection from "../../components/account/detail/accountDetailSection";
import AccountEINSection from "../../components/account/detail/accountEINSection";
import AccountContactDetailSection from "../../components/account/detail/accountContactDetailSection";
import AccountContactAddressSection from "../../components/account/detail/accountContactAddressSection";
import AccountStatusSection from "../../components/account/detail/accountStatusSection";
import AccountActionsSection from "../../components/account/detail/accountActionsSection";
import {PageMainHeader} from '../../components/common/pageMainHeader';
import {PageNotAuthorized} from '../../components/common/pageNotAuthorized';
import { NotesConstants } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { setDocumentType } from "../../store/modules/Document/actions";
import ManageDocuments from "../../components/document/manageDocuments";



const AccountDetail = (props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  // const accountId = props.data.accountId;
  const [isPageAuthprized, setPageAuthorized] = useState(false);
  const [account, setAccount] = useState({});
  
  const accountId = useSelector(state => state.account.selectedAccountId);
  
    //To Enable Notes
    const notesData = {
      type: NotesConstants.NOTES_TYPE.Account,
      typeId: parseInt(accountId),
      typeName: account.name
    }

    const documentData = {
      type: NotesConstants.NOTES_TYPE.Account,
      typeId: parseInt(accountId),
      typeName: account.name
    }
  // set default input data
  useEffect(() => {
    // dispatch(resetSelectedAccountId());
      async function getAccountDetailsAPICall() {
        // Call only if the user is SUPER_ADMIN and accountId as zero
        if(userService.isSuperAdmin()) {
          setPageAuthorized(true);
          const accountResponse = await accountService.accountDetail(accountId);
            const accountData =  {
                id: accountResponse.id.toString(),
                name: accountResponse.name,
                description: accountResponse.description,
                ein: accountResponse.ein,
                type: accountResponse.type,
                email: accountResponse.email,
                status: accountResponse.status,
                phone: accountResponse.phone,
                addressId: accountResponse.address&&accountResponse.address.length>0?accountResponse.address[0].id:null,
                addressName: accountResponse.address&&accountResponse.address.length>0?accountResponse.address[0].addressName:null,
                address1: accountResponse.address&&accountResponse.address.length>0?accountResponse.address[0].address1:null,
                address2: accountResponse.address&&accountResponse.address.length>0?accountResponse.address[0].address2:null,
                address3: accountResponse.address&&accountResponse.address.length>0?accountResponse.address[0].address3:null,
                city: accountResponse.address&&accountResponse.address.length>0?accountResponse.address[0].city:null,
                state: accountResponse.address&&accountResponse.address.length>0?accountResponse.address[0].state:null,
                zipCode: accountResponse.address&&accountResponse.address.length>0?accountResponse.address[0].zipCode:null,
                country: accountResponse.address&&accountResponse.address.length>0?accountResponse.address[0].country:null
            };
  
            setAccount(accountData)
        }
  
      }
      getAccountDetailsAPICall();
      dispatch(setDocumentType(documentData))
    
  }, []);

  return (
    <div>
      {isPageAuthprized ? (
        <>
        <PageMainHeader heading="Account Details for" param1={account.name} notesData={notesData}/>
        <Flex marginBottom="1rem">
            <AccountActionsSection />
        </Flex>
        <Flex>
            <Stack width="page.sub_heading_width">
              <Accordion defaultIndex={[0]} variant="mainPage">
                <AccountDetailSection data={{account}}/>
                <AccountEINSection data={{account}}/>
                <AccountContactDetailSection data={{account}}/>
                <AccountContactAddressSection data={{account}}/>
                <AccountStatusSection data={{account}}/>
              </Accordion>         
            </Stack>
        </Flex>
        
       
        </>
      ) : (
        <PageNotAuthorized/>
      )}
    </div>
  );
};

export default AccountDetail;