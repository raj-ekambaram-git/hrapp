import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Layout } from '../components/static/Layout';
import { userService, alertService } from 'services';
import {
    Card,
    CardHeader,
    Flex,
    Heading,
    CardBody,
    Stack,
    StackDivider,
    HStack,
    Button,
    useToast,
    Box
  
  } from '@chakra-ui/react';
import UserResetPassword from '../components/user/userResetPassword';
import { useDispatch } from 'react-redux';
import {setSelectedAccountId} from '../store/modules/Account/actions'
import {setLoggedInUser} from '../store/modules/User/actions'
import Head from 'next/head';
import Script from "next/script";
import { configurationService } from '../services';
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY;


export default Login;


function Login() {
    const dispatch = useDispatch();
    const router = useRouter();
    const toast = useToast();

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
        window.grecaptcha.ready(() => {
            window.grecaptcha
              .execute(SITE_KEY, { action: "submit" })
              .then(async (token) => {
                const responseData = await configurationService.verifyCaptcha(token)
                if(responseData.error) {
                  toast({
                    title: 'Login Error.',
                    description: responseData.errorMessage,
                    status: 'error',
                    position: 'top',
                    duration: 6000,
                    isClosable: true,
                  })       
                }else {
                  return userService.login(username, password)
                        .then(user => {
                            if(user.passwordExpired) {
                                dispatch(setLoggedInUser(user))
                                router.push("/changepassword/");
                            }else {
                                dispatch(setSelectedAccountId(user.accountId))
                                dispatch(setLoggedInUser(user))
                                const returnUrl = router.query.returnUrl || '/account/dashboard';
                                router.push(returnUrl);
                            }
                        })
                        .catch(err => {
                            toast({
                                title: 'Login Error.',
                                description: 'Details:'+err,
                                status: 'error',
                                position: 'top',
                                duration: 6000,
                                isClosable: true,
                                })
                        });     
                }
              })      
          });             
              

    }

    return (
        <>

            <Head>
            <title>Registration Page</title>
            </Head>
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`}/>
            <Layout>
                <Box bg="gray.50" width="1900">
                    <Box width="page.login_width">
                        <Card>
                            <CardHeader bgColor="heading">
                                <Flex
                                    as="nav"
                                    align="center"
                                    justify="space-between"
                                    wrap="wrap"
                                    bg="heading"
                                    color="white"
                                    width="page.heading_width"
                                    borderRadius='9px'
                                >
                                <Heading size='md'>Login</Heading>
                                </Flex>                        
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
                                            <Button type="submit" disabled={formState.isSubmitting} width="button.login.widht" bgColor="button.primary.color">
                                                {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                                                Login
                                            </Button>
                                            <UserResetPassword/>
                                        </HStack>
                                    </form>
                                </Stack>
                            </CardBody>
                        </Card>                
                    </Box>
                </Box>
            </Layout>
        </>
    );
}
