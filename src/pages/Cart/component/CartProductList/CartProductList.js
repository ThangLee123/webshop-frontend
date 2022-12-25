import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './CartProductList.module.scss';
import { Pagination, Space, Table, Tag, notification } from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { addToCart, removeFromCart } from '~/redux/actions/cartActions';
const cx = classNames.bind(styles);

function CartProductList() {
    // console.log('init plist');
    const cart = useSelector((state) => state.cart);
    // const [qty, setQty] = useState(qtyReceive);
    const { cartItems, success } = cart;
    const dispatch = useDispatch();

    const productDeleteId = useRef();
    const removeFromCartHandler = (productId) => {
        //delete action
        productDeleteId.current = cartItems.find((currentItem) => currentItem.product === productId).name;
        dispatch(removeFromCart(productId));
    };

    useEffect(() => {
        if (success) {
            notification['success']({
                message: 'Delete successfully',
                description: `Product  ${productDeleteId.current} delete successfully`,
            });
        }
    }, [cartItems]);

    const data = cartItems.map((cartItem) => {
        return {
            key: cartItem.product,
            image: cartItem.image1,
            productName: cartItem.name,
            price: `${cartItem.price} $`,
            quantity: cartItem.qty,
            total: `${cartItem.price * cartItem.qty} $`,
            countInStock: Number(cartItem.countInStock),
        };
    });

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (_, { key, image }) => (
                <Link to={`/product/${key}`}>
                    <img src={image} alt="productImage" className={cx('cart-image-product')}></img>
                </Link>
            ),
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Quantity',
            key: 'quantity',
            dataIndex: 'quantity',
            render: (_, { key, quantity, countInStock }) => (
                <div className={cx('cart-product-list__actions-selectQty')}>
                    <select value={quantity} onChange={(e) => dispatch(addToCart(key, Number(e.target.value)))}>
                        {/* <select value={quantity}> */}
                        {[...Array(countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                                {x + 1}
                            </option>
                        ))}
                    </select>
                </div>
            ),
        },
        {
            title: 'Total',
            key: 'total',
            dataIndex: 'total',
        },
        {
            title: 'Remove',
            key: 'remove',
            render: (_, { key }) => (
                <Space
                    className={cx('cart-product-list__space-remove-header')}
                    onClick={() => removeFromCartHandler(key)}
                >
                    <div className={cx('cart-product-list__space-remove-content')}>X</div>
                </Space>
            ),
        },
    ];
    return (
        <div className={cx('cart-product-list')}>
            {/* {// console.log('bind plist')} */}
            <Table columns={columns} dataSource={data} pagination={false} />
        </div>
    );
}

export default CartProductList;
