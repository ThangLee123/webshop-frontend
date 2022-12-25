import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input, Spin } from 'antd';
import React, { useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Register.module.scss';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { axiosInstance } from '~/config/configApiUrl';

const cx = classNames.bind(styles);

const Register = () => {
    const userSignin = useSelector((state) => state.userSignin);

    // const { isLogged } = userSignin;

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [searchParams] = useSearchParams();
    const redirectInUrl = searchParams.get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const submitHandler = async (values) => {
        // console.log('Received values of form: ', values);
        try {
            const res = await axiosInstance.post('/api/users/register', {
                name: values.name,
                email: values.email,
                password: values.password,
                confirmPassword: values.cf_password,
            });
            setError('');
            setSuccess(res.data.msg);
        } catch (err) {
            setSuccess('');
            err.response.data.msg && setError(err.response.data.msg);
        }
    };

    return (
        <>
            {success && (
                <div style={{ marginTop: '100px' }}>
                    <Alert message="Success" description={success} type="success" showIcon />
                </div>
            )}
            {error && (
                <div style={{ marginTop: '40px' }}>
                    <Alert message="Error" description={error} type="error" showIcon />
                </div>
            )}
            <div className={cx('sign-in')}>
                <div className={cx('sign-in__header')}>
                    <h1>Register</h1>
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
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Name!',
                                },
                            ]}
                        >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Enter Name" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Email!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="site-form-item-icon" />}
                                placeholder="Enter Email"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Password!',
                                },
                                { min: 6, message: 'Password must be minimum 6 characters.' },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Enter Password"
                            />
                        </Form.Item>
                        <Form.Item
                            name="cf_password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your Confirm Password!',
                                },
                                { min: 6, message: 'Confirm Password must be minimum 6 characters.' },
                            ]}
                        >
                            <Input
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Enter Confirm Password"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Register
                            </Button>
                            <p>
                                Already have an account?{' '}
                                <Link to={`/signin?redirect=${redirect}`} className={cx('text__hover')}>
                                    Sign-In
                                </Link>
                            </p>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default Register;
