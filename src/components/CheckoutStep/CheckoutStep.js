import classNames from 'classnames/bind';
import styles from './CheckoutStep.module.scss';
import { LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from '@ant-design/icons';
import { Steps } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import React from 'react';

const cx = classNames.bind(styles);
const { Step } = Steps;

function CheckoutStep(props) {
    // console.log(props);
    const navigate = useNavigate();
    const [current, setCurrent] = useState(props.currentStep);
    const onChange = (value) => {
        // console.log('onChange:', value);
        setCurrent(value);
        if (value === 1) {
            navigate('/shipping');
        }
    };
    return (
        <div className="grid wide" style={{ marginTop: '60px', height: '100%', backgroundColor: 'white' }}>
            <div className={cx('checkout-steps')}>
                <Steps current={current} onChange={onChange}>
                    <Step title="Step 1" description="Login" disabled />
                    <Step
                        title="Step 2"
                        description="Shipping & Payment"
                        disabled={props.disableStep2}
                        style={{ color: 'red' }}
                    />
                    <Step title="Step 3" description="Your Order" disabled={props.disableStep3} />
                </Steps>

                {/* <Steps type="navigation" current={current} onChange={onChange} className="site-navigation-steps">
                    <Step status="finish" title="Login" disabled className={cx('DisableStep2')}/>
                    <Step status="process" title="Shipping & Payment" disabled={props.disableStep2} icon={<SmileOutlined />} />
                    {/* <Step status="wait" title="Payment" /> */}
                {/* <Step status="wait" title="Place Order" /> */}
                {/* </Steps> */}
            </div>
        </div>
    );
}

export default CheckoutStep;
