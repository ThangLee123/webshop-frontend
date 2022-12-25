import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './CartSummary.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function CartSummary() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const checkoutHandler = () => {
        if (localStorage.getItem("userInfo")) {
            return navigate('/shipping');
        }
        navigate('/signin?redirect=/shipping');
    }
    return (
        <div className={cx('cart-summary')}>
            {/* <div className={cx('cart-summary__container')}>
                <h4 className={cx('cart-summary__header')}>Cart Totals</h4>
                <div className={cx('cart-summary__body')}> */}
            {/* <div className={cx('cart-summary__body-subtotal')}>
                        <div className={cx('cart-summary__body-subtotal-title')}>Cart Subtotal</div>
                        <div className={cx('cart-summary__body-subtotal-price')}>
                            {cartItems.reduce((totalPrice, currentItem) => totalPrice + (currentItem.price * currentItem.qty), 0)}$ ({cartItems.reduce((totalBuyQuantity, currentItem) => totalBuyQuantity + currentItem.qty, 0)} items)
                        </div>
                    </div> */}
            {/* <div className={cx('cart-summary__body-shipping')}>
                        <div className={cx('cart-summary__body-shipping-title')}>Shipping</div>
                        <div className={cx('cart-summary__body-shipping-price')}>Free Shipping</div>
                    </div> */}
            {/* <div className={cx('cart-summary__body-total')}>
                        <div className={cx('cart-summary__body-total-title')}>Total</div>
                        <div className={cx('cart-summary__body-total-price')}>$15.30</div>
                    </div> */}
            {/* </div> */}
            <div className={cx('cart-summary__btn-container')} style={{ marginTop: 20 }}>
                <button className={cx('cart-summary__btn')} onClick={checkoutHandler} disabled={cartItems.length === 0}>Proceed To Checkout</button>
            </div>
            {/* </div> */}
        </div>
    );
}

export default CartSummary;
