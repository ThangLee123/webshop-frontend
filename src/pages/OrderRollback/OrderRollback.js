import { React, useContext } from 'react';
import classNames from 'classnames/bind';
import { SocketContext } from '~/config/socketContext';
import { Alert, Spin, Input, DatePicker, Modal, Pagination } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    handleRollbackOrder,
    listOrderRollback,
    updateAdminWatchOrderRollback,
} from '~/redux/actions/orderRollbackAction';
import styles from './OrderRollback.module.scss';
import { NotifyContext } from '~/config/notificationContext';
import { ORDER_ROLLBACK_HANDLE_RESET } from '~/redux/constants/orderRollbackConstants';

const cx = classNames.bind(styles);
const { Search } = Input;
function OrderRollback() {
    const socket = useContext(SocketContext);
    const { rollbackNotify } = useContext(NotifyContext);
    const [rollbackNotifySubHeader, setRollbackNotifySubHeader] = rollbackNotify;

    // console.log('socket orderRollback', socket);

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const OrderRollbackList = useSelector((state) => state.listOrderRollback);
    const { loading, error, orderRollbackTable, page, pages, totalOrderRollbacksCount } = OrderRollbackList;

    const rollbackOrderHandle = useSelector((state) => state.handleRollbackOrder);
    const { loading: loadingHandle, error: errorHandle, success: successHandle } = rollbackOrderHandle;

    const adminWatchOrderRollbackUpdate = useSelector((state) => state.adminWatchOrderRollbackUpdate);
    const {
        loading: loadingAdminUpdate,
        error: errorAdminUpdate,
        success: successAdminUpdate,
    } = adminWatchOrderRollbackUpdate;

    const monthFormat = 'MM/YYYY';
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [searchValue, setSearchValue] = useState('');
    // const [newNotify, setNewNotify] = useState(null);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // useEffect for socket
    // useEffect(() => {
    //     socket.on('getNotify', () => {
    //         console.log('adu notify');
    //         setNewNotify('yes');
    //     });
    // }, []);

    // useEffect(() => {
    //     if (newNotify) {
    //         // setTimeout(() => {
    //         dispatch(listOrderRollback({ month: month, year: year }));
    //         setNewNotify(null);
    //         // }, 500);
    //     }
    // }, [dispatch, newNotify]);

    // useEffect for page
    useEffect(() => {
        if (userSignin.userInfo) {
            // let day = date.getDate();
            dispatch(listOrderRollback({ month: month, year: year, searchValue, currentPage, itemsPerPage }));
        }
    }, [dispatch, userSignin.userInfo, successHandle, currentPage]);
    // }, [dispatch, userSignin.userInfo, successPay]);

    useEffect(() => {
        if (successHandle) {
            console.log('handle rollback');
            socket.emit('sendNotifyHandleRollback', {});
            dispatch({ type: ORDER_ROLLBACK_HANDLE_RESET });
        }
    }, [successHandle]);

    const onSearch = (value) => {
        setSearchValue(value);
        setCurrentPage(1);
        dispatch(listOrderRollback({ searchValue: value, month: month, year: year, currentPage, itemsPerPage }));
    };

    const handleMonthChange = (date, dateString) => {
        const monthAndYearArray = dateString.split('/');
        // console.log(monthAndYearArray);
        setCurrentPage(1);
        setMonth(monthAndYearArray[0]);
        setYear(monthAndYearArray[1]);
        dispatch(
            listOrderRollback({
                month: monthAndYearArray[0],
                year: monthAndYearArray[1],
                searchValue: searchValue,
                currentPage,
                itemsPerPage,
            }),
        );
    };

    const handleChangePage = (page) => {
        // console.log('page', page);
        setCurrentPage(page);
    };

    const handleUserCancelReason = (e) => {
        // console.log('eeee', e.target.innerText);
        Modal.info({
            title: 'User Cancel Reason',
            content: <div>{e.target.innerText}</div>,
            onOk() {},
        });
    };

    const { confirm } = Modal;
    const handleRollBack = (rollbackData) => {
        confirm({
            title: 'Handle RollBack Order',
            icon: <InfoCircleOutlined style={{ color: 'var(--blue-color)' }} />,
            content: (
                <div className="order-rollback-information">
                    {`Are You Sure To ${rollbackData.action === 'Success' ? 'Accept' : 'Deny'} Rollback This Order ?`}
                </div>
            ),
            okText: 'Yes',
            // cancelText: '取消',
            onOk() {
                dispatch(handleRollbackOrder(rollbackData));
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    };

    const handleAdminWatch = (e, orderId, isAdminWatch) => {
        // console.log('click', orderId);
        // console.log('click', e.target.closest('#table-row'));
        e.target.closest('#table-row').style.fontWeight = 'normal';
        dispatch(updateAdminWatchOrderRollback(orderId));
        setRollbackNotifySubHeader((prev) => {
            if (prev > 0 && !isAdminWatch) return prev - 1;
            else return prev;
        });
        // socket.emit('sendAdminWatchNotifyRollback', {});
    };
    return (
        <div className={cx('order-rollback-table-container')}>
            <div className={cx('seller-salary-table__heading')}>
                <h1>Order Rollback</h1>
                <div className={cx('order-rollback-table-filter')}>
                    <div className={cx('order-rollback-table-search')}>
                        <Search
                            placeholder="Input order or user buy id"
                            onSearch={onSearch}
                            onChange={(e) => setSearchValue(e.target.value)}
                            enterButton
                        />
                    </div>
                    <div className={cx('order-rollback-table__datepicker')}>
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
            {/* {loadingPay && <Spin size="large" />} */}
            {errorHandle && <Alert message="Error" description={errorHandle} type="error" showIcon />}
            {loading ? (
                <div style={{ marginTop: '200px' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert message="Error" description={error} type="error" showIcon />
            ) : (
                <>
                    <table className={cx('order-rollback-table')}>
                        <thead>
                            <tr>
                                <th>ORDER ID</th>
                                <th>USER BUY ID</th>
                                <th>TOTAL PRICE</th>
                                <th>USER REASON</th>
                                <th>USER ROLLBACK PAYMENT</th>
                                <th>DATE REQUEST</th>
                                <th>IS HANDLE</th>
                                <th>IS ACCEPT</th>
                                <th>ADMIN HANDLE ID</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderRollbackTable &&
                                orderRollbackTable.map((order, index) => (
                                    <tr
                                        key={index}
                                        style={{ fontWeight: !order.isAdminWatch && '600' }}
                                        onClick={(e) => handleAdminWatch(e, order.orderId._id, order.isAdminWatch)}
                                        id="table-row"
                                    >
                                        <td>{order.orderId._id}</td>
                                        <td>{order.userBuyId}</td>
                                        <td>{order.totalOrderPrice}$</td>
                                        <td onClick={handleUserCancelReason}>
                                            <div className={cx('user-reason-table')}>{order.reasonCancel}</div>
                                        </td>
                                        <td>{order.userPaymentRollBack}</td>
                                        <td>{`${new Date(order.orderId.createdAt).toLocaleDateString(
                                            'en-GB',
                                        )} ${new Date(order.createdAt).toLocaleTimeString()}`}</td>
                                        <td>{order.isAdminHandle ? 'Yes' : 'No'}</td>
                                        <td>{order.isAdminAccept ? 'Yes' : 'No'}</td>
                                        <td>{order.adminHandleId ? order.adminHandleId : 'No'}</td>
                                        <td>
                                            <div
                                                style={{
                                                    display: order.isAdminHandle ? 'none' : 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <div style={{ flex: 1 }}>
                                                    <button
                                                        className={cx('btn', 'btn-fill-out', 'btn-block')}
                                                        style={{}}
                                                        onClick={() =>
                                                            handleRollBack({
                                                                action: 'Success',
                                                                orderId: order.orderId._id,
                                                            })
                                                        }
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <button
                                                        className={cx('btn', 'btn-fill-out', 'btn-block')}
                                                        style={{}}
                                                        onClick={() =>
                                                            handleRollBack({
                                                                action: 'Fail',
                                                                orderId: order.orderId._id,
                                                            })
                                                        }
                                                    >
                                                        Deny
                                                    </button>
                                                </div>
                                            </div>
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
                            total={totalOrderRollbacksCount}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default OrderRollback;
