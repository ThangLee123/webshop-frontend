import { Button, Dropdown, Menu, message, Space } from 'antd';
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { ShoppingCartOutlined, MenuOutlined, CaretRightOutlined, HomeOutlined } from '@ant-design/icons';
import styles from './SubHeader.module.scss';
import classNames from 'classnames/bind';
import { Link, useNavigate } from 'react-router-dom';
import SearchBox from '../SearchBox';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CART_RESET_ITEM } from '~/redux/constants/cartConstants';
import { signout } from '~/redux/actions/userActions';
import { SocketContext } from '~/config/socketContext';
import { NotifyContext } from '~/config/notificationContext';
import { listOrderRollback } from '~/redux/actions/orderRollbackAction';
import { listOrders } from '~/redux/actions/orderActions';

const cx = classNames.bind(styles);
function SubHeader({ isHomePage }) {
    const socket = useContext(SocketContext);
    // console.log('socket SubHeader', socket);
    const { rollbackNotify, orderNotify } = useContext(NotifyContext);
    const [rollbackNotifySubHeader, setRollbackNotifySubHeader] = rollbackNotify;
    const [orderNotifySubHeader, setOrderNotifySubHeader] = orderNotify;
    const [rollbackNotifyTurn, setRollbackNotifyTurn] = useState(null);
    const [newNotifyRollback, setNewNotifyRollback] = useState(null);
    const [newOrderNotify, setNewOrderNotify] = useState(null);
    // const [newAdminWatchNotify, setNewAdminWatchNotify] = useState(null);
    // console.log('aaa SubHeader', rollbackNotifySubHeader);
    // console.log('init subheder');

    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const OrderRollbackList = useSelector((state) => state.listOrderRollback);
    const { loading, error, orderRollbackTable } = OrderRollbackList;

    const orderList = useSelector((state) => state.orderList);
    const { loading: loadingOrder, error: errorOrder, orders } = orderList;
    // console.log('new Sub', newNotifyRollback);
    // console.log('orderRollbackTable Subheader', orderRollbackTable);

    const dispatch = useDispatch();
    const SubHeaderElement = useRef();

    // handle notification
    useEffect(() => {
        // console.log('sub1');
        if (userSignin.userInfo) {
            // let day = date.getDate();
            // console.log('sub1-1');
            dispatch(listOrderRollback({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }));
            dispatch(
                listOrders({
                    seller: JSON.parse(localStorage.getItem('userInfo')).isSeller
                        ? JSON.parse(localStorage.getItem('userInfo'))._id
                        : '',
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                }),
            );
            setRollbackNotifyTurn(1);
        }
    }, [dispatch, userSignin.userInfo]);

    //
    useEffect(() => {
        // console.log('sub2');
        // if (orderRollbackTable) {
        if (orderRollbackTable && rollbackNotifyTurn === 1) {
            // console.log('sub2-1');
            setRollbackNotifySubHeader(
                orderRollbackTable.filter((orderRollback) => orderRollback.isAdminWatch === false).length,
            );
        }
    }, [orderRollbackTable]);

    useEffect(() => {
        // console.log('sub2');
        // if (orderRollbackTable) {
        if (orders && rollbackNotifyTurn === 1) {
            // console.log('sub2-1');
            setOrderNotifySubHeader(orders.filter((order) => order.isWatch === false).length);
        }
    }, [orders]);

    // useEffect for socket
    useEffect(() => {
        // console.log('sub3');
        socket.on('getNotify', () => {
            console.log('adu notify subheader');
            // console.log('sub3-1');
            setNewNotifyRollback('yes');
            setRollbackNotifyTurn(1); // vì dòng 128 trang orderRollback không update orderRollbackList mới nên
            // khi chạy bên đây useEffect sub2 sẽ chạy trc useEffect sub1 vs state cũ nên ta ép nó chạy sau khi useEffect sub1 đã chạy state mới (dòng 48)
        });
        socket.on('getNotifyNewOrder', () => {
            console.log('adu order notify subheader');
            // console.log('sub3-1');
            setNewOrderNotify('yes');
            setRollbackNotifyTurn(1); // vì dòng 128 trang orderRollback không update orderRollbackList mới nên
            // khi chạy bên đây useEffect sub2 sẽ chạy trc useEffect sub1 vs state cũ nên ta ép nó chạy sau khi useEffect sub1 đã chạy state mới (dòng 48)
        });
        // socket.on('getAdminWatchNotifyRollback', () => {
        //     // console.log('adu notify');
        //     setNewAdminWatchNotify('yes');
        //     // setRollbackNotifyTurn(1);
        // });
    }, []);

    useEffect(() => {
        // console.log('sub4');
        if (newNotifyRollback) {
            // console.log('sub4-1');
            // setTimeout(() => {
            dispatch(listOrderRollback({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }));
            setNewNotifyRollback(null);
            // }, 500);
        }
    }, [dispatch, newNotifyRollback]);

    useEffect(() => {
        // console.log('sub4');
        if (newOrderNotify) {
            // console.log('sub4-1');
            // setTimeout(() => {
            dispatch(
                listOrders({
                    seller: JSON.parse(localStorage.getItem('userInfo')).isSeller
                        ? JSON.parse(localStorage.getItem('userInfo'))._id
                        : '',
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                }),
            );
            setNewOrderNotify(null);
            // }, 500);
        }
    }, [dispatch, newOrderNotify]);

    // useEffect(() => {
    //     // console.log('sub4');
    //     if (newAdminWatchNotify) {
    //         // console.log('sub4-1');
    //         // setTimeout(() => {
    //         dispatch(listOrderRollback({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }));
    //         setNewAdminWatchNotify(null);
    //         // }, 500);
    //     }
    // }, [dispatch, newAdminWatchNotify]);

    // handle Scroll
    useEffect(() => {
        const handleScroll = () => {
            // console.log('ssss', window.scrollY);
            // if(window.innerWidth)
            if (window.scrollY >= 56) {
                Object.assign(SubHeaderElement.current.style, {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    zIndex: 2,
                });
            } else {
                Object.assign(SubHeaderElement.current.style, {
                    position: 'unset',
                });
            }
        };
        if (isHomePage) {
            window.addEventListener('scroll', handleScroll);
        } else {
            Object.assign(SubHeaderElement.current.style, {
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                zIndex: 2,
            });
        }

        return () => {
            // console.log('Unmounting...');
            if (isHomePage) {
                window.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const handleMenuClick = (e) => {
        message.info('Click on menu item.');
        // console.log('click', e);
    };

    const menu = (
        <Menu
            onClick={handleMenuClick}
            items={[
                {
                    label: '1st menu item',
                    key: '1',
                    icon: <CaretRightOutlined />,
                },
                {
                    label: '2nd menu item',
                    key: '2',
                    icon: <CaretRightOutlined />,
                },
                {
                    label: '3rd menu item',
                    key: '3',
                    icon: <CaretRightOutlined />,
                },
            ]}
        />
    );

    const handleClickUserMenuProfile = ({ key }) => {
        // message.info(`Click on item ${key}`);
        if (key === '3') {
            socket.emit('removeUser', JSON.parse(localStorage.getItem('userInfo'))._id);
            dispatch(signout());
        } else if (key === '2') {
            navigate('/orderhistory');
        } else if (key === '1') {
            navigate('/profile');
        }
    };
    const menuProfile = (
        <Menu
            onClick={handleClickUserMenuProfile}
            items={[
                {
                    label: 'Profile',
                    key: '1',
                },
                {
                    label: 'Order History',
                    key: '2',
                },
                {
                    type: 'divider',
                },
                {
                    label: 'Logout',
                    key: '3',
                },
            ]}
        />
    );
    const handleClickAdminMenuProfile = ({ key }) => {
        // message.info(`Click on item ${key}`);
        if (key === '7') {
            // console.log('sdsd', socket);
            socket.emit('removeUser', JSON.parse(localStorage.getItem('userInfo'))._id);
            dispatch(signout());
        } else if (key === '1') {
            navigate('/profile');
        } else if (key === '2') {
            navigate('/productmanagement');
        } else if (key === '3') {
            navigate('/orderlist');
        } else if (key === '4') {
            navigate('/userlist');
        } else if (key === '5') {
            navigate('/paySellerSalary');
        } else if (key === '6') {
            navigate('/rollback-order-management');
        }
        // else if (key === '8-1') {
        //     navigate('/orderlist');
        // } else if (key === '8-2') {
        //     navigate('/rollback-order-management');
        // }
    };
    const menuAdminProfile = (
        <Menu
            onClick={handleClickAdminMenuProfile}
            items={[
                {
                    label: 'Profile',
                    key: '1',
                },
                {
                    label: 'Product Management',
                    key: '2',
                },
                {
                    label: 'Order Management',
                    key: '3',
                    icon: (
                        <span
                            style={{ display: orderNotifySubHeader === 0 && 'none' }}
                            className={cx(`${orderNotifySubHeader > 0 && 'counter'}`)}
                        >
                            {orderNotifySubHeader}
                        </span>
                    ),
                },
                {
                    label: 'User Management',
                    key: '4',
                },
                {
                    label: 'Pay Salary Seller Management',
                    key: '5',
                },
                {
                    label: 'Roll Back Order Management',
                    key: '6',
                    icon: (
                        <span
                            style={{ display: rollbackNotifySubHeader === 0 && 'none' }}
                            className={cx(`${rollbackNotifySubHeader > 0 && 'counter'}`)}
                        >
                            {rollbackNotifySubHeader}
                        </span>
                    ),
                },
                // {
                //     key: '8',
                //     label: 'disabled sub menu',
                //     // disabled: true,
                //     children: [
                //         {
                //             key: '8-1',
                //             label: 'Order Management',
                //             icon: (
                //                 <span
                //                     style={{ display: orderNotifySubHeader === 0 && 'none' }}
                //                     className={cx(`${orderNotifySubHeader > 0 && 'counter'}`)}
                //                 >
                //                     {orderNotifySubHeader}
                //                 </span>
                //             ),
                //         },
                //         {
                //             key: '8-2',
                //             label: 'Roll Back Order Management',
                //             icon: (
                //                 <span
                //                     style={{ display: rollbackNotifySubHeader === 0 && 'none' }}
                //                     className={cx(`${rollbackNotifySubHeader > 0 && 'counter'}`)}
                //                 >
                //                     {rollbackNotifySubHeader}
                //                 </span>
                //             ),
                //         },
                //     ],
                // },
                {
                    type: 'divider',
                },
                {
                    label: 'Logout',
                    key: '7',
                },
            ]}
        />
    );
    const handleClickSellerMenuProfile = ({ key }) => {
        // message.info(`Click on item ${key}`);
        if (key === '5') {
            socket.emit('removeUser', JSON.parse(localStorage.getItem('userInfo'))._id);
            dispatch(signout());
        } else if (key === '1') {
            navigate('/profile');
        } else if (key === '2') {
            navigate('/productmanagement/seller');
        } else if (key === '3') {
            navigate('/orderlist/seller');
        } else if (key === '4') {
            navigate(`/seller/${JSON.parse(localStorage.getItem('userInfo'))._id}`);
        }
    };
    const menuSellerProfile = (
        <Menu
            onClick={handleClickSellerMenuProfile}
            items={[
                {
                    label: 'Profile',
                    key: '1',
                },
                {
                    label: 'Product Management',
                    key: '2',
                },
                {
                    label: 'Order Management',
                    key: '3',
                    icon: (
                        <span
                            style={{ display: orderNotifySubHeader === 0 && 'none' }}
                            className={cx(`${orderNotifySubHeader > 0 && 'counter'}`)}
                        >
                            {orderNotifySubHeader}
                        </span>
                    ),
                },
                {
                    label: 'Your Seller Page',
                    key: '4',
                },
                // {
                //     key: '5',
                //     label: 'disabled sub menu',
                //     disabled: true,
                //     children: [
                //         {
                //             key: '5-1',
                //             label: '5d menu item',
                //         },
                //         {
                //             key: '5-2',
                //             label: '6th menu item',
                //         },
                //     ],
                // },
                {
                    type: 'divider',
                },
                {
                    label: 'Logout',
                    key: '5',
                },
            ]}
        />
    );
    return (
        <div className={cx('sub-header')} ref={SubHeaderElement}>
            <div className="grid wide" style={{ height: '100%' }}>
                <div className={cx('sub-header__container')}>
                    <div className={cx('sub-header__category')}>
                        {/* {console.log('bind subheader')} */}
                        <Link to="/">
                            <Button type="danger" size="middle">
                                <HomeOutlined />
                            </Button>
                        </Link>
                        <div className={cx('sub-header__category-btn')}>
                            <Dropdown overlay={menu}>
                                <Button type="danger">
                                    <Space>
                                        <MenuOutlined />
                                        Categories
                                    </Space>
                                </Button>
                            </Dropdown>
                        </div>
                        <div className={cx('sub-header__category-btn-mobile')}>
                            <Dropdown overlay={menu}>
                                <Button type="danger">
                                    <Space>
                                        <MenuOutlined />
                                    </Space>
                                </Button>
                            </Dropdown>
                        </div>
                    </div>
                    <SearchBox />
                    <div className={cx('sub-header__actions')}>
                        {localStorage.getItem('userInfo') &&
                        (JSON.parse(localStorage.getItem('userInfo')).isSeller === true ||
                            JSON.parse(localStorage.getItem('userInfo')).isAdmin === true) ? (
                            <div></div>
                        ) : (
                            <Link
                                to="/cart"
                                className={cx('sub-header__actions-cart')}
                                onClick={() => {
                                    dispatch({ type: CART_RESET_ITEM });
                                }}
                            >
                                <ShoppingCartOutlined />
                                {cartItems.length > 0 && (
                                    <span className={cx('sub-header__actions-cart-notify')}> {cartItems.length}</span>
                                )}
                            </Link>
                        )}

                        {userInfo ? (
                            userInfo.isAdmin === false ? (
                                userInfo.isSeller === false ? (
                                    <div className={cx('sub-header__info-container')}>
                                        <Dropdown overlay={menuProfile} placement="bottomRight" arrow>
                                            <a
                                                href="/"
                                                onClick={(e) => e.preventDefault()}
                                                className={cx('sub-header__info-user-name')}
                                            >
                                                <img
                                                    src={userInfo.avatar}
                                                    alt=""
                                                    className={cx('sub-header__info-user-img')}
                                                />
                                                {userInfo.name}
                                            </a>
                                        </Dropdown>
                                    </div>
                                ) : (
                                    <div className={cx('sub-header__info-container')}>
                                        <Dropdown overlay={menuSellerProfile} placement="bottomRight" arrow>
                                            <a
                                                href="/"
                                                onClick={(e) => e.preventDefault()}
                                                className={cx('sub-header__info-user-name')}
                                            >
                                                <img
                                                    src={userInfo.avatar}
                                                    alt=""
                                                    className={cx('sub-header__info-user-img')}
                                                />
                                                <span
                                                    style={{
                                                        display: orderNotifySubHeader === 0 && 'none',
                                                    }}
                                                    // className={cx(`${rollbackNotifySubHeader > 0 && 'counter1'}`)}
                                                    className={cx(`counter1`)}
                                                ></span>
                                                {userInfo.name}
                                            </a>
                                        </Dropdown>
                                    </div>
                                )
                            ) : (
                                <div className={cx('sub-header__info-container')}>
                                    <Dropdown overlay={menuAdminProfile} placement="bottomRight" arrow>
                                        <a
                                            href="/"
                                            onClick={(e) => e.preventDefault()}
                                            className={cx('sub-header__info-user-name')}
                                        >
                                            <img
                                                src={userInfo.avatar}
                                                alt=""
                                                className={cx('sub-header__info-user-img')}
                                            />
                                            <span
                                                style={{
                                                    display:
                                                        rollbackNotifySubHeader === 0 &&
                                                        orderNotifySubHeader === 0 &&
                                                        'none',
                                                }}
                                                // className={cx(`${rollbackNotifySubHeader > 0 && 'counter1'}`)}
                                                className={cx(`counter1`)}
                                            ></span>
                                            {userInfo.name}
                                        </a>
                                    </Dropdown>
                                </div>
                            )
                        ) : (
                            <Link to="/signin" className={cx('sub-header__actions-signin')}>
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SubHeader;
