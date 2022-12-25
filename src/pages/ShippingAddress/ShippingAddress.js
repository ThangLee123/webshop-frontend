import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import MapGL from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import classNames from 'classnames/bind';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import CheckoutStep from '~/components/CheckoutStep';
import styles from './ShippingAddress.module.scss';
import { Modal, Radio, Space } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod, saveShippingAddress } from '~/redux/actions/cartActions';
import { Link, useNavigate } from 'react-router-dom';
import { VisaIcon, MasterCardIcon, MomoIcon, PaypalIcon, VnPayIcon, CODIcon } from '~/components/Icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { createOrder } from '~/redux/actions/orderActions';
import { ORDER_CREATE_RESET } from '~/redux/constants/orderConstants';
import { CART_EMPTY } from '~/redux/constants/cartConstants';
import { showErrorMessage } from '~/utils/notifyService';
import { SocketContext } from '~/config/socketContext';

const cx = classNames.bind(styles);

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZmFtb3BhMjQ4MSIsImEiOiJjbGJwODE1NG0wN3g1M3ZudnNnOXR2cXU3In0.GgenYnbHX2t9Klm2ZkAyiQ';

function ShippingAddress() {
    const socket = useContext(SocketContext);
    // Mapbox
    const [viewport, setViewport] = useState({
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
    });
    const [sViewport, setSViewport] = useState({
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
    });
    const geocoderContainerRef = useRef();
    const mapRef = useRef();
    const handleViewportChange = useCallback((newViewport) => setViewport(newViewport), []);
    // console.log("List: ",viewport);

    // Get distance between two place
    function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = (Math.PI * lat1) / 180;
        var radlat2 = (Math.PI * lat2) / 180;
        var theta = lon1 - lon2;
        var radtheta = (Math.PI * theta) / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = (dist * 180) / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit === 'K') {
            dist = dist * 1.609344;
        }
        if (unit === 'M') {
            dist = dist * 0.8684;
        }
        return dist;
    }

    // Calculate Price
    const calculatePrice = (distance) => {
        var shippingPrice;
        var bac1 = 0.015,
            bac2 = 0.03,
            bac3 = 0.045,
            bac4 = 0.06,
            bac5 = 0.075,
            bac6 = 0.09;
        if (distance < 0) {
            shippingPrice = 0;
        } else if (distance <= 100) {
            shippingPrice = distance * bac1;
            //  <=100 99=> 99 *a
        } else if (distance <= 200) {
            shippingPrice = 100 * bac1 + (distance - 100) * bac2;
            //  <=200 (199) => 100*a + 99*b (101) => 100*a + 1*b
        } else if (distance <= 400) {
            shippingPrice = 100 * bac1 + 100 * bac2 + (distance - 300) * bac3;
            //  <=400 399 => 100*a +100*b + 199*c (201) => 100a + 100b + 1c
        } else if (distance <= 800) {
            shippingPrice = 100 * bac1 + 100 * bac2 + 200 * bac3 + (distance - 400) * bac4;
            //  <=800 799 => 100a + 100b + 200c + 299d
        } else if (distance <= 1000) {
            shippingPrice = 100 * bac1 + 100 * bac2 + 200 * bac3 + 400 * bac4 + (distance - 800) * bac5;
            //  <=1000 999 => 100a + 100b + 200c + 400e + 199f
        } else if (distance > 1000) {
            shippingPrice = 100 * bac1 + 100 * bac2 + 200 * bac3 + 400 * bac4 + 200 * bac5 + (distance - 1000) * bac6;
            //  >1000 1001 >= 100a + 200a + 200c + 300e + 200f + 1h
        }
        return shippingPrice;
    };
    // Handle ShippingAddress
    const navigate = useNavigate();

    const orderCreate = useSelector((state) => state.orderCreate);
    const { loading, success, error, order } = orderCreate;
    // console.log('orderCr',orderCreate);
    const cart = useSelector((state) => state.cart);
    const { shippingAddress, paymentMethod: paymentMethodInStore } = cart;

    const [fname, setfname] = useState(shippingAddress ? shippingAddress.firstName : '');
    const [lname, setlname] = useState(shippingAddress ? shippingAddress.lastName : '');
    const [billing_address, setbilling_address] = useState(shippingAddress ? shippingAddress.address : '');
    const [houseNo, setHouseNo] = useState(shippingAddress ? shippingAddress.houseNo : '');
    const [zipcode, setzipcode] = useState(shippingAddress ? shippingAddress.postalCode : '');
    const [phone, setphone] = useState(shippingAddress ? shippingAddress.phone : '');
    const [email, setemail] = useState(
        Object.keys(shippingAddress).length !== 0
            ? shippingAddress.email
            : JSON.parse(localStorage.getItem('userInfo')).email,
    );
    const [note, setnote] = useState(shippingAddress ? shippingAddress.note : '');

    const dispatch = useDispatch();

    const { confirm } = Modal;
    const directBuyConfirm = () => {
        confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure to pay the order directly ?',
            okText: 'Yes',
            // cancelText: '取消',
            onOk() {
                // console.log('OK');
                if (!fname || !lname || !billing_address || !houseNo || !zipcode || !phone || !email) {
                    showErrorMessage('Please Fill All Information!', 'topRight');
                    return;
                }
                dispatch(
                    createOrder({
                        ...cart,
                        orderItems: cart.cartItems,
                        shippingAddress: {
                            firstName: fname,
                            lastName: lname,
                            address: billing_address,
                            houseNo: houseNo,
                            postalCode: zipcode,
                            phone: phone,
                            email: email,
                            note: note,
                        },
                    }),
                );
                dispatch({ type: CART_EMPTY });
                localStorage.removeItem('cartItems');
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    };

    const submitHandler = (e) => {
        e.preventDefault();
        //TODO: dispatch save shipping address action
        // console.log(fname, lname, billing_address, houseNo, zipcode, phone, email);
        if (!fname || !lname || !billing_address || !houseNo || !zipcode || !phone || !email) {
            return;
        }
        dispatch(
            saveShippingAddress({
                firstName: fname,
                lastName: lname,
                address: billing_address,
                houseNo: houseNo,
                postalCode: zipcode,
                phone,
                email,
                note,
            }),
        );
        if (paymentMethodInStore === 'Card') {
            directBuyConfirm();
        } else {
            dispatch(
                createOrder({
                    ...cart,
                    orderItems: cart.cartItems,
                    shippingAddress: {
                        firstName: fname,
                        lastName: lname,
                        address: billing_address,
                        houseNo: houseNo,
                        postalCode: zipcode,
                        phone: phone,
                        email: email,
                        note: note,
                    },
                }),
            );
        }
        // navigate('/payment')
    };

    const [paymentMethod, setPaymentMethod] = useState(paymentMethodInStore || 'Card');
    const onChangePaymentMethod = (e) => {
        // console.log('radio checked', e.target.value);
        setPaymentMethod(e.target.value);
        dispatch(savePaymentMethod(e.target.value));
    };

    const toPrice = (num) => Number(num.toFixed(0)); // 5.123 => "5.12" => 5.12
    cart.itemsPrice = toPrice(cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0));
    // cart.shippingPrice = cart.itemsPrice > 100 ? toPrice(0) : toPrice(10);
    cart.shippingPrice = toPrice(
        calculatePrice(distance(sViewport.latitude, sViewport.longitude, viewport.latitude, viewport.longitude, 'K')),
    );
    cart.taxPrice = toPrice(0.15 * cart.itemsPrice);
    cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
    const placeOrderHandler = () => {
        // TODO: dispatch place order action
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
        setbilling_address(geocoderContainerRef.current.children[0].childNodes[1].value);
        // console.log('Get: ',{...viewport});
        // console.log('Distance: ',distance(sViewport.latitude,sViewport.longitude,viewport.latitude,viewport.longitude,'K'))
        // console.log('Price: ',calculatePrice(distance(sViewport.latitude,sViewport.longitude,viewport.latitude,viewport.longitude,'K')))
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (success) {
            // console.log('success', success);
            socket.emit('sendNotifyNewOrder', {});
            navigate(`/order/${order._id}`);
            dispatch({ type: ORDER_CREATE_RESET });
        }
    }, [dispatch, order, navigate, success]);

    return (
        <div>
            <CheckoutStep currentStep={1} disableStep3 />
            <div className={cx('grid wide')}>
                <div className={cx('checkout-content')}>
                    <div className={cx('container')}>
                        <div className={cx('row')}>
                            <div className={cx('col l-6 m-12 c-12')}>
                                <div className={cx('shipping-header')}>
                                    <div className={cx('heading-s1 space-mb--20')}>
                                        <h4 style={{ fontSize: '28px', marginTop: '15px', marginBottom: '15px' }}>
                                            Billing Details
                                        </h4>
                                    </div>
                                    <form>
                                        <div className={cx('form-group')}>
                                            <input
                                                type="text"
                                                className={cx('form-control')}
                                                name="fname"
                                                placeholder="First name *"
                                                value={fname}
                                                onChange={(e) => setfname(e.target.value)}
                                            ></input>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <input
                                                type="text"
                                                className={cx('form-control')}
                                                name="lname"
                                                placeholder="Last name *"
                                                value={lname}
                                                onChange={(e) => setlname(e.target.value)}
                                            ></input>
                                        </div>

                                        <div className={cx('form-group')}>
                                            <input
                                                type="text"
                                                className={cx('form-control')}
                                                name="billing_address"
                                                placeholder="House No. *"
                                                value={houseNo}
                                                onChange={(e) => setHouseNo(e.target.value)}
                                            ></input>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <input
                                                type="text"
                                                className={cx('form-control')}
                                                name="billing_address2"
                                                placeholder="Street/Town/City/Country "
                                                value={billing_address}
                                                onChange={(e) => setbilling_address(e.target.value)}
                                                readOnly="readonly"
                                                onClick={showModal}
                                            ></input>
                                            <Modal
                                                title="Input your Address"
                                                open={isModalOpen}
                                                onOk={handleOk}
                                                onCancel={handleCancel}
                                                maskClosable={false}
                                                width="90vw"
                                                style={{ top: '20px' }}
                                            >
                                                <div style={{ height: '78vh' }}>
                                                    <div
                                                        ref={geocoderContainerRef}
                                                        style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}
                                                    />
                                                    <MapGL
                                                        ref={mapRef}
                                                        {...viewport}
                                                        width="100%"
                                                        height="100%"
                                                        onViewportChange={handleViewportChange}
                                                        mapboxApiAccessToken={MAPBOX_TOKEN}
                                                    >
                                                        <Geocoder
                                                            mapRef={mapRef}
                                                            containerRef={geocoderContainerRef}
                                                            onViewportChange={handleViewportChange}
                                                            mapboxApiAccessToken={MAPBOX_TOKEN}
                                                            position="top-left"
                                                        />
                                                        {/* {isModalOpen &&
                                                            typeof geocoderContainerRef.current !== 'undefined' &&
                                                            console.log(
                                                                'mapref',
                                                                geocoderContainerRef.current.children[0].childNodes[1]
                                                                    .value,
                                                            )} */}
                                                    </MapGL>
                                                </div>
                                            </Modal>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <input
                                                className={cx('form-control')}
                                                required=""
                                                type="text"
                                                name="zipcode"
                                                placeholder="Postcode / ZIP *"
                                                value={zipcode}
                                                onChange={(e) => setzipcode(e.target.value)}
                                            ></input>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <input
                                                className={cx('form-control')}
                                                required=""
                                                type="text"
                                                name="phone"
                                                placeholder="Phone *"
                                                value={phone}
                                                onChange={(e) => setphone(e.target.value)}
                                            ></input>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <input
                                                className={cx('form-control')}
                                                required=""
                                                type="text"
                                                name="email"
                                                placeholder="Email address *"
                                                value={email}
                                                onChange={(e) => setemail(e.target.value)}
                                            ></input>
                                        </div>
                                        <div className={cx('heading-s1 space-mb--20')} style={{ fontSize: '22px' }}>
                                            <h4>Additional information</h4>
                                        </div>
                                        <div className={cx('form-group')}>
                                            <textarea
                                                rows="10"
                                                className={cx('form-control')}
                                                name="note"
                                                placeholder="Order notes"
                                                style={{ height: '120px', resize: 'none' }}
                                                value={note}
                                                onChange={(e) => setnote(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className={cx('col l-6 m-12 c-12')}>
                                <div className={cx('order-review')}>
                                    <div className={cx('heading-s1 space-mb--20')}>
                                        <h4 style={{ fontSize: '28px' }}>Your Orders</h4>
                                    </div>
                                    <div className={cx('table-responsive', 'order_table')}>
                                        <table className={cx('table')}>
                                            <thead>
                                                <tr>
                                                    <th>Product</th>
                                                    <th>Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cart.cartItems.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <Link
                                                                    to={`/product/${item.product}`}
                                                                    className={cx('product-name')}
                                                                >
                                                                    {item.name}{' '}
                                                                </Link>
                                                                <span className={cx('product-qty')}>x {item.qty}</span>
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
                                                        ${cart.itemsPrice.toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Shipping Price</th>
                                                    {/* {console.log(cart.shippingPrice)} */}
                                                    <td style={{ color: 'red' }}>
                                                        {cart.shippingPrice !== 0
                                                            ? `$${cart.shippingPrice.toFixed(2)}`
                                                            : '_ _ _'}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Tax Price</th>
                                                    <td>${cart.taxPrice.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total Price</th>
                                                    <td className={cx('product-subtotal')}>
                                                        ${cart.totalPrice.toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>Convert to Crypto</th>
                                                    <td className={cx('product-subtotal')}>0000</td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    {cart.cartItems.length === 0 ? (
                                        <div>
                                            Cart is empty.{' '}
                                            <Link to="/">
                                                <span className={cx('go-shopping-btn')}>Go Shopping</span>
                                            </Link>
                                            .
                                        </div>
                                    ) : (
                                        <>
                                            <div className={cx('payment-method')}>
                                                <div
                                                    className={cx('heading-s1 space-mb--20')}
                                                    style={{ fontSize: '28px' }}
                                                >
                                                    <h4>Payment</h4>
                                                </div>
                                                <div className={cx('payment-option')}>
                                                    <Radio.Group onChange={onChangePaymentMethod} value={paymentMethod}>
                                                        <Space direction="vertical">
                                                            <Radio value={'Card'}>
                                                                <h3>
                                                                    <span style={{ marginLeft: 10 }}>
                                                                        <CODIcon />
                                                                    </span>
                                                                    <span style={{ marginLeft: 10 }}>
                                                                        Payment on Delivery
                                                                    </span>
                                                                </h3>
                                                                <p>Paying when your package arrived.</p>
                                                            </Radio>
                                                            <Radio value={'VNPay'}>
                                                                <h3>
                                                                    {' '}
                                                                    <span>
                                                                        <VnPayIcon />
                                                                    </span>{' '}
                                                                    VNPay
                                                                </h3>
                                                                <p>We also accepts payment using VNPay</p>
                                                            </Radio>
                                                            <Radio value={'Paypal'}>
                                                                <h3>
                                                                    {' '}
                                                                    <span>
                                                                        <PaypalIcon />
                                                                    </span>
                                                                    Paypal
                                                                </h3>
                                                                <p>
                                                                    Pay via PayPal; you can pay with your credit
                                                                    card/VNPay if you don't have a PayPal account.
                                                                </p>
                                                            </Radio>
                                                            <Radio value={'Coin'}>
                                                                <h3>
                                                                    {' '}
                                                                    <span>
                                                                        <PaypalIcon />
                                                                    </span>
                                                                    Coin
                                                                </h3>
                                                                <p>
                                                                    Using virtual coin that we support to purchase your bill
                                                                </p>
                                                            </Radio>
                                                        </Space>
                                                    </Radio.Group>
                                                </div>
                                            </div>
                                            <button
                                                className={cx('btn', 'btn-fill-out', 'btn-block')}
                                                style={{ width: '100%', height: '50%' }}
                                                onClick={submitHandler}
                                            >
                                                Place Order
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShippingAddress;