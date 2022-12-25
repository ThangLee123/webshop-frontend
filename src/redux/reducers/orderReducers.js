import {
    MONTH_REVENUE_FAIL,
    MONTH_REVENUE_REQUEST,
    MONTH_REVENUE_RESET,
    MONTH_REVENUE_SUCCESS,
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_RESET,
    ORDER_CREATE_SUCCESS,
    ORDER_DELETE_FAIL,
    ORDER_DELETE_REQUEST,
    ORDER_DELETE_RESET,
    ORDER_DELETE_SUCCESS,
    ORDER_DELIVER_FAIL,
    ORDER_DELIVER_REQUEST,
    ORDER_DELIVER_RESET,
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
    ORDER_PAY_RESET,
    ORDER_PAY_SUCCESS,
    ORDER_WATCH_FAIL,
    ORDER_WATCH_REQUEST,
    ORDER_WATCH_RESET,
    ORDER_WATCH_SUCCESS,
    PAY_SELLER_SALARY_FAIL,
    PAY_SELLER_SALARY_REQUEST,
    PAY_SELLER_SALARY_RESET,
    PAY_SELLER_SALARY_SUCCESS,
    SELLER_SALARY_LIST_FAIL,
    SELLER_SALARY_LIST_FAIL1,
    SELLER_SALARY_LIST_REQUEST,
    SELLER_SALARY_LIST_REQUEST1,
    SELLER_SALARY_LIST_SUCCESS,
    SELLER_SALARY_LIST_SUCCESS1,
} from '../constants/orderConstants';

export const orderCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_CREATE_REQUEST:
            return { loading: true };
        case ORDER_CREATE_SUCCESS:
            return { loading: false, success: true, order: action.payload };
        case ORDER_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const orderDetailsReducer = (
    // state={loading:true, order:{}},
    state = { loading: true },
    action,
) => {
    switch (action.type) {
        case ORDER_DETAILS_REQUEST:
            return { loading: true };
        case ORDER_DETAILS_SUCCESS:
            return { loading: false, order: action.payload };
        case ORDER_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const orderPayReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_PAY_REQUEST:
            return { loading: true };
        case ORDER_PAY_SUCCESS:
            return { loading: false, success: true };
        case ORDER_PAY_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_PAY_RESET:
            return {};
        default:
            return state;
    }
};

export const orderMineListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDER_MINE_LIST_REQUEST:
            return { loading: true };
        case ORDER_MINE_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload.resultFilter,
                pages: action.payload.pages,
                page: action.payload.page,
                totalOrdersCount: action.payload.totalOrdersCount,
            };
        case ORDER_MINE_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const orderListReducer = (state = { orders: [] }, action) => {
    switch (action.type) {
        case ORDER_LIST_REQUEST:
            return { loading: true };
        case ORDER_LIST_SUCCESS:
            return {
                loading: false,
                orders: action.payload.resultFilter,
                pages: action.payload.pages,
                page: action.payload.page,
                totalOrdersCount: action.payload.totalOrdersCount,
            };
        case ORDER_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const orderDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_DELETE_REQUEST:
            return { loading: true };
        case ORDER_DELETE_SUCCESS:
            return { loading: false, success: true };
        case ORDER_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_DELETE_RESET:
            return {};
        default:
            return state;
    }
};

export const orderDeliverReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_DELIVER_REQUEST:
            return { loading: true };
        case ORDER_DELIVER_SUCCESS:
            return { loading: false, success: true };
        case ORDER_DELIVER_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_DELIVER_RESET:
            return {};
        default:
            return state;
    }
};

export const listSellerSalaryReducer = (state = { sellerSalaryTable: [] }, action) => {
    switch (action.type) {
        case SELLER_SALARY_LIST_REQUEST:
            return { loading: true };
        case SELLER_SALARY_LIST_SUCCESS:
            return { loading: false, sellerSalaryTable: action.payload };
        case SELLER_SALARY_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
export const listSellerSalaryReducer1 = (state = { sellerSalaryTable: [] }, action) => {
    switch (action.type) {
        case SELLER_SALARY_LIST_REQUEST1:
            return { loading: true };
        case SELLER_SALARY_LIST_SUCCESS1:
            return {
                loading: false,
                sellerSalaryTable: action.payload.result,
                pages: action.payload.pages,
                page: action.payload.page,
                totalSellerPaysCount: action.payload.totalSellerPaysCount,
            };
        case SELLER_SALARY_LIST_FAIL1:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const paySellerSalaryReducer = (state = {}, action) => {
    switch (action.type) {
        case PAY_SELLER_SALARY_REQUEST:
            return { loading: true };
        case PAY_SELLER_SALARY_SUCCESS:
            return { loading: false, success: true };
        case PAY_SELLER_SALARY_FAIL:
            return { loading: false, error: action.payload };
        case PAY_SELLER_SALARY_RESET:
            return {};
        default:
            return state;
    }
};

export const updateWatchOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_WATCH_REQUEST:
            return { loading: true };
        case ORDER_WATCH_SUCCESS:
            return { loading: false, success: true };
        case ORDER_WATCH_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_WATCH_RESET:
            return {};
        default:
            return state;
    }
};

export const calculateMonthRevenueReducer = (state = { monthRevenue: 0 }, action) => {
    switch (action.type) {
        case MONTH_REVENUE_REQUEST:
            return { loading: true };
        case MONTH_REVENUE_SUCCESS:
            return { loading: false, monthRevenue: action.payload };
        case MONTH_REVENUE_FAIL:
            return { loading: false, error: action.payload };
        case MONTH_REVENUE_RESET:
            return {};
        default:
            return state;
    }
};
