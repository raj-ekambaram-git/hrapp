import React, { useRef, useState } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  useDisclosure,
  useToast,
  CardBody,
  HStack,
  FormControl,
  Card,
  FormLabel,
  Input,
  Select,
  CardFooter,
  Switch,
} from '@chakra-ui/react'

import { Spinner } from "../../common/spinner";
import { EMPTY_STRING } from "../../../constants";
import { VendorConstants } from "../../../constants/vendorConstants";
import { CustomTable } from "../../customTable/Table";
import { userService, vendorService } from "../../../services";
import { PREDEFINED_PREFERENCES } from "../../../data/predefinedPreferences";
import { VendorSettingStatus } from "@prisma/client";
import { DeleteIcon } from "@chakra-ui/icons";


const VendorPreferences = (props) => {

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [size, setSize] = useState(EMPTY_STRING);
  const [loading, setLoading] = useState();
  const [vendorPreferences, setVendorPreferences] = useState([]);
  const vendorPreferencesRef = useRef([]);
  const [enableAddPreference, setEnableAddPreference] = useState(false);
  const [enablePredefinedPreference, setEnablePredefinedPreference] = useState(false);
  const [name, setName] = useState();
  const [key, setKey] = useState();
  const [value, setValue] = useState();

  const PREFERENCES_TABLE_COLUMNS = React.useMemo(() => VendorConstants.VENDOR_PREFERENCES_TABLE_META)


  const handleClick = async (newSize) => {    
    setEnableAddPreference(false)
    setSize(newSize)
    onOpen()
    setLoading(true)
    const responseData = await vendorService.getVendorPreferences(props.vendorId, userService.getAccountDetails().accountId)
    if(responseData && responseData.length>0) {
      vendorPreferencesRef.current = responseData;
      populatePrefernceDataForTable(responseData)
    }
    
    setLoading(false)
  }

  const populatePrefernceDataForTable = (responseData) => {
    const updatedList = responseData.map((preference, index) => {
      preference.deleteAction = <DeleteIcon size="xs" onClick={() => handleUpdatePreference(preference.id, VendorSettingStatus.MarkForDelete, index)}/>;
      if(preference.status === VendorSettingStatus.Active) {
        preference.updateAction = <Switch colorScheme='teal' size='sm' id='pause' isChecked onChange={() => handleUpdatePreference(preference.id, VendorSettingStatus.Inactive, index)} >Mark Inactive</Switch> ;      
      } else {
        preference.updateAction = <Switch colorScheme='red' size='sm' id='pause' isChecked onChange={() => handleUpdatePreference(preference.id, VendorSettingStatus.Active, index)} >Mark Active</Switch> ;      
      }
      
      return preference;
    })

    setVendorPreferences(updatedList)
  }

  const addPredefinedPreference = () => {
    setEnableAddPreference(true)
    setEnablePredefinedPreference(true)
  }

  const addCustomPreference = () => {
    setEnableAddPreference(true)
    setEnablePredefinedPreference(false)
  }

  const handleUpdatePreference = async(id, status, index) => {
    const updateRequest = {
      id: id,
      status: status
    }

    const responseData = await vendorService.updateVendorSetting(updateRequest, userService.getAccountDetails().accountId)

    console.log("responseData::"+JSON.stringify(responseData))
    if(responseData.error) {
      toast({
        title: 'Update Client Preference.',
        description: 'Error  updating client preference, please try again later or contact administrator. Details: '+responseData.errorMessage,
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
      return;
    } else {
      toast({
        title: 'Update Client Preference.',
        description: 'Successfully updated client preference.',
        status: 'success',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
      const newVenorPrefs = [...vendorPreferencesRef.current];
      console.log("newVenorPrefs::"+JSON.stringify(newVenorPrefs))
      if(status === VendorSettingStatus.MarkForDelete) {
        newVenorPrefs.splice(index, 1);
      } else {
        newVenorPrefs[index] = responseData        
      }
      vendorPreferencesRef.current = newVenorPrefs;
      populatePrefernceDataForTable(newVenorPrefs)  
    }
  }

  const handleSavePrference = async() => {
    
    if(name && key && value) {
      const preferenceRequest = {
        displayName: name,
        key: key,
        value: value,
        status: VendorSettingStatus.Active,
        vendorId: props.vendorId
      }

      const responseData = await vendorService.createVendorPreference(preferenceRequest, userService.getAccountDetails().accountId)
      if(responseData.error) {
        toast({
          title: 'Add Client Preference.',
          description: 'Error creating new client preference, please try again later or contact administrator. Details: '+responseData.errorMessage,
          status: 'error',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })

        return;
      } else {
        toast({
          title: 'Add Client Preference.',
          description: 'Successfully added new client preference.',
          status: 'success',
          position: 'top',
          duration: 6000,
          isClosable: true,
        })
        const newVenorPrefs = [...vendorPreferencesRef.current];
        newVenorPrefs.push(responseData)
        vendorPreferencesRef.current = newVenorPrefs;
        populatePrefernceDataForTable(newVenorPrefs)  
      }
    } else {
      toast({
        title: 'Add Client Preference.',
        description: 'All the fields are required.',
        status: 'error',
        position: 'top',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

  }


  return (

    <div>
          <Button size="xs"
              bgColor="header_actions"
              onClick={() => handleClick("xxl")}
              key="xxl"
              m={1}
              >{`Client Preferences`}
          </Button>      
          <Drawer onClose={onClose} isOpen={isOpen} size={size}>
                <DrawerOverlay />
                    <DrawerContent>
                        {loading?<><Spinner /></>:<></>}
                        <DrawerCloseButton />
                            <DrawerHeader>
                                Client Preferences
                            </DrawerHeader>
                            <DrawerBody>
                              <Stack spacing='1'>
                                <Card variant="vendorPreferences">
                                  {enableAddPreference?<>
                                    <CardBody>
                                        <HStack spacing={3}>
                                          <FormControl isRequired>
                                              <FormLabel>Name</FormLabel>
                                              <Input type="text" id="name" width="75%"  onChange={(ev) => setName(ev.target.value)}/>
                                          </FormControl> 
                                          {enablePredefinedPreference?<>
                                            <FormControl isRequired>
                                              <FormLabel>Predefined Key</FormLabel>
                                              <Select id="type" width="75%"  onChange={(ev) => setKey(ev.target.value)}>
                                                    <option value="">Select Predefined</option>
                                                    {PREDEFINED_PREFERENCES.VENDOR.map((preference) => (
                                                        <option value={preference.key} >{preference.name}</option>
                                                    ))}
                                              </Select>     
                                            </FormControl>                                                                                          
                                          </>:<>
                                            <FormControl isRequired>
                                                <FormLabel>Key</FormLabel>
                                                <Input type="text" id="key"   onChange={(ev) => setKey(ev.target.value)}/>
                                            </FormControl> 
                                          </>}
                                          <FormControl isRequired>
                                              <FormLabel>Value</FormLabel>
                                              <Input type="text" id="value"  width="75%"  onChange={(ev) => setValue(ev.target.value)}/>
                                          </FormControl>                                                                                     
                                        </HStack>
                                    </CardBody>                                  
                                  </>:<></>}
                                    <CardFooter>
                                        <HStack>
                                            <Button size="xs" colorScheme="yellow" onClick={onClose}>
                                                Cancel
                                            </Button>  
                                            {enableAddPreference?<>
                                              <Button size="xs" colorScheme='red' onClick={handleSavePrference} >
                                                  Add 
                                              </Button>                                            
                                            </>:<>
                                              <Button size="xs" bgColor="header_actions" onClick={addPredefinedPreference}>
                                                  Add Predefined Preference
                                              </Button>
                                              <Button size="xs" colorScheme='red' onClick={addCustomPreference} >
                                                  Add Custom Preference
                                              </Button>                                            
                                            </>}                                    
                                        </HStack>                                        
                                    </CardFooter>
                                </Card>
                                <CustomTable columns={PREFERENCES_TABLE_COLUMNS} rows={vendorPreferences} />                                
                              </Stack>
                            </DrawerBody>
                    </DrawerContent>                    

            </Drawer>  

    </div>


  );
};

export default VendorPreferences;
