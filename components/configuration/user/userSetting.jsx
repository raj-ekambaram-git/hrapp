import React, { useEffect, useState } from "react";
import { accountService, userService } from "../../../services";
import {
  Card,
  CardHeader,
  CardBody,
} from '@chakra-ui/react'
import UploadLogo from "./uploadLogo";
import Reminders from "./reminders";
import InvoiceDueReminder from "./invoiceDueReminder";



const UserSetting = (props) => {
  const [user, setUser] = useState();

  useEffect(() => {
    getUserDetails()

  }, []);
  
  const getUserDetails = async () => {
    const userId = userService?.userValue?.id;
    const userResonse = await accountService.userDetails(userId);
    setUser(userResonse)
  }


  return (


    <div>
          <Card variant="userSettingCard">
            <CardHeader>
                Settings
            </CardHeader>
            <CardBody>
                {user?<>
                  <UploadLogo logoPath={user.account?.logoPath}/>
                  <Reminders/>
                  {userService.isAccountAdmin()?<>
                    <InvoiceDueReminder/>
                  </>:<></>}
                </>:<></>}
            </CardBody>
          </Card>
          

      </div>

  );
};

export default UserSetting;
