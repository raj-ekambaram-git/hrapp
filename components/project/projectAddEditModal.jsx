import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure
} from '@chakra-ui/react'
import ProjectAddEdit from './projectAddEdit';


const ProjectAddEditModal = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const {data} = props;

  console.log("DAAYYYY::"+JSON.stringify(data));


  return (

    <div>
          <ModalContent>
              <ModalHeader>Create a Project</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <ProjectAddEdit data={data}></ProjectAddEdit>
              </ModalBody>
          </ModalContent>      

    </div>


  );
};

export default ProjectAddEditModal;
