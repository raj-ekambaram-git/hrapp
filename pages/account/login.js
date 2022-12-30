import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Layout } from 'components/account';
import { userService, alertService } from 'services';
import {
    Card,
    CardHeader,
    Box,
    Heading,
    CardBody,
    Stack,
    StackDivider,
    Badge,
    Flex,
    HStack,
    Button,
    useDisclosure,
    Accordion,
  
  } from '@chakra-ui/react';
import UserResetPassword from '../../components/user/userResetPassword';

export default Login;

function Login() {
    const router = useRouter();

    // form validation rules 
    const validationSchema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        password: Yup.string().required('Password is required')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    function onSubmit({ username, password }) {
        return userService.login(username, password)
            .then(user => {
                console.log("USER AFTER LOGIN ::"+JSON.stringify(user))
                if(user.passwordExpired) {
                    console.log("Inside the password expired")
                    // Forward to Change Password Page now as passsword is expired
                    router.push("/account/user/changepassword?userId="+user.id);
                }else {
                    // get return url from query parameters or default to '/'
                    const returnUrl = router.query.returnUrl || '/';
                    router.push(returnUrl);
                }
            })
            .catch(alertService.error);
    }

    return (
        <Layout>

            <Card>
                <CardHeader bgColor="heading">
                    <HStack spacing="50rem">
                        <Box>
                            <Heading size='md'>Login</Heading>
                        </Box>
                    </HStack>
                </CardHeader>

                <CardBody>
                <Stack divider={<StackDivider />} spacing='1'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Username</label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <HStack spacing={4}>
                            <Button className="btn" type="submit" disabled={formState.isSubmitting} width="button.login.widht" bgColor="button.primary.color">
                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                Login
                            </Button>
                            <UserResetPassword/>
                        </HStack>
                    </form>
                </Stack>
                </CardBody>
            </Card>                

        </Layout>
    );
}
