import { message } from 'antd';
import Axios from 'axios';
import { axiosInstance } from '~/config/configApiUrl';
import { showErrorMessage, showSuccessMessage } from '~/utils/notifyService';
import { CART_EMPTY } from '../constants/cartConstants';
import {
    MONTH_REVENUE_FAIL,
    MONTH_REVENUE_REQUEST,
    MONTH_REVENUE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS,
    ORDER_DELETE_FAIL,
    ORDER_DELETE_REQUEST,
    ORDER_DELETE_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_SUCCESS,
    ORDER_DETAILS_FAIL,
    ORDER_DETAILS_REQUEST,
    ORDER_DETAILS_SUCCESS,
    ORDER_LIST_FAIL,
    ORDER_LIST_REQUEST,
    ORDER_LIST_SUCCESS,
    ORDER_MINE_LIST_FAIL,
    ORDER_MINE_LIST_REQUEST,
    ORDER_MINE_LIST_SUCCESS,
    ORDER_PAY_FAIL,
    ORDER_PAY_REQUEST,
    ORDER_PAY_SUCCESS,
    ORDER_WATCH_FAIL,
    ORDER_WATCH_REQUEST,
    ORDER_WATCH_SUCCESS,
    PAY_SELLER_SALARY_FAIL,
    PAY_SELLER_SALARY_REQUEST,
    PAY_SELLER_SALARY_SUCCESS,
    SELLER_SALARY_LIST_FAIL,
    SELLER_SALARY_LIST_FAIL1,
    SELLER_SALARY_LIST_REQUEST,
    SELLER_SALARY_LIST_REQUEST1,
    SELLER_SALARY_LIST_SUCCESS,
    SELLER_SALARY_LIST_SUCCESS1,
} from '../constants/orderConstants';
export const createOrder = (order) => async (dispatch, getState) => {
    // console.log('asds', order);
    dispatch({ type: ORDER_CREATE_REQUEST, payload: order });
    try {
        const { token } = getState();
        // console.log(token);
        const { data } = await axiosInstance.post('/api/orders/', order, {
            headers: {
                Authorization: `${token}`,
            },
        });
        showSuccessMessage(`Order Create successfully!`, 'topRight');
        dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.order });
        // dispatch({ type: CART_EMPTY });
        // localStorage.removeItem("cartItems");
    } catch (error) {
        showErrorMessage(
            error.response && error.response.data.message ? error.response.data.message : error.message,
            'topRight',
        );
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const detailsOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DETAILS_REQUEST, payload: orderId });
    try {
        const { token } = getState();
        const { data } = await axiosInstance.get(`/api/orders/${orderId}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};

export const payOrder = (order, paymentResult) => async (dispatch, getState) => {
    dispatch({ type: ORDER_PAY_REQUEST, payload: { order, paymentResult } });
    try {
        const { token } = getState();
        const { data } = await axiosInstance.put(`/api/orders/${order._id}/pay`, paymentResult, {
            headers: {
                Authorization: `${token}`,
            },
        });
        dispatch({ type: ORDER_PAY_SUCCESS, payload: data });
        //     dispatch({ type: CART_EMPTY });
        // localStorage.removeItem("cartItems")
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_PAY_FAIL, payload: message });
    }
};
export const listOrderMine =
    ({ searchValue = '', currentPage = '', itemsPerPage = 4 }) =>
    async (dispatch, getState) => {
        dispatch({ type: ORDER_MINE_LIST_REQUEST });
        try {
            const { token } = getState();
            const { data } = await axiosInstance.get(
                `/api/orders/mine?searchValue=${searchValue}&pageNumber=${currentPage}&itemsPerPage=${itemsPerPage}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            );
            dispatch({ type: ORDER_MINE_LIST_SUCCESS, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            dispatch({ type: ORDER_MINE_LIST_FAIL, payload: message });
        }
    };

export const listOrders =
    ({ seller = '', searchValue = '', month, year, currentPage = '', itemsPerPage = 4 }) =>
    async (dispatch, getState) => {
        dispatch({ type: ORDER_LIST_REQUEST });
        try {
            const { token } = getState();
            const { data } = await axiosInstance.get(
                `/api/orders?seller=${seller}&searchValue=${searchValue}&month=${month}&year=${year}&pageNumber=${currentPage}&itemsPerPage=${itemsPerPage}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            );
            dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            dispatch({ type: ORDER_LIST_FAIL, payload: message });
        }
    };

export const deleteOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELETE_REQUEST, payload: orderId });
    try {
        const { token } = getState();
        const { data } = await axiosInstance.delete(`/api/orders/${orderId}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        // console.log(data);
        dispatch({ type: ORDER_DELETE_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_DELETE_FAIL, payload: message });
    }
};

export const deliverOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_DELIVER_REQUEST, payload: orderId });
    try {
        const { token } = getState();
        const { data } = await axiosInstance.put(
            `/api/orders/${orderId}/deliver`,
            {},
            {
                headers: {
                    Authorization: `${token}`,
                },
            },
        );
        dispatch({ type: ORDER_DELIVER_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_DELIVER_FAIL, payload: message });
    }
};

