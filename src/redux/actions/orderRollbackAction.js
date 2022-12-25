import Axios from 'axios';
import { axiosInstance } from '~/config/configApiUrl';
import { showErrorMessage, showSuccessMessage } from '~/utils/notifyService';
import {
    ORDER_ROLLBACK_CREATE_FAIL,
    ORDER_ROLLBACK_CREATE_REQUEST,
    ORDER_ROLLBACK_CREATE_SUCCESS,
    ORDER_ROLLBACK_HANDLE_FAIL,
    ORDER_ROLLBACK_HANDLE_REQUEST,
    ORDER_ROLLBACK_HANDLE_SUCCESS,
    ORDER_ROLLBACK_LIST_FAIL,
    ORDER_ROLLBACK_LIST_REQUEST,
    ORDER_ROLLBACK_LIST_SUCCESS,
    ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_FAIL,
    ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_REQUEST,
    ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_SUCCESS,
} from '../constants/orderRollbackConstants';

export const createOrderRollback = (orderRollback, orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_ROLLBACK_CREATE_REQUEST });
    try {
        const { token } = getState();
        const { data } = await axiosInstance.post(`/api/orderRollback/${orderId}`, orderRollback, {
            headers: {
                Authorization: `${token}`,
            },
        });
        showSuccessMessage(`Your RollBack Request has been sent successfully!`, 'topRight');
        dispatch({ type: ORDER_ROLLBACK_CREATE_SUCCESS, payload: data });
        //     dispatch({ type: CART_EMPTY });
        // localStorage.removeItem("cartItems")
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        showErrorMessage(message, 'topRight');
        dispatch({ type: ORDER_ROLLBACK_CREATE_FAIL, payload: message });
    }
};

export const listOrderRollback =
    ({
        month = new Date().getMonth() + 1,
        year = new Date().getFullYear(),
        searchValue = '',
        currentPage = '',
        itemsPerPage = 4,
    }) =>
    async (dispatch, getState) => {
        // console.log('mmm', month, year);
        dispatch({ type: ORDER_ROLLBACK_LIST_REQUEST });
        try {
            const { token } = getState();
            const { data } = await axiosInstance.get(
                `/api/orderRollback?month=${month}&year=${year}&searchValue=${searchValue}&pageNumber=${currentPage}&itemsPerPage=${itemsPerPage}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                },
            );
            dispatch({ type: ORDER_ROLLBACK_LIST_SUCCESS, payload: data });
        } catch (error) {
            const message = error.response && error.response.data.message ? error.response.data.message : error.message;
            dispatch({ type: ORDER_ROLLBACK_LIST_FAIL, payload: message });
        }
    };

export const handleRollbackOrder = (rollbackData) => async (dispatch, getState) => {
    dispatch({ type: ORDER_ROLLBACK_HANDLE_REQUEST, payload: rollbackData });
    try {
        const { token } = getState();
        const { data } = await axiosInstance.put(`/api/orderRollback`, rollbackData, {
            headers: {
                Authorization: `${token}`,
            },
        });
        // console.log(data);
        showSuccessMessage(
            `Order ${rollbackData.orderId} has been ${rollbackData.action === 'Success' ? 'Accepted' : 'Denied'}!`,
            'topRight',
        );
        dispatch({ type: ORDER_ROLLBACK_HANDLE_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_ROLLBACK_HANDLE_FAIL, payload: message });
    }
};

export const updateAdminWatchOrderRollback = (orderId) => async (dispatch, getState) => {
    dispatch({ type: ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_REQUEST });
    try {
        const { token } = getState();
        const { data } = await axiosInstance.put(
            `/api/orderRollback/${orderId}`,
            {},
            {
                headers: {
                    Authorization: `${token}`,
                },
            },
        );
        // console.log(data);
        // showSuccessMessage(`Pay Salary ${payMonth}/${payYear} for ${sellerName} successfully!`, 'topRight');
        dispatch({ type: ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_SUCCESS, payload: data });
    } catch (error) {
        const message = error.response && error.response.data.message ? error.response.data.message : error.message;
        dispatch({ type: ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_FAIL, payload: message });
    }
};
