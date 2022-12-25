import React, { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Radio, Space, Spin, Input, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './OrderHistory.module.scss';
import { listOrderMine } from '~/redux/actions/orderActions';
import { useState } from 'react';
import { SocketContext } from '~/config/socketContext';

const cx = classNames.bind(styles);
const { Search } = Input;
export default function OrderHistory() {
    const socket = useContext(SocketContext);
    const userSignin = useSelector((state) => state.userSignin);
    const orderMineList = useSelector((state) => state.orderMineList);
    const { loading, error, orders, page, pages, totalOrdersCount } = orderMineList;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [searchValue, setSearchValue] = useState('');

    // socket
    const [newNotifySuccessDeliver, setNewNotifySuccessDeliver] = useState(null);
    const [newNotifyHandleRollback, setNewNotifyHandleRollback] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        if (userSignin.userInfo) {
            dispatch(listOrderMine({ searchValue, currentPage, itemsPerPage }));
        }
    }, [dispatch, userSignin.userInfo, currentPage]);

    // socket useEffect
    useEffect(() => {
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
        if (newNotifySuccessDeliver) {
            // console.log('sub4-1');
            // setTimeout(() => {
            dispatch(listOrderMine({ searchValue, currentPage, itemsPerPage }));
            setNewNotifySuccessDeliver(null);
            // }, 500);
        }
        if (newNotifyHandleRollback) {
            // setTimeout(() => {
            setCurrentPage(1);
            dispatch(listOrderMine({ searchValue, currentPage: 1, itemsPerPage }));
            setNewNotifyHandleRollback(null);
            // }, 500);
        }
    }, [dispatch, newNotifySuccessDeliver, newNotifyHandleRollback]);
    const onSearch = (searchValue) => {
        setCurrentPage(1);
        setSearchValue(searchValue);
        dispatch(listOrderMine({ searchValue, currentPage, itemsPerPage }));
    };

    const handleChangePage = (page) => {
        // console.log('page', page);
        setCurrentPage(page);
    };

    return (
        <div className={cx('order-history__container')}>
            <div className={cx('user-management__heading')}>
                <h1>Order History</h1>
                <div style={{ width: '24%', marginBottom: '12px' }}>
                    <Search
                        placeholder="Input orderId, order payment method"
                        onSearch={onSearch}
                        // onChange={(e) => setSearchValue(e.target.value)}
                        enterButton
                    />
                </div>
            </div>
            {loading ? (
                <div style={{ marginTop: '200px' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert message="Error" description={error} type="error" showIcon />
            ) : (
                <>
                    <table className={cx('order-history-table')}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>DATE</th>
                                <th>TOTAL</th>
                                <th>PAID</th>
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
                                    <tr key={order._id}>
                                        <td>{order._id}</td>
                                        {/* <td>{order.createdAt.substring(0, 10)}</td> */}
                                        <td>{`${new Date(order.createdAt).toLocaleDateString('en-GB')} ${new Date(
                                            order.createdAt,
                                        ).toLocaleTimeString()}`}</td>
                                        <td>{order.totalPrice}$</td>
                                        {/* <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td> */}
                                        <td>
                                            {order.isPaid
                                                ? `${new Date(order.paidAt).toLocaleDateString('en-GB')} ${new Date(
                                                      order.paidAt,
                                                  ).toLocaleTimeString()}`
                                                : 'No'}
                                        </td>
                                        {/* <td>{order.isDelivered ? order.deliveredAt.substring(0, 10) : 'No'}</td> */}
                                        <td>
                                            {order.isDelivered
                                                ? `${new Date(order.deliveredAt).toLocaleDateString(
                                                      'en-GB',
                                                  )} ${new Date(order.deliveredAt).toLocaleTimeString()}`
                                                : 'No'}
                                        </td>
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
                </>
            )}
        </div>
    );
}
