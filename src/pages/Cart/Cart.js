import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Cart.module.scss';
import CartProductList from './component/CartProductList';
import CartSummary from './component/CartSummary';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert } from 'antd';
import { addToCart } from '~/redux/actions/cartActions';

const cx = classNames.bind(styles);

function Cart() {
    // console.log('init summary');
    const navigate = useNavigate();
    const params = useParams();
    const { id: productId } = params;
    const { search } = useLocation();
    const qtyInUrl = new URLSearchParams(search).get('qty');
    const qty = qtyInUrl ? Number(qtyInUrl) : 1;

    const cart = useSelector((state) => state.cart);
    const { cartItems, error } = cart;

    const dispatch = useDispatch();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    useEffect(() => {
        // console.log('init effect summary');
        if (productId) {
            // console.log('init effect summary1');
            dispatch(addToCart(productId, qty));
            // console.log('end effect summary');
        }
        // console.log('end effect summary1');
    }, [dispatch, productId, qty]);
    return (
        <div className={cx('grid wide')} style={{ marginTop: 'calc(var(--header-height) * 2)' }}>
            {error && <Alert message="Error" description={error} type="error" showIcon />}
            {cartItems.length === 0 ? (
                <Alert
                    message="Your Cart is Empty"
                    description={
                        <div>
                            Cart is empty. <Link to="/">Go Shopping</Link>.
                        </div>
                    }
                    type="info"
                    showIcon
                />
            ) : (
                <div className={cx('cart')}>
                    <CartProductList />
                    <CartSummary />
                </div>
            )}
        </div>
    );
}

export default Cart;
