import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Layout } from 'components/account';
import { userService } from 'services';
import {util} from '../../../../../helpers/util';
import {
    Card,
    CardHeader,
    Box,
    Heading,
    CardBody,
    Stack,
    StackDivider,
    HStack,
    Button,
    useToast
  } from '@chakra-ui/react';
import { EMPTY_STRING } from '../../../../../constants/accountConstants';


export default ChangePassword;

function ChangePassword(props) {
    const router = useRouter();
    const toast = useToast()
    const userId = props.data.userId;

    if(userId === undefined || userId=== EMPTY_STRING) {
        router.push({
            pathname: '/account/login'
        });
    }

    // const userId = router.query.userId;
    // if(router.query.userId === undefined || router.query.userId === EMPTY_STRING) {
    //     router.push({
    //         pathname: '/account/login'
    //     });
    // }
    // form validation rules 
    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Old Password is required'),
        newPassword: Yup.string().required('New Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    async function onSubmit({ oldPassword, newPassword }) {

        if(util.isStrongPassword(newPassword)) {
            const changePasswordResponse = await userService.changePassword(userId, oldPassword, newPassword);
            if(changePasswordResponse != undefined && changePasswordResponse.error) {
              toast({
                title: 'Change Password Erropr.',
                description: changePasswordResponse.errorMessage,
                status: 'error',
                position: 'top',
                duration: 9000,
                isClosable: true,
              })
            }else {
              toast({
                title: 'Change Password.',
                description: 'Password updated, please login with updated password again.',
                status: 'success',
                position: 'top',
                duration: 9000,
                isClosable: true,
              });
              router.push({
                    pathname: '/account/login'
                });
      
            }
            
          }else {
            toast({
              title: 'Change Password Error.',
              description: 'Please enter valid passsword.',
              status: 'error',
              position: 'top',
              duration: 9000,
              isClosable: true,
            })
          }        
    }

    return (
        <Layout>

            <Card>
                <CardHeader bgColor="heading">
                    <HStack spacing="50rem">
                        <Box>
                            <Heading size='md'>Change Password</Heading>
                        </Box>
                    </HStack>
                </CardHeader>

                <CardBody>
                <Stack divider={<StackDivider />} spacing='1'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Old Password</label>
                            <input name="oldPassword" type="password" {...register('oldPassword')} className={`form-control ${errors.oldPassword ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.oldPassword?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input name="newPassword" type="password" {...register('newPassword')} className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.newPassword?.message}</div>
                        </div>
                        <HStack spacing={4}>
                            <Button className="btn" type="submit" disabled={formState.isSubmitting} width="button.login.widht" bgColor="button.primary.color">
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Change Password
                            </Button>
                        </HStack>
                    </form>
                </Stack>
                </CardBody>
            </Card>                

        </Layout>
    );
}



export async function getStaticPaths() {

    return {
      paths: [{ params: { userId: "1" } }],
      fallback: false,
    };
  
  } 
  
  export async function getStaticProps(context) {
    const { userId } = context.params;
  
    return {
      props: {
        data: {
          userId: userId
        }
      },
      revalidate: 1,
    };
  
  }
  