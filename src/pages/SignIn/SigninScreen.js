import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input, Spin, message } from 'antd';
import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SigninScreen.module.scss';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '~/redux/actions/userActions';
import { USER_SIGNIN_FIRSTLOGIN, USER_SIGNIN_RESET } from '~/redux/constants/userConstants';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import axios from 'axios';
import { successLoading } from '~/utils/loadingService';
import { axiosInstance } from '~/config/configApiUrl';

const cx = classNames.bind(styles);

const SigninScreen = () => {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo, loading, error } = userSignin;

    const [searchParams] = useSearchParams();
    const redirectInUrl = searchParams.get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const dispatch = useDispatch();

    const navigate = useNavigate();
    useEffect(() => {
        if (userInfo) {
            if (userInfo.isAdmin || userInfo.isSeller) {
                navigate('/');
            } else {
                navigate(redirect);
            }
        }
    }, [navigate, redirect, userInfo]);

    useEffect(() => {
        dispatch({ type: USER_SIGNIN_RESET });
        function start() {
            gapi.client.init({
                clientId: '1069556497635-tcq16g1jl3uolk82hu2l34j8mtftg53o.apps.googleusercontent.com',
                scope: 'email',
            });
        }

        gapi.load('client:auth2', start);
    }, []);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const submitHandler = (values) => {
        successLoading();
        // console.log('Received values of form: ', values);
        dispatch(signin(values.email, values.password));
    };

    const responseGoogle = async (response) => {
        // console.log(response);
        try {
            successLoading();
            const res = await axiosInstance.post('/api/users/google_login', { tokenId: response.tokenId });
            // console.log(res);
            localStorage.setItem('firstLogin', true);
            dispatch({ type: USER_SIGNIN_FIRSTLOGIN, payload: { isLogged: true } });
        } catch (err) {
            // err.response.data.msg &&
            //     setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    };

    return (
        <>
            {loading && (
                <div style={{ display: 'flex' }}>
                    <div style={{ margin: '100px auto 0' }}>
                        <Spin size="large" />
                    </div>
                </div>
            )}
            {error && (
                <div style={{ marginTop: '40px' }}>
                    <Alert message="Error" description={error} type="error" showIcon />
                </div>
            )}
            <div className={cx('sign-in')}>
                <div className={cx('sign-in__header')}>
                    <h1>Sign In</h1>
                </div>
                <div className={cx('sign-in__form')}>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={submitHandler}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Email!',
                                },
                            ]}
                        >
                            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                            <Link to="/forgot_password" className={cx('text__hover')}>
                                Forgot your password?
                            </Link>
                        </Form.Item>

                        <div>Or Login With</div>

                        <div className={cx('social')}>
                            <GoogleLogin
                                clientId="1069556497635-tcq16g1jl3uolk82hu2l34j8mtftg53o.apps.googleusercontent.com"
                                buttonText="Login with google"
                                onSuccess={responseGoogle}
                                cookiePolicy={'single_host_origin'}
                            />

                            {/* <FacebookLogin
                                appId="633584301478315"
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={responseFacebook}
                            /> */}
                        </div>
                        <p>
                            New Customer?{' '}
                            <Link to={`/register?redirect=${redirect}`} className={cx('text__hover')}>
                                Register
                            </Link>
                        </p>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default SigninScreen;
