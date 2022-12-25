import {
    PRODUCT_CREATE_FAIL,
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_RESET,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_RESET,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_REVIEW_CREATE_FAIL,
    PRODUCT_REVIEW_CREATE_REQUEST,
    PRODUCT_REVIEW_CREATE_RESET,
    PRODUCT_REVIEW_CREATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_RESET,
    PRODUCT_UPDATE_SUCCESS,
} from '../constants/productConstants';

export const productListReducer = (state = { loading: true, products: [] }, action) => {
    // console.log('reducer1');
    switch (action.type) {
        case PRODUCT_LIST_REQUEST:
            // console.log('reducer2');
            return { loading: true };
        case PRODUCT_LIST_SUCCESS:
            // console.log('reducer3');
            return {
                loading: false,
                products: action.payload.products,
                pages: action.payload.pages,
                page: action.payload.page,
                totalProductsCount: action.payload.totalProductsCount,
            };
        case PRODUCT_LIST_FAIL:
            // console.log('reducer4');
            return { loading: false, error: action.payload };
        default:
            // console.log('reducer5');
            return state;
    }
};

export const productDetailsReducer = (state = { loading: true }, action) => {
    // console.log('reducer11');
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            // console.log('reducer21');
            return { loading: true };
        case PRODUCT_DETAILS_SUCCESS:
            // console.log('reducer31');
            return { loading: false, product: action.payload };
        case PRODUCT_DETAILS_FAIL:
            // console.log('reducer41');
            return { loading: false, error: action.payload };
        default:
            // console.log('reducer51');
            return state;
    }
};
export const productCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_CREATE_REQUEST:
            return { loading: true };
        case PRODUCT_CREATE_SUCCESS:
            return { loading: false, success: true, product: action.payload };
        case PRODUCT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case PRODUCT_CREATE_RESET:
            return {};
        default:
            return state;
    }
};
export const productUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_UPDATE_REQUEST:
            return { loading: true };
        case PRODUCT_UPDATE_SUCCESS:
            return { loading: false, success: true };
        case PRODUCT_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case PRODUCT_UPDATE_RESET:
            return {};
        default:
            return state;
    }
};
export const productDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_DELETE_REQUEST:
            return { loading: true };
        case PRODUCT_DELETE_SUCCESS:
            return { loading: false, success: true };
        case PRODUCT_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case PRODUCT_DELETE_RESET:
            return {};
        default:
            return state;
    }
};

export const productReviewCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case PRODUCT_REVIEW_CREATE_REQUEST:
            return { loading: true };
        case PRODUCT_REVIEW_CREATE_SUCCESS:
            return { loading: false, success: true, review: action.payload };
        case PRODUCT_REVIEW_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case PRODUCT_REVIEW_CREATE_RESET:
            return {};
        default:
            return state;
    }
};
