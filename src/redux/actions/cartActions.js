import Axios from 'axios';
import { axiosInstance } from '~/config/configApiUrl';
import {
    CART_ADD_ITEM,
    CART_REMOVE_ITEM,
    CART_SAVE_SHIPPING_ADDRESS,
    CART_SAVE_PAYMENT_METHOD,
} from '../constants/cartConstants';

export const addToCart = (productId, qty) => async (dispatch, getState) => {
    // console.log('action summary1');
    const { data } = await axiosInstance.get(`/api/products/${productId}`);
    // console.log('xcxcxc', data);
    // console.log('action summary2');
    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            name: data.name,
            image1: data.image1,
            image2: data.image2,
            image3: data.image3,
            price: data.price,
            countInStock: data.countInStock,
            product: data._id,
            seller: data.seller,
            qty,
        },
    });

    // console.log('action summary3');
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
    // console.log('action summary5');
};

export const removeFromCart = (productId) => (dispatch, getState) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: productId });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({ type: CART_SAVE_SHIPPING_ADDRESS, payload: data });
    localStorage.setItem('shippingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({ type: CART_SAVE_PAYMENT_METHOD, payload: data });
    localStorage.setItem('cartSavePaymentMethod', JSON.stringify(data));
};