export const listSellerSalary =
    ({ month = new Date().getMonth() + 1, year = new Date().getFullYear(), searchValue = '' }) =>
    async (dispatch, getState) => {
        // console.log('mmm', month, year);
        dispatch({ type: SELLER_SALARY_LIST_REQUEST });
        try {
            const { token } = getState();
            const { data } = await axiosInstance.get(
                `/api/orders/paySummary?month=${month}&year=${year}&searchValue=${searchValue}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            );
            dispatch({ type: SELLER_SALARY_LIST_SUCCESS, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            dispatch({ type: SELLER_SALARY_LIST_FAIL, payload: message });
        }
    };
export const listSellerSalary1 =
    ({
        month = new Date().getMonth() + 1,
        year = new Date().getFullYear(),
        searchValue = '',
        currentPage = '',
        itemsPerPage = 4,
    }) =>
    async (dispatch, getState) => {
        // console.log('mmm', month, year);
        dispatch({ type: SELLER_SALARY_LIST_REQUEST1 });
        try {
            const { token } = getState();
            const { data } = await axiosInstance.get(
                `/api/orders/paySummary1?month=${month}&year=${year}&searchValue=${searchValue}&pageNumber=${currentPage}&itemsPerPage=${itemsPerPage}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            );
            dispatch({ type: SELLER_SALARY_LIST_SUCCESS1, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            dispatch({ type: SELLER_SALARY_LIST_FAIL1, payload: message });
        }
    };

export const paySellerSalary =
    ({ sellerName, sellerId, payMonth, payYear }) =>
    async (dispatch, getState) => {
        dispatch({ type: PAY_SELLER_SALARY_REQUEST, payload: sellerId });
        try {
            const { token } = getState();
            const { data } = await axiosInstance.put(
                `/api/orders/paySellerSalary/${sellerId}?payMonth=${payMonth}&payYear=${payYear}`,
                {},
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            );
            // console.log(data);
            showSuccessMessage(`Pay Salary ${payMonth}/${payYear} for ${sellerName} successfully!`, 'topRight');
            dispatch({ type: PAY_SELLER_SALARY_SUCCESS, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            dispatch({ type: PAY_SELLER_SALARY_FAIL, payload: message });
        }
    };

export const updateWatchOrder = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_WATCH_REQUEST });
    try {
        const { token } = getState();
        const { data } = await axiosInstance.put(
            `/api/orders/watch/${orderId}`,
            {},
            {
                headers: {
                    Authorization: `${token}`,
                },
            },
        );
        // console.log(data);
        // showSuccessMessage(`Pay Salary ${payMonth}/${payYear} for ${sellerName} successfully!`, 'topRight');
        dispatch({ type: ORDER_WATCH_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_WATCH_FAIL, payload: message });
    }
};

export const calculateMonthRevenue =
    ({ seller = '', month, year }) =>
    async (dispatch, getState) => {
        dispatch({ type: MONTH_REVENUE_REQUEST });
        try {
            const { token } = getState();
            const { data } = await axiosInstance.get(
                `/api/orders/monthRevenue?seller=${seller}&month=${month}&year=${year}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            );
            dispatch({ type: MONTH_REVENUE_SUCCESS, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            dispatch({ type: MONTH_REVENUE_FAIL, payload: message });
        }
    };
