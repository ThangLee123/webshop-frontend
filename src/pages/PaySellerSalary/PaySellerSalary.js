import { Alert, DatePicker, Input, Space, Spin, Modal, Pagination } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import React from 'react';
import classNames from 'classnames/bind';
import styles from './PaySellerSalary.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
import { listSellerSalary, listSellerSalary1, paySellerSalary } from '~/redux/actions/orderActions';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
const { Search } = Input;
function PaySellerSalary() {
    const monthFormat = 'MM/YYYY';
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const sellerSalaryList = useSelector((state) => state.listSellerSalary1);
    const { loading, error, sellerSalaryTable, page, pages, totalSellerPaysCount } = sellerSalaryList;

    const paySalary = useSelector((state) => state.paySellerSalary);
    const { loading: loadingPay, error: errorPay, success: successPay } = paySalary;

    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [searchValue, setSearchValue] = useState('');

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        if (userSignin.userInfo) {
            // let day = date.getDate();
            dispatch(listSellerSalary1({ month: month, year: year, searchValue, currentPage, itemsPerPage }));
        }
    }, [dispatch, userSignin.userInfo, successPay, currentPage]);

    //handle search datepicker value
    const handleMonthChange = (date, dateString) => {
        const monthAndYearArray = dateString.split('/');
        // console.log(monthAndYearArray);
        setCurrentPage(1);
        setMonth(monthAndYearArray[0]);
        setYear(monthAndYearArray[1]);
        dispatch(
            listSellerSalary1({
                month: monthAndYearArray[0],
                year: monthAndYearArray[1],
                searchValue: searchValue,
                currentPage,
                itemsPerPage,
            }),
        );
    };

    //handle search value
    const onSearch = (value) => {
        setSearchValue(value);
        setCurrentPage(1);
        dispatch(listSellerSalary1({ searchValue: value, month: month, year: year, currentPage, itemsPerPage }));
    };

    const handleChangePage = (page) => {
        // console.log('page', page);
        setCurrentPage(page);
    };

    const { confirm } = Modal;
    const handlePaySellerSalary = ({ sellerName, sellerId }) => {
        confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure to pay the salary for ${sellerName} ?`,
            okText: 'Yes',
            // cancelText: '取消',
            onOk() {
                // console.log('OK');
                dispatch(
                    paySellerSalary({
                        sellerName,
                        sellerId,
                        payMonth: month,
                        payYear: year,
                    }),
                );
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    };

    const handleOnClick = (orderId) => {
        // console.log(orderId);
        Modal.destroyAll();
        navigate(`/order/${orderId}`);
    };

    // Modal OrderId
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOrderTableinfo = (e) => {
        // console.log('qqq', e.target.innerText.split('\n'));
        let orderIdTableInfo = e.target.innerText.split('\n');
        Modal.info({
            title: 'Order Have Seller Product',
            content: (
                <div>
                    {orderIdTableInfo.map((orderId, index) => (
                        <div style={{ cursor: 'pointer', marginBottom: '4px' }} key={index}>
                            <a
                                href={`/order/${orderId}`}
                                // onClick={() => handleOnClick(orderId)}
                                onMouseOver={(e) => {
                                    // console.log('qwq', e.target.style.color);
                                    e.target.style.color = 'var(--primary-color)';
                                }}
                                onMouseOut={(e) => {
                                    // console.log('qwq', e.target.style.color);
                                    e.target.style.color = 'var(--black-color)';
                                }}
                            >
                                {orderId}
                            </a>
                        </div>
                    ))}
                </div>
            ),
            onOk() {},
        });
    };
    return (
        <div className={cx('seller-salary-table-container')}>
            <div className={cx('seller-salary-table__heading')}>
                <h1>Seller Salary</h1>
                <div className={cx('seller-salary-table-filter')}>
                    <div className={cx('seller-salary-table-search')}>
                        <Search
                            placeholder="Input sellerId or seller name"
                            onSearch={onSearch}
                            // onChange={(e) => setSearchValue(e.target.value)}
                            enterButton
                        />
                    </div>
                    <div className={cx('seller-salary-table__datepicker')}>
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
            {errorPay && <Alert message="Error" description={errorPay} type="error" showIcon />}
            {loading ? (
                <div style={{ marginTop: '200px' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert message="Error" description={error} type="error" showIcon />
            ) : (
                <>
                    <table className={cx('seller-salary-table')}>
                        <thead>
                            <tr>
                                <th>SELLER ID</th>
                                <th>SELLER NAME</th>
                                <th>SELLER SHOP NAME</th>
                                <th>SELLER IN ORDERS</th>
                                <th>TOTAL FROM ORDERS</th>
                                <th>SELLER PAYMENT METHOD</th>
                                <th>IS PAID THIS MONTH</th>
                                <th>ADMIN ID PAY</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sellerSalaryTable &&
                                sellerSalaryTable &&
                                sellerSalaryTable.map((sellerItem) => (
                                    <tr key={sellerItem._id}>
                                        {/* {console.log('ưewe', sellerItem)} */}
                                        <td>{sellerItem._id}</td>
                                        <td>{sellerItem.sellerName}</td>
                                        <td>{sellerItem.sellerShopName}</td>
                                        <td onClick={handleOrderTableinfo}>
                                            <div className={cx('orderId-table')}>
                                                {sellerItem.orderId
                                                    ? Array.isArray(sellerItem.orderId)
                                                        ? sellerItem.orderId
                                                              .map((orderItem) => `${orderItem}`)
                                                              .join('\n')
                                                        : sellerItem.orderId
                                                    : ''}
                                            </div>
                                        </td>
                                        <td>{sellerItem.totalFromMonth}$</td>
                                        <td>{sellerItem.paymentSalaryMethod}</td>
                                        <td>{sellerItem.isAdminPay === true ? 'Yes' : 'No'}</td>
                                        <td>{sellerItem.adminPayId ? sellerItem.adminPayId : 'Not Pay'}</td>
                                        <td>
                                            {!sellerItem.isAdminPay && (
                                                <button
                                                    className={cx('btn', 'btn-fill-out', 'btn-block')}
                                                    style={{ width: '100%', height: '50%' }}
                                                    onClick={() => {
                                                        handlePaySellerSalary({
                                                            sellerName: sellerItem.sellerName,
                                                            sellerId: sellerItem._id,
                                                        });
                                                    }}
                                                >
                                                    Pay
                                                </button>
                                            )}
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
                            total={totalSellerPaysCount}
                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default PaySellerSalary;
