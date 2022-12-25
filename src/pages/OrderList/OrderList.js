import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { Alert, Spin, DatePicker, Input, Pagination } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './OrderList.module.scss';
import { calculateMonthRevenue, deleteOrder, listOrders, updateWatchOrder } from '~/redux/actions/orderActions';
import { MONTH_REVENUE_RESET, ORDER_DELETE_RESET } from '~/redux/constants/orderConstants';
import { useState } from 'react';
import { useContext } from 'react';
import { SocketContext } from '~/config/socketContext';
import { NotifyContext } from '~/config/notificationContext';

const cx = classNames.bind(styles);
const { Search } = Input;

function OrderList() {
    const socket = useContext(SocketContext);
    const { orderNotify } = useContext(NotifyContext);
    const [orderNotifySubHeader, setOrderNotifySubHeader] = orderNotify;

    const { pathname } = useLocation();
    const sellerMode = pathname.indexOf('/seller') >= 0;
    const navigate = useNavigate();
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const orderList = useSelector((state) => state.orderList);
    const { loading, error, orders, page, pages, totalOrdersCount } = orderList;

    const orderDelete = useSelector((state) => state.orderDelete);
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = orderDelete;

    const monthRevenueCalculate = useSelector((state) => state.calculateMonthRevenue);
    const {
        loading: loadingCalculate,
        error: errorCalculate,
        success: successCalculate,
        monthRevenue,
    } = monthRevenueCalculate;

    // console.log('monthRevenue', monthRevenue);

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [searchValue, setSearchValue] = useState('');
    const monthFormat = 'MM/YYYY';

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    // const [totalMonth, setTotalMonth] = useState(0);
    let total = 0;

    // socket
    const [newNotifySuccessPay, setNewNotifySuccessPay] = useState(null);
    const [newNotifySuccessDeliver, setNewNotifySuccessDeliver] = useState(null);
    const [newNotifyHandleRollback, setNewNotifyHandleRollback] = useState(null);

    const dispatch = useDispatch();
    useEffect(() => {
        if (userSignin.userInfo) {
            dispatch({ type: ORDER_DELETE_RESET });
            // dispatch({ type: MONTH_REVENUE_RESET });
            dispatch(
                calculateMonthRevenue({
                    seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
                    month: month,
                    year: year,
                }),
            );
            dispatch(
                listOrders({
                    seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
                    month: month,
                    year: year,
                    searchValue,
                    currentPage,
                    itemsPerPage,
                }),
            );
        }
    }, [dispatch, userSignin.userInfo, successDelete, sellerMode, currentPage, month, year, searchValue]);

    // socket
    useEffect(() => {
        socket.on('getSuccessPay', () => {
            // console.log('adu notify SuccessPay');
            // console.log('sub3-1');
            setNewNotifySuccessPay('yes');
        });
        socket.on('getSuccessDeliver', () => {
            // console.log('adu order notify subheader');
            // console.log('sub3-1');
            setNewNotifySuccessDeliver('yes');
        });
        socket.on('getNotifyHandleRollback', () => {
            // console.log('adu notify');
            setNewNotifyHandleRollback('yes');
        });
    }, []);

    useEffect(() => {
        // console.log('sub4');
        if (newNotifySuccessPay) {
            // console.log('subSuccessPay');
            // setTimeout(() => {
            dispatch({ type: ORDER_DELETE_RESET });
            // dispatch({ type: MONTH_REVENUE_RESET });
            dispatch(
                calculateMonthRevenue({
                    seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
                    month: month,
                    year: year,
                }),
            );
            dispatch(
                listOrders({
                    seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
                    month: month,
                    year: year,
                    searchValue,
                    currentPage,
                    itemsPerPage,
                }),
            );
            setNewNotifySuccessPay(null);
            // }, 500);
        }
        if (newNotifyHandleRollback) {
            dispatch({ type: ORDER_DELETE_RESET });
            // dispatch({ type: MONTH_REVENUE_RESET });
            dispatch(
                calculateMonthRevenue({
                    seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
                    month: month,
                    year: year,
                }),
            );
            dispatch(
                listOrders({
                    seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
                    month: month,
                    year: year,
                    searchValue,
                    currentPage,
                    itemsPerPage,
                }),
            );
            setNewNotifyHandleRollback(null);
        }
    }, [dispatch, newNotifySuccessPay, newNotifyHandleRollback]);
    useEffect(() => {
        // console.log('sub4');
        if (newNotifySuccessDeliver) {
            // console.log('sub4-1');
            // setTimeout(() => {
            dispatch(
                listOrders({
                    seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
                    month: month,
                    year: year,
                    searchValue,
                    currentPage,
                    itemsPerPage,
                }),
            );
            setNewNotifySuccessDeliver(null);
            // }, 500);
        }
    }, [dispatch, newNotifySuccessDeliver]);

    // delete order
    const deleteHandler = (order) => {
        //TODO: delete handler
        if (window.confirm('Are you sure to delete?')) {
            dispatch(deleteOrder(order._id));
        }
    };

    const handleMonthChange = (date, dateString) => {
        const monthAndYearArray = dateString.split('/');
        // console.log(monthAndYearArray);
        setMonth(monthAndYearArray[0]);
        setYear(monthAndYearArray[1]);
        setCurrentPage(1);
        // dispatch(
        //     listOrders({
        //         month: monthAndYearArray[0],
        //         year: monthAndYearArray[1],
        //         seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
        //         searchValue: searchValue,
        //         currentPage,
        //         itemsPerPage,
        //     }),
        // );
        // dispatch(
        //     calculateMonthRevenue({
        //         seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
        //         month: monthAndYearArray[0],
        //         year: monthAndYearArray[1],
        //     }),
        // );
    };

    const onSearch = (value) => {
        setSearchValue(value);
        setCurrentPage(1);
        // dispatch(
        //     listOrders({
        //         seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
        //         searchValue: value,
        //         month: month,
        //         year: year,
        //         currentPage,
        //         itemsPerPage,
        //     }),
        // );
        // dispatch(
        //     calculateMonthRevenue({
        //         seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
        //         month: month,
        //         year: year,
        //     }),
        // );
    };

    const handleChangePage = (page) => {
        // console.log('page', page);
        total = 0;
        setCurrentPage(page);
    };

    const handleWatch = (e, orderId, isWatch) => {
        // console.log('click', orderId);
        // console.log('click', e.target.closest('#table-row'));
        e.target.closest('#table-row1').style.fontWeight = 'normal';
        dispatch(updateWatchOrder(orderId));
        setOrderNotifySubHeader((prev) => {
            if (prev > 0 && !isWatch) return prev - 1;
            else return prev;
        });
        // socket.emit('sendAdminWatchNotifyRollback', {});
    };
    return (
        <div className={cx('order-list__container')}>
            <div className={cx('order-list__heading')}>
                <h1>Orders</h1>
                <div className={cx('order-list-table-filter')}>
                    <div className={cx('order-list-table__search')}>
                        <Search
                            placeholder="Input order id or user order name"
                            onSearch={onSearch}
                            // onChange={(e) => setSearchValue(e.target.value)}
                            enterButton
                        />
                    </div>
                    <div className={cx('order-list-table__datepicker')}>
                        <DatePicker
                            allowClear={false}
                            readOnly="readonly"
                            defaultValue={moment()}
                            format={monthFormat}
                            onChange={handleMonthChange}
                            picker="month"
                        />
                    </div>
                </div>
            </div>
            {/* {loadingDelete && <Spin size="large" />} */}
            {errorDelete && <Alert message="Error" description={errorDelete} type="error" showIcon />}
            {loading ? (
                <div style={{ marginTop: '200px' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert message="Error" description={error} type="error" showIcon />
            ) : (
                <>
                    <table className={cx('order-list-table')}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>USER ORDER NAME</th>
                                <th>DATE</th>
                                <th>ORDER TOTAL</th>
                                {JSON.parse(localStorage.getItem('userInfo')).isSeller && (
                                    <th>
                                        SELLER GET TOTAL <br></br>
                                        {`(order must already paid)`}
                                    </th>
                                )}
                                <th>IS USER PAID</th>
                                <th>DELIVERED</th>
                                <th>PAYMENT METHOD</th>
                                <th>IS ROLLBACK</th>
                                <th>ROLLBACK STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders &&
                                orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        style={{ fontWeight: !order.isWatch && '600' }}
                                        onClick={(e) => handleWatch(e, order._id, order.isWatch)}
                                        id="table-row1"
                                    >
                                        <td>{order._id}</td>
                                        <td>{order.user.name}</td>
                                        {/* <td>{order.createdAt.substring(0, 10)}</td> */}
                                        {/* <td>{new Date(order.createdAt).toLocaleDateString('en-GB')}</td> */}
                                        <td>{`${new Date(order.createdAt).toLocaleDateString('en-GB')} ${new Date(
                                            order.createdAt,
                                        ).toLocaleTimeString()}`}</td>
                                        <td
                                            style={{
                                                color:
                                                    JSON.parse(localStorage.getItem('userInfo')).isAdmin &&
                                                    order.isPaid &&
                                                    order.isFinishHandleRollback !== 'Success' &&
                                                    'var(--primary-color)',
                                            }}
                                        >
                                            {order.totalPrice}$
                                            {/* {console.log('sdsd', typeof order.isFinishHandleRollback)} */}
                                            {JSON.parse(localStorage.getItem('userInfo')).isAdmin &&
                                                order.isPaid &&
                                                order.isFinishHandleRollback !== 'Success' && (
                                                    <span style={{ display: 'none' }}>
                                                        {(total += order.totalPrice)}
                                                    </span>
                                                )}
                                        </td>
                                        {JSON.parse(localStorage.getItem('userInfo')).isSeller && (
                                            <td
                                                style={{
                                                    color:
                                                        order.isPaid &&
                                                        order.isFinishHandleRollback !== 'Success' &&
                                                        'var(--primary-color)',
                                                }}
                                            >
                                                {order.isPaid && order.isFinishHandleRollback !== 'Success'
                                                    ? order.orderItems.reduce((acc, currentItem) => {
                                                          if (
                                                              currentItem.seller._id ===
                                                              JSON.parse(localStorage.getItem('userInfo'))._id
                                                          ) {
                                                              // console.log('avdd1', currentItem);
                                                              // console.log('avdd', acc);
                                                              total += currentItem.price * currentItem.qty;
                                                              return (acc += currentItem.price * currentItem.qty);
                                                          }
                                                          return acc;
                                                      }, 0)
                                                    : '0'}
                                                $
                                            </td>
                                        )}
                                        {/* <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td> */}
                                        <td>
                                            {order.isPaid
                                                ? `${new Date(order.paidAt).toLocaleDateString('en-GB')} ${new Date(
                                                      order.paidAt,
                                                  ).toLocaleTimeString()}`
                                                : 'No'}
                                        </td>
                                        <td>
                                            {order.isDelivered
                                                ? `${new Date(order.deliveredAt).toLocaleDateString(
                                                      'en-GB',
                                                  )} ${new Date(order.deliveredAt).toLocaleTimeString()}`
                                                : 'No'}
                                        </td>
                                        {/* <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td> */}
                                        <td>{order.paymentMethod === 'Card' ? 'Direct Buy' : order.paymentMethod}</td>
                                        <td>{order.isRollback ? 'Yes' : 'No'}</td>
                                        <td>{order.isFinishHandleRollback}</td>
                                        <td>
                                            <button
                                                className={cx('btn', 'btn-fill-out', 'btn-block')}
                                                style={{ width: '100%', height: '50%' }}
                                                onClick={() => {
                                                    navigate(`/order/${order._id}`);
                                                }}
                                            >
                                                Details
                                            </button>
                                            <button
                                                className={cx('btn', 'btn-fill-out', 'btn-block')}
                                                style={{ width: '100%', height: '50%' }}
                                                onClick={() => deleteHandler(order)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className={'container-pagination'}>
                        <Pagination
                            current={currentPage}
                            onChange={handleChangePage}
                            pageSize={itemsPerPage}
                            total={totalOrdersCount}
                        />
                    </div>
                    <div>
                        Revenue From {month}/{year} Page {currentPage}:{' '}
                        <span style={{ color: 'var(--primary-color)' }}>{total}$</span>{' '}
                        {`(count By Order Already Paid)`}
                        <br />
                        Total {JSON.parse(localStorage.getItem('userInfo')).isAdmin ? 'Admin' : 'Seller'} Revenue From{' '}
                        {month}/{year}: <span style={{ color: 'var(--primary-color)' }}>{monthRevenue}$</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default OrderList;
