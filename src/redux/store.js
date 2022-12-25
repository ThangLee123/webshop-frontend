// eslint-disable-next-line
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import data from '~/data';
import { cartReducer } from './reducers/cartReducers';
import {
    productCreateReducer,
    productDeleteReducer,
    productDetailsReducer,
    productListReducer,
    productReviewCreateReducer,
    productUpdateReducer,
} from './reducers/productReducers';
import {
    userDeleteReducer,
    userDetailsReducer,
    userListReducer,
    userSigninReducer,
    userUpdateProfileReducer,
    userUpdateReducer,
} from './reducers/userReducers';
import tokenReducer from './reducers/tokenReducers';
import {
    calculateMonthRevenueReducer,
    listSellerSalaryReducer,
    listSellerSalaryReducer1,
    orderCreateReducer,
    orderDeleteReducer,
    orderDeliverReducer,
    orderDetailsReducer,
    orderListReducer,
    orderMineListReducer,
    orderPayReducer,
    paySellerSalaryReducer,
    updateWatchOrderReducer,
} from './reducers/orderReducers';
import {
    handleRollbackOrderReducer,
    listOrderRollbackReducer,
    orderRollbackCreateReducer,
    updateAdminWatchOrderRollbackReducer,
} from './reducers/orderRollbackReducer';

const initialState = {
    cart: {
        cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],

        shippingAddress: localStorage.getItem('shippingAddress')
            ? JSON.parse(localStorage.getItem('shippingAddress'))
            : {},

        paymentMethod: localStorage.getItem('cartSavePaymentMethod')
            ? JSON.parse(localStorage.getItem('cartSavePaymentMethod'))
            : 'Card',
    },
};

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    token: tokenReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderMineList: orderMineListReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productDelete: productDeleteReducer,
    orderList: orderListReducer,
    orderDelete: orderDeleteReducer,
    orderDeliver: orderDeliverReducer,
    userList: userListReducer,
    userUpdate: userUpdateReducer,
    userDelete: userDeleteReducer,
    listSellerSalary: listSellerSalaryReducer,
    listSellerSalary1: listSellerSalaryReducer1,
    paySellerSalary: paySellerSalaryReducer,
    OrderRollbackCreate: orderRollbackCreateReducer,
    listOrderRollback: listOrderRollbackReducer,
    handleRollbackOrder: handleRollbackOrderReducer,
    adminWatchOrderRollbackUpdate: updateAdminWatchOrderRollbackReducer,
    watchOrderUpdate: updateWatchOrderReducer,
    productReviewCreate: productReviewCreateReducer,
    calculateMonthRevenue: calculateMonthRevenueReducer,
});
// const reducer = (state, action) => {
//     // console.log('reducer123');
//     return { products: data.products };
// };
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;
