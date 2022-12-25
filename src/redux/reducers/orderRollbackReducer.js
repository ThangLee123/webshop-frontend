import {
    ORDER_ROLLBACK_CREATE_FAIL,
    ORDER_ROLLBACK_CREATE_REQUEST,
    ORDER_ROLLBACK_CREATE_RESET,
    ORDER_ROLLBACK_CREATE_SUCCESS,
    ORDER_ROLLBACK_HANDLE_FAIL,
    ORDER_ROLLBACK_HANDLE_REQUEST,
    ORDER_ROLLBACK_HANDLE_RESET,
    ORDER_ROLLBACK_HANDLE_SUCCESS,
    ORDER_ROLLBACK_LIST_FAIL,
    ORDER_ROLLBACK_LIST_REQUEST,
    ORDER_ROLLBACK_LIST_RESET,
    ORDER_ROLLBACK_LIST_SUCCESS,
    ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_FAIL,
    ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_REQUEST,
    ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_RESET,
    ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_SUCCESS,
} from '../constants/orderRollbackConstants';

export const orderRollbackCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_ROLLBACK_CREATE_REQUEST:
            return { loading: true };
        case ORDER_ROLLBACK_CREATE_SUCCESS:
            return { loading: false, success: true, orderRollBack: action.payload };
        case ORDER_ROLLBACK_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_ROLLBACK_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const listOrderRollbackReducer = (state = { orderRollbackTable: [] }, action) => {
    switch (action.type) {
        case ORDER_ROLLBACK_LIST_REQUEST:
            return { loading: true };
        case ORDER_ROLLBACK_LIST_SUCCESS:
            return {
                loading: false,
                orderRollbackTable: action.payload.result,
                pages: action.payload.pages,
                page: action.payload.page,
                totalOrderRollbacksCount: action.payload.totalOrderRollbacksCount,
            };
        case ORDER_ROLLBACK_LIST_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_ROLLBACK_LIST_RESET:
            return {};
        default:
            return state;
    }
};

export const handleRollbackOrderReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_ROLLBACK_HANDLE_REQUEST:
            return { loading: true };
        case ORDER_ROLLBACK_HANDLE_SUCCESS:
            return { loading: false, success: true };
        case ORDER_ROLLBACK_HANDLE_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_ROLLBACK_HANDLE_RESET:
            return {};
        default:
            return state;
    }
};

export const updateAdminWatchOrderRollbackReducer = (state = {}, action) => {
    switch (action.type) {
        case ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_REQUEST:
            return { loading: true };
        case ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_SUCCESS:
            return { loading: false, success: true };
        case ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_FAIL:
            return { loading: false, error: action.payload };
        case ORDER_ROLLBACK_UPDATE_ADMIN_WATCH_RESET:
            return {};
        default:
            return state;
    }
};
