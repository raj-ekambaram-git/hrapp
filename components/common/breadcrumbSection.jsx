export { BreadcrumbSection };
  import { ChevronRightIcon } from '@chakra-ui/icons';
  import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Text,
} from '@chakra-ui/react'
function BreadcrumbSection(props) {

    return (
        <>
          <Breadcrumb marginBottom={6} spacing='8px' separator={<ChevronRightIcon color='gray.500' />} color='gray.500' fontSize="14" fontWeight="600">
            {props.breadCrumbData.map((breadCrumb, index) => 
                  <BreadcrumbItem>
                  {(props.breadCrumbData.length > index+1) ? <>
                    <Link href={breadCrumb.link} >  
                     {breadCrumb.name}
                    </Link>                  
                  </>:<>
                    {props.currentPage?<>
                      <Text color='gray.500'>
                        {props.currentPage}
                      </Text>                        
                    </>:<>
                      <Text>
                        {breadCrumb.name}                    
                      </Text>                        
                    </>}                 
                  </>}

                  </BreadcrumbItem>
          
            )}
          </Breadcrumb>
        </>
    );
}
