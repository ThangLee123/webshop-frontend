import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import CheckoutStep from '~/components/CheckoutStep';
import { Alert, Radio, Space, Spin, Modal, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod, saveOrder } from '~/redux/actions/cartActions';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { VisaIcon, MasterCardIcon, MomoIcon, PaypalIcon, VnPayIcon } from '~/components/Icons';
import { createOrder, deliverOrder, detailsOrder, payOrder } from '~/redux/actions/orderActions';
import { ORDER_CREATE_RESET, ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '~/redux/constants/orderConstants';
import Axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { CART_EMPTY } from '~/redux/constants/cartConstants';
import { ethers } from 'ethers';
import ErrorMessage from '~/pages/Bitcoin/ErrorMessage';
import TxList from '~/pages/Bitcoin/TxList';
import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styles from './Order.module.scss';
import { createOrderRollback } from '~/redux/actions/orderRollbackAction';
import { SocketContext } from '~/config/socketContext';
import { useContext } from 'react';
import { ORDER_ROLLBACK_CREATE_RESET } from '~/redux/constants/orderRollbackConstants';
import { axiosInstance } from '~/config/configApiUrl';

const cx = classNames.bind(styles);
const { TextArea } = Input;
// const countryList = {
//     '': 'Select your country...',
//     AF: 'Afghanistan',
//     AL: 'Albania',
//     DZ: 'Algeria',
//     AS: 'American Samoa',
//     AD: 'Andorra',
//     AO: 'Angola',
//     AI: 'Anguilla',
//     AQ: 'Antarctica',
//     AG: 'Antigua and Barbuda',
//     AR: 'Argentina',
//     AM: 'Armenia',
//     AW: 'Aruba',
//     AU: 'Australia',
//     AT: 'Austria',
//     AZ: 'Azerbaijan',
//     BS: 'Bahamas (the)',
//     BH: 'Bahrain',
//     BD: 'Bangladesh',
//     BB: 'Barbados',
//     BY: 'Belarus',
//     BE: 'Belgium',
//     BZ: 'Belize',
//     BJ: 'Benin',
//     BM: 'Bermuda',
//     BT: 'Bhutan',
//     BO: 'Bolivia (Plurinational State of)',
//     BQ: 'Bonaire, Sint Eustatius and Saba',
//     BA: 'Bosnia and Herzegovina',
//     BW: 'Botswana',
//     BV: 'Bouvet Island',
//     BR: 'Brazil',
//     IO: 'British Indian Ocean Territory (the)',
//     BN: 'Brunei Darussalam',
//     BG: 'Bulgaria',
//     BF: 'Burkina Faso',
//     BI: 'Burundi',
//     CV: 'Cabo Verde',
//     KH: 'Cambodia',
//     CM: 'Cameroon',
//     CA: 'Canada',
//     KY: 'Cayman Islands (the)',
//     CF: 'Central African Republic (the)',
//     TD: 'Chad',
//     CL: 'Chile',
//     CN: 'China',
//     CX: 'Christmas Island',
//     CC: 'Cocos (Keeling) Islands (the)',
//     CO: 'Colombia',
//     KM: 'Comoros (the)',
//     CD: 'Congo (the Democratic Republic of the)',
//     CG: 'Congo (the)',
//     CK: 'Cook Islands (the)',
//     CR: 'Costa Rica',
//     HR: 'Croatia',
//     CU: 'Cuba',
//     CW: 'Curaçao',
//     CY: 'Cyprus',
//     CZ: 'Czechia',
//     CI: "Côte d'Ivoire",
//     DK: 'Denmark',
//     DJ: 'Djibouti',
//     DM: 'Dominica',
//     DO: 'Dominican Republic (the)',
//     EC: 'Ecuador',
//     EG: 'Egypt',
//     SV: 'El Salvador',
//     GQ: 'Equatorial Guinea',
//     ER: 'Eritrea',
//     EE: 'Estonia',
//     SZ: 'Eswatini',
//     ET: 'Ethiopia',
//     FK: 'Falkland Islands (the) [Malvinas]',
//     FO: 'Faroe Islands (the)',
//     FJ: 'Fiji',
//     FI: 'Finland',
//     FR: 'France',
//     GF: 'French Guiana',
//     PF: 'French Polynesia',
//     TF: 'French Southern Territories (the)',
//     GA: 'Gabon',
//     GM: 'Gambia (the)',
//     GE: 'Georgia',
//     DE: 'Germany',
//     GH: 'Ghana',
//     GI: 'Gibraltar',
//     GR: 'Greece',
//     GL: 'Greenland',
//     GD: 'Grenada',
//     GP: 'Guadeloupe',
//     GU: 'Guam',
//     GT: 'Guatemala',
//     GG: 'Guernsey',
//     GN: 'Guinea',
//     GW: 'Guinea-Bissau',
//     GY: 'Guyana',
//     HT: 'Haiti',
//     HM: 'Heard Island and McDonald Islands',
//     VA: 'Holy See (the)',
//     HN: 'Honduras',
//     HK: 'Hong Kong',
//     HU: 'Hungary',
//     IS: 'Iceland',
//     IN: 'India',
//     ID: 'Indonesia',
//     IR: 'Iran (Islamic Republic of)',
//     IQ: 'Iraq',
//     IE: 'Ireland',
//     IM: 'Isle of Man',
//     IL: 'Israel',
//     IT: 'Italy',
//     JM: 'Jamaica',
//     JP: 'Japan',
//     JE: 'Jersey',
//     JO: 'Jordan',
//     KZ: 'Kazakhstan',
//     KE: 'Kenya',
//     KI: 'Kiribati',
//     KP: "Korea (the Democratic People's Republic of)",
//     KR: 'Korea (the Republic of)',
//     KW: 'Kuwait',
//     KG: 'Kyrgyzstan',
//     LA: "Lao People's Democratic Republic (the)",
//     LV: 'Latvia',
//     LB: 'Lebanon',
//     LS: 'Lesotho',
//     LR: 'Liberia',
//     LY: 'Libya',
//     LI: 'Liechtenstein',
//     LT: 'Lithuania',
//     LU: 'Luxembourg',
//     MO: 'Macao',
//     MG: 'Madagascar',
//     MW: 'Malawi',
//     MY: 'Malaysia',
//     MV: 'Maldives',
//     ML: 'Mali',
//     MT: 'Malta',
//     MH: 'Marshall Islands (the)',
//     MQ: 'Martinique',
//     MR: 'Mauritania',
//     MU: 'Mauritius',
//     YT: 'Mayotte',
//     MX: 'Mexico',
//     FM: 'Micronesia (Federated States of)',
//     MD: 'Moldova (the Republic of)',
//     MC: 'Monaco',
//     MN: 'Mongolia',
//     ME: 'Montenegro',
//     MS: 'Montserrat',
//     MA: 'Morocco',
//     MZ: 'Mozambique',
//     MM: 'Myanmar',
//     NA: 'Namibia',
//     NR: 'Nauru',
//     NP: 'Nepal',
//     NL: 'Netherlands (the)',
//     NC: 'New Caledonia',
//     NZ: 'New Zealand',
//     NI: 'Nicaragua',
//     NE: 'Niger (the)',
//     NG: 'Nigeria',
//     NU: 'Niue',
//     NF: 'Norfolk Island',
//     MP: 'Northern Mariana Islands (the)',
//     NO: 'Norway',
//     OM: 'Oman',
//     PK: 'Pakistan',
//     PW: 'Palau',
//     PS: 'Palestine, State of',
//     PA: 'Panama',
//     PG: 'Papua New Guinea',
//     PY: 'Paraguay',
//     PE: 'Peru',
//     PH: 'Philippines (the)',
//     PN: 'Pitcairn',
//     PL: 'Poland',
//     PT: 'Portugal',
//     PR: 'Puerto Rico',
//     QA: 'Qatar',
//     MK: 'Republic of North Macedonia',
//     RO: 'Romania',
//     RU: 'Russian Federation (the)',
//     RW: 'Rwanda',
//     RE: 'Réunion',
//     BL: 'Saint Barthélemy',
//     SH: 'Saint Helena, Ascension and Tristan da Cunha',
//     KN: 'Saint Kitts and Nevis',
//     LC: 'Saint Lucia',
//     MF: 'Saint Martin (French part)',
//     PM: 'Saint Pierre and Miquelon',
//     VC: 'Saint Vincent and the Grenadines',
//     WS: 'Samoa',
//     SM: 'San Marino',
//     ST: 'Sao Tome and Principe',
//     SA: 'Saudi Arabia',
//     SN: 'Senegal',
//     RS: 'Serbia',
//     SC: 'Seychelles',
//     SL: 'Sierra Leone',
//     SG: 'Singapore',
//     SX: 'Sint Maarten (Dutch part)',
//     SK: 'Slovakia',
//     SI: 'Slovenia',
//     SB: 'Solomon Islands',
//     SO: 'Somalia',
//     ZA: 'South Africa',
//     GS: 'South Georgia and the South Sandwich Islands',
//     SS: 'South Sudan',
//     ES: 'Spain',
//     LK: 'Sri Lanka',
//     SD: 'Sudan (the)',
//     SR: 'Suriname',
//     SJ: 'Svalbard and Jan Mayen',
//     SE: 'Sweden',
//     CH: 'Switzerland',
//     SY: 'Syrian Arab Republic',
//     TW: 'Taiwan',
//     TJ: 'Tajikistan',
//     TZ: 'Tanzania, United Republic of',
//     TH: 'Thailand',
//     TL: 'Timor-Leste',
//     TG: 'Togo',
//     TK: 'Tokelau',
//     TO: 'Tonga',
//     TT: 'Trinidad and Tobago',
//     TN: 'Tunisia',
//     TR: 'Turkey',
//     TM: 'Turkmenistan',
//     TC: 'Turks and Caicos Islands (the)',
//     TV: 'Tuvalu',
//     UG: 'Uganda',
//     UA: 'Ukraine',
//     AE: 'United Arab Emirates (the)',
//     GB: 'United Kingdom of Great Britain and Northern Ireland (the)',
//     UM: 'United States Minor Outlying Islands (the)',
//     US: 'United States of America (the)',
//     UY: 'Uruguay',
//     UZ: 'Uzbekistan',
//     VU: 'Vanuatu',
//     VE: 'Venezuela (Bolivarian Republic of)',
//     VN: 'Viet Nam',
//     VG: 'Virgin Islands (British)',
//     VI: 'Virgin Islands (U.S.)',
//     WF: 'Wallis and Futuna',
//     EH: 'Western Sahara',
//     YE: 'Yemen',
//     ZM: 'Zambia',
//     ZW: 'Zimbabwe',
//     AX: 'Åland Islands',
// };
function Order() {
    const socket = useContext(SocketContext);
    const [sdkReady, setSdkReady] = useState(false);
    const token = useSelector((state) => state.token);
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const params = useParams();
    const { id: orderId } = params;
    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;
    // console.log('dsadasd', order);
    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, error: errorPay, success: successPay } = orderPay;
    const orderDeliver = useSelector((state) => state.orderDeliver);
    const { loading: loadingDeliver, error: errorDeliver, success: successDeliver } = orderDeliver;
    const orderRollBackCreate = useSelector((state) => state.OrderRollbackCreate);
    const {
        loading: loadingRollBack,
        error: errorRollBack,
        success: successRollBack,
        orderRollBack,
    } = orderRollBackCreate;
    const dispatch = useDispatch();

    const [errorVNPay, setErrorVNPay] = useState('');
    const [successVNPay, setSuccessVNPay] = useState(null);
    const [loadingVNPay, setLoadingVNPay] = useState(false);

    // console.log('successVNPay', successVNPay);

    //bitcoin

    const [errorBitcoin, setError] = useState();
    const [txs, setTxs] = useState([]);
    // const [check, setCheck]=useState(false);
    const startPayment = async ({ setError, setTxs, ether, addr, chainRequest }) => {
        try {
            if (!window.ethereum) throw new Error('No crypto wallet found. Please install it.');

            await window.ethereum.send('eth_requestAccounts');
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const { chainId } = await provider.getNetwork();
            console.log(typeof chainId);
            if (chainId === chainRequest) {
                ethers.utils.getAddress(addr);
                const tx = await signer.sendTransaction({
                    to: addr,
                    value: ethers.utils.parseEther(ether),
                });
                console.log({ ether, addr });
                console.log('tx', tx);
                // setCheck(true);
                successPaymentHandler();
                setTxs([tx]);
            } else {
                setError('You are using different coin');
                console.log(errorBitcoin);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBitcoin = async (e, coin, amount) => {
        e.preventDefault();
        // const data = new FormData(e.target);
        setError();
        console.log('tsx: ', txs);
        console.log('coin: ', coin);
        await startPayment({
            setError,
            setTxs,
            ether: '0.01',
            addr: '0xf88B78460E9251c2F2FB5AC91FCe3e6ECa928659',
            chainRequest: coin,
        });
    };
    //endbitcoin

    useEffect(() => {
        if (errorDeliver) {
            dispatch({ type: ORDER_DELIVER_RESET });
        }
        // if (successRollBack) {
        //     dispatch({ type: ORDER_ROLLBACK_CREATE_RESET });
        // }
    }, []);
    useEffect(() => {
        if (successRollBack) {
            socket.emit('sendNotify', {});
            dispatch({ type: ORDER_ROLLBACK_CREATE_RESET });
        } else if (successPay || successVNPay) {
            // console.log('aaaa send success');
            socket.emit('sendSuccessPay', {});
            dispatch({ type: ORDER_PAY_RESET });
        } else if (successDeliver) {
            socket.emit('sendSuccessDeliver', {});
            dispatch({ type: ORDER_DELIVER_RESET });
        }
    }, [successRollBack, successPay, successDeliver, successVNPay]);

    useEffect(() => {
        if (userSignin.userInfo) {
            const addPayPalScript = async () => {
                const { data } = await axiosInstance.get('/api/config/paypal');
                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
                script.async = true;
                script.onload = () => {
                    setSdkReady(true);
                };
                document.body.appendChild(script);
            };
            if (!order || successPay || successDeliver || (order && order._id !== orderId)) {
                dispatch({ type: ORDER_PAY_RESET });
                dispatch({ type: ORDER_DELIVER_RESET });
                dispatch(detailsOrder(orderId));
            } else {
                if (!order.isPaid) {
                    if (!window.paypal) {
                        addPayPalScript();
                    } else {
                        setSdkReady(true);
                    }
                } else {
                    dispatch({ type: CART_EMPTY });
                    localStorage.removeItem('cartItems');
                }
            }
        }
    }, [dispatch, orderId, userSignin, order, sdkReady, successPay, successDeliver]);

    const successPaymentHandler = (paymentResult) => {
        // console.log('paymentResult: ', paymentResult);
        dispatch(payOrder(order, paymentResult));
    };
    const deliverHandler = () => {
        dispatch(deliverOrder(order._id));
    };

    // Handle RollBack
    const calcDate = (date) => {
        const date1 = new Date(); // currentDate
        const date2 = new Date(date);
        const diffTime = Math.abs(date1 - date2);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // console.log(date1 + ' day1');
        // console.log(date2 + ' day2');
        // console.log(diffTime + ' milliseconds');
        // console.log(diffDays + ' days');
        if (diffDays < 3) {
            return true;
        }
        return false;
    };

    const { confirm } = Modal;
    const handleRollBack = (e) => {
        // handleRollBack
        confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure to rollback the order?',
            okText: 'Yes',
            // cancelText: '取消',
            onOk() {
                confirm({
                    title: 'Please Tell Us Your Reason You Want To Cancel Order:',
                    icon: <InfoCircleOutlined style={{ color: 'var(--blue-color)' }} />,
                    content: (
                        <div className="order-rollback-information">
                            <div style={{ fontWeight: '500' }}>Your Payment For RollBack:</div>
                            <Input
                                className="order-rollback-userPayment"
                                placeholder="STK/Tên chủ thẻ/Tên Ngân Hàng"
                                style={{ marginBottom: '6px' }}
                            />
                            <TextArea className="order-rollback-reason" rows={4} placeholder="Your Reason Here" />
                        </div>
                    ),
                    okText: 'Send',
                    // cancelText: '取消',
                    onOk() {
                        // console.log(
                        //     'sdsdsdsd',
                        //     document.querySelector('.order-rollback-information .order-rollback-reason').value,
                        //     document.querySelector('.order-rollback-information .order-rollback-userPayment').value,
                        // );
                        const userPaymentRollBack = document.querySelector(
                            '.order-rollback-information .order-rollback-userPayment',
                        ).value;
                        const userReasonCancel = document.querySelector(
                            '.order-rollback-information .order-rollback-reason',
                        ).value;
                        dispatch(
                            createOrderRollback(
                                {
                                    totalOrderPrice: order.totalPrice,
                                    userPaymentRollBack: userPaymentRollBack,
                                    reasonCancel: userReasonCancel,
                                },
                                orderId,
                            ),
                        );

                        dispatch(detailsOrder(orderId));
                    },
                    onCancel() {
                        // console.log('Cancel');
                    },
                });
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    };

    const handleVNPay = () => {
        const submitHandler = async (value) => {
            // console.log('Received values of form: ', order);
            setLoadingVNPay(true);
            try {
                const res = await axiosInstance.post(
                    '/paymentvnp/checkout',
                    {
                        firstname: order.shippingAddress.firstName,
                        astname: order.shippingAddress.lastName,
                        billingStreet: order.shippingAddress.address,
                        billingCity: '01',
                        billingStateProvince: order.shippingAddress.city,
                        billingCountry: order.shippingAddress.country,
                        billingPostCode: order.shippingAddress.postCode,
                        email: order.shippingAddress.email,
                        phoneNumber: order.shippingAddress.phone,
                        // amount: '900000',
                        amount: order.totalPrice,
                        paymentMethod: 'vnPay',
                        orderId: order._id,
                    },
                    // {
                    //     header: {
                    //         'Content-Type': 'application/json',
                    //         'Access-Control-Allow-Origin': '*'
                    //     },
                    // }
                );
                // window.open(res.data,'NewWindow','resizable = yes');
                // console.log('ưewe', res);
                if (order && !order.isPaid) {
                    // window.location = res.data.forwardLink;
                    const vnpayWindow = window.open(
                        res.data.forwardLink,
                        'NewWindow',
                        'width=' + window.screen.availWidth + ',height=' + window.screen.availHeight,
                    );
                    var timer = setInterval(function () {
                        if (vnpayWindow.closed) {
                            clearInterval(timer);
                            dispatch(detailsOrder(orderId));
                            setSuccessVNPay('yes');
                        }
                    }, 1000);

                    // console.log("SUCCESS PAY", res);
                    setLoadingVNPay(false);
                } else {
                    setErrorVNPay(true);
                    setLoadingVNPay(false);
                }
                // window.location = res.data

                // window.opener=null;
                // window.open('','_self');
                // window.close();
                // setErrorVNPay('');
                // setSuccessVNPay(res.data.msg);
            } catch (err) {
                setSuccessVNPay('');
                err.response.data.msg && setErrorVNPay(err.response.data.msg);
            }
        };
        submitHandler();
    };

    return (
        <>
            {loading ? (
                <div style={{ marginTop: '200px' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert message="Error" description={error} type="error" showIcon />
            ) : (
                <div>
                    <CheckoutStep currentStep={2} disableStep2 />
                    <div className={cx('grid wide')}>
                        <div className={cx('checkout-content')}>
                            <div className={cx('container')}>
                                <div className={cx('row')}>
                                    <div className={cx('col l-12 m-12 c-12')}>
                                        <div className={cx('order-review')}>
                                            <div
                                                className={cx('heading-s1 space-mb--20')}
                                                style={{ textAlign: 'center' }}
                                            >
                                                <h4
                                                    style={{
                                                        fontSize: '33px',
                                                        textDecoration: '',
                                                        color: '#ff4d4f',
                                                    }}
                                                >
                                                    Your Orders Summary
                                                </h4>
                                            </div>
                                            <div className={cx('table-responsive', 'order_table')}>
                                                <table className={cx('table1')}>
                                                    <thead>
                                                        <tr
                                                            style={{
                                                                textAlign: 'center',
                                                                fontSize: '22px',
                                                                textDecoration: 'underline',
                                                                color: '#ff4d4f',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            <td style={{ border: 'none' }}>
                                                                Your Delivery Information
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th style={{ border: 'none' }}></th>
                                                            <th style={{ border: 'none' }}></th>
                                                        </tr>
                                                        <tr>
                                                            <th style={{ borderTop: 'none' }}>First Name</th>
                                                            <td
                                                                className={cx('product-subtotal')}
                                                                style={{ border: 'none' }}
                                                            >
                                                                {order.shippingAddress.firstName}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Last Name</th>
                                                            <td className={cx('product-subtotal')}>
                                                                {order.shippingAddress.lastName}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>House No.</th>
                                                            <td className={cx('product-subtotal')}>
                                                                {order.shippingAddress.houseNo}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Your Address</th>
                                                            <td className={cx('product-subtotal')}>
                                                                {order.shippingAddress.address}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Postal Code</th>
                                                            <td className={cx('product-subtotal')}>
                                                                {order.shippingAddress.postalCode}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Phone Number</th>
                                                            <td className={cx('product-subtotal')}>
                                                                {order.shippingAddress.phone}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Email</th>
                                                            <td className={cx('product-subtotal')}>
                                                                {order.shippingAddress.email}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Additional Note</th>
                                                            <td className={cx('product-subtotal')}>
                                                                {order.shippingAddress.note}
                                                            </td>
                                                        </tr>
                                                    </thead>
                                                </table>

                                                <table className={cx('table3')}>
                                                    <thead>
                                                        <tr></tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr></tr>
                                                    </tbody>
                                                </table>

                                                <table className={cx('table2')}>
                                                    <thead>
                                                        <tr
                                                            style={{
                                                                textAlign: 'center',
                                                                fontSize: '22px',
                                                                textDecoration: 'underline',
                                                                color: '#ff4d4f',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            <td style={{ border: 'none' }}>Your Cart Detail</td>
                                                        </tr>
                                                        <tr>
                                                            <th style={{ border: 'none' }}></th>
                                                            <th style={{ border: 'none' }}></th>
                                                        </tr>

                                                        <tr style={{ border: 'none' }}>
                                                            <th>Product</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.orderItems.map((item, index) => {
                                                            return (
                                                                <tr
                                                                    key={index}
                                                                    style={{
                                                                        backgroundColor:
                                                                            JSON.parse(localStorage.getItem('userInfo'))
                                                                                .isSeller &&
                                                                            item.seller._id ===
                                                                                JSON.parse(
                                                                                    localStorage.getItem('userInfo'),
                                                                                )._id &&
                                                                            '#20a020',
                                                                    }}
                                                                >
                                                                    <td>
                                                                        <Link
                                                                            to={`/product/${item.product}`}
                                                                            className={cx('product-name')}
                                                                        >
                                                                            <div
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    justifyContent: 'center',
                                                                                }}
                                                                            >
                                                                                <div>
                                                                                    <img
                                                                                        src={item.image1}
                                                                                        alt="productImage"
                                                                                        className={cx(
                                                                                            'cart-image-product',
                                                                                        )}
                                                                                    ></img>
                                                                                </div>
                                                                                <div
                                                                                    style={{
                                                                                        marginTop: 'auto',
                                                                                        marginBottom: 'auto',
                                                                                    }}
                                                                                >
                                                                                    <span className={cx('item-name')}>
                                                                                        {item.name}
                                                                                    </span>
                                                                                    <div className={cx('product-qty')}>
                                                                                        x {item.qty}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Link>
                                                                    </td>
                                                                    <td>${item.price}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th>SubTotal</th>
                                                            <td className={cx('product-subtotal')}>
                                                                ${order.itemsPrice.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Shipping Price</th>
                                                            <td>
                                                                {order.shippingPrice !== 0
                                                                    ? `$${order.shippingPrice.toFixed(2)}`
                                                                    : 'Free Ship'}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th>Tax Price</th>
                                                            <td>${order.taxPrice.toFixed(2)}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>Total Price</th>
                                                            <td className={cx('product-subtotal')}>
                                                                ${order.totalPrice.toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                            <div className={cx('payment-method')}>
                                                <div
                                                    className={cx('heading-s1 space-mb--20')}
                                                    style={{ fontSize: '28px' }}
                                                >
                                                    <h4 style={{ color: '#ff4d4f', marginTop: '80px' }}>
                                                        Your Payment Process
                                                    </h4>

                                                    {!order.isPaid && order.paymentMethod === 'Paypal' && (
                                                        <li>
                                                            {!sdkReady ? (
                                                                <div style={{ marginTop: '200px' }}>
                                                                    <Spin size="large" />
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <div className={cx('paypal-button')}>
                                                                        <>
                                                                            {errorPay && (
                                                                                <Alert
                                                                                    message="Error"
                                                                                    description={errorPay}
                                                                                    type="error"
                                                                                    showIcon
                                                                                />
                                                                            )}
                                                                            {loadingPay && (
                                                                                <div
                                                                                    style={{
                                                                                        marginTop: '200px',
                                                                                    }}
                                                                                >
                                                                                    <Spin size="large" />
                                                                                </div>
                                                                            )}
                                                                            <PayPalButton
                                                                                amount={order.totalPrice}
                                                                                onSuccess={successPaymentHandler}
                                                                            ></PayPalButton>
                                                                        </>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </li>
                                                    )}

                                                    {!order.isPaid && order.paymentMethod === 'VNPay' && (
                                                        <div
                                                            style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                marginBottom: '6px',
                                                            }}
                                                        >
                                                            <div className={cx('vnpay-button')} onClick={handleVNPay}>
                                                                <VnPayIcon />
                                                                <div className={cx('vnpay-button-text')}>Pay Order</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Coin */}

                                                    {!order.isPaid && order.paymentMethod === 'Coin' && (
                                                        <li>
                                                            {!sdkReady ? (
                                                                <div style={{ marginTop: '200px' }}>
                                                                    <Spin size="large" />
                                                                </div>
                                                            ) : (
                                                                <div>
                                                                    <div className={cx('paypal-button')}>
                                                                        <>
                                                                            {errorPay && (
                                                                                <Alert
                                                                                    message="Error"
                                                                                    description={errorPay}
                                                                                    type="error"
                                                                                    showIcon
                                                                                />
                                                                            )}
                                                                            {loadingPay && (
                                                                                <div
                                                                                    style={{
                                                                                        marginTop: '200px',
                                                                                    }}
                                                                                >
                                                                                    <Spin size="large" />
                                                                                </div>
                                                                            )}
                                                                            {/* <PayPalButton
                                                                                        amount={order.totalPrice}
                                                                                        onSuccess={
                                                                                            successPaymentHandler
                                                                                        }
                                                                                    ></PayPalButton> */}
                                                                            <div
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    flexDirection: 'column',
                                                                                    justifyContent: 'center',
                                                                                    width: '100%',
                                                                                    height: '50%',
                                                                                }}
                                                                            >
                                                                                <button
                                                                                    className={cx(
                                                                                        'btn',
                                                                                        'btn-fill-out',
                                                                                        'btn-block',
                                                                                    )}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        height: '50%',
                                                                                    }}
                                                                                    onClick={(e) =>
                                                                                        handleBitcoin(e, 97, '0.01')
                                                                                    }
                                                                                >
                                                                                    Binance
                                                                                </button>
                                                                                <button
                                                                                    className={cx(
                                                                                        'btn',
                                                                                        'btn-fill-out',
                                                                                        'btn-block',
                                                                                    )}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        height: '50%',
                                                                                    }}
                                                                                >
                                                                                    Polygon MATIC
                                                                                </button>
                                                                            </div>
                                                                            {/* <ErrorMessage message={error} />
                                                                                    <TxList txs={txs} /> */}
                                                                            <ErrorMessage message={error} />
                                                                        </>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </li>
                                                    )}

                                                    {order.isPaid ? (
                                                        <>
                                                            <div className={cx('alert')}>
                                                                <Alert
                                                                    message="Success"
                                                                    // description={`Paid at ${order.paidAt}`}
                                                                    description={`Paid at ${new Date(
                                                                        order.paidAt,
                                                                    ).toLocaleDateString('en-GB')} ${new Date(
                                                                        order.paidAt,
                                                                    ).toLocaleTimeString()}`}
                                                                    type="success"
                                                                />
                                                            </div>
                                                            {!order.isRollback ? (
                                                                !JSON.parse(localStorage.getItem('userInfo')).isAdmin &&
                                                                !JSON.parse(localStorage.getItem('userInfo'))
                                                                    .isSeller &&
                                                                calcDate(order.paidAt) &&
                                                                !order.isDelivered && (
                                                                    <>
                                                                        <div
                                                                            className={cx('rollback-btn')}
                                                                            onClick={handleRollBack}
                                                                        >
                                                                            RollBack
                                                                        </div>
                                                                        {loadingRollBack && <Spin size="large" />}
                                                                    </>
                                                                )
                                                            ) : order.isFinishHandleRollback === 'Waiting' ? (
                                                                <div
                                                                    style={{
                                                                        color: 'var(--primary-color)',
                                                                        fontSize: '2.4rem',
                                                                        marginTop: '4px',
                                                                    }}
                                                                >
                                                                    Please Wait For The Admin To Handle Rollback Request
                                                                    Order For You
                                                                </div>
                                                            ) : order.isFinishHandleRollback === 'Success' ? (
                                                                <div
                                                                    style={{
                                                                        color: 'var(--blue-color)',
                                                                        fontSize: '2.4rem',
                                                                        marginTop: '4px',
                                                                    }}
                                                                >
                                                                    Your Rollback Request Order Has Been Accepted
                                                                </div>
                                                            ) : (
                                                                <div
                                                                    style={{
                                                                        color: 'var(--primary-color)',
                                                                        fontSize: '2.4rem',
                                                                        marginTop: '4px',
                                                                    }}
                                                                >
                                                                    Your Rollback Request Order Has Been Failed
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <Alert
                                                            message="Your Payment Status"
                                                            description="You haven't paid this order yet."
                                                            type="warning"
                                                        />
                                                    )}

                                                    <h4
                                                        style={{
                                                            color: '#ff4d4f',
                                                            marginTop: '47px',
                                                            fontSize: '28px',
                                                        }}
                                                    >
                                                        Your Order Delivery Status
                                                    </h4>
                                                    {order.isDelivered ? (
                                                        <Alert
                                                            message="Success"
                                                            // description={`Delivered at ${order.deliveredAt}`}
                                                            description={`Delivered at ${new Date(
                                                                order.deliveredAt,
                                                            ).toLocaleDateString('en-GB')} ${new Date(
                                                                order.deliveredAt,
                                                            ).toLocaleTimeString()}`}
                                                            type="success"
                                                        />
                                                    ) : (
                                                        <Alert
                                                            message="Order Delivery Status"
                                                            description="Your order haven't been delivered yet."
                                                            type="warning"
                                                        />
                                                    )}
                                                    {((userInfo.isAdmin && order.isPaid && !order.isDelivered) ||
                                                        (userInfo.isAdmin &&
                                                            order.paymentMethod === 'Card' &&
                                                            !order.isDelivered)) && (
                                                        <li>
                                                            {loadingDeliver && <Spin size="large" />}
                                                            {errorDeliver && (
                                                                <Alert
                                                                    message="Error"
                                                                    style={{
                                                                        width: '100%',
                                                                        margin: '0 30px 30px',
                                                                    }}
                                                                    description={errorDeliver}
                                                                    type="error"
                                                                    showIcon
                                                                />
                                                            )}
                                                            <button
                                                                className={cx('btn', 'btn-fill-out', 'btn-block')}
                                                                style={{ width: '100%', height: '50%' }}
                                                                type="button"
                                                                onClick={deliverHandler}
                                                            >
                                                                Deliver Order
                                                            </button>
                                                        </li>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Order;
