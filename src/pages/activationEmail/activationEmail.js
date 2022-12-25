import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'
import { Alert } from 'antd';
import { axiosInstance } from '~/config/configApiUrl';

function ActivationEmail() {
    const navigate = useNavigate();
    const { activation_token } = useParams();
    const [err, setErr] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (activation_token) {
            const activationEmail = async () => {
                try {
                    const res = await axiosInstance.post('/api/users/activation', { activation_token });
                    setSuccess(res.data.msg);
                } catch (err) {
                    err.response.data.msg && setErr(err.response.data.msg);
                }
            };
            activationEmail();
        }
    }, [activation_token]);

    return (
        <div className="active_page">
            {success && (
                <div style={{ marginTop: '100px' }}>
                    <Alert message="Success" description={success} type="success" showIcon />
                </div>
            )}
            {err && (
                <div style={{ marginTop: '40px' }}>
                    <Alert message="Error" description={err} type="error" showIcon />
                </div>
            )}
        </div>
    );
}

export default ActivationEmail;
