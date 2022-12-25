import {
    CART_ADD_ITEM,
    CART_EMPTY,
    CART_REMOVE_ITEM,
    CART_RESET_ITEM,
    CART_SAVE_PAYMENT_METHOD,
    CART_SAVE_SHIPPING_ADDRESS,
} from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
    // console.log('reducer summary');
    switch (action.type) {
        case CART_ADD_ITEM:
            // console.log('reducer summary1');
            const item = action.payload;
            // console.log(item);
            const existItem = state.cartItems.find((x) => x.product === item.product);
            if (existItem) {
                return {
                    ...state,
                    error: '',
                    cartItems: state.cartItems.map((x) => (x.product === existItem.product ? item : x)),
                };
            } else {
                // console.log('reducer summary2');
                return { ...state, error: '', cartItems: [...state.cartItems, item] };
            }
        case CART_REMOVE_ITEM:
            return {
                ...state,
                error: '',
                cartItems: state.cartItems.filter((x) => x.product !== action.payload),
                success: true,
            };
        case CART_RESET_ITEM:
            return {
                cartItems: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
                shippingAddress: localStorage.getItem('shippingAddress')
                    ? JSON.parse(localStorage.getItem('shippingAddress'))
                    : {},
                paymentMethod: localStorage.getItem('cartSavePaymentMethod')
                    ? JSON.parse(localStorage.getItem('cartSavePaymentMethod'))
                    : 'Card',
            };
        case CART_SAVE_SHIPPING_ADDRESS:
            return { ...state, shippingAddress: action.payload };

        case CART_EMPTY:
            return {
                ...state,
                error: '',
                cartItems: [],
            };

        case CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload,
            };

        default:
            // console.log('reducer summary3');
            return state;
    }
};
