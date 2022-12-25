import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Rate, Spin, Alert } from 'antd';
import styles from './ProductList.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductItem from '../ProductItem';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '~/redux/actions/productActions';
const cx = classNames.bind(styles);

const Product = () => {
    // console.log('render');
    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;
    // console.log(loading);

    useEffect(() => {
        // console.log('ef1');
        dispatch(listProducts({}));
        // console.log('ef1-1');
    }, [dispatch]);

    useEffect(() => {
        console.log('ef2');
        // console.log(productRef.current);
        let span = document.querySelectorAll('.button-control-product-list svg');
        let product = document.querySelectorAll(`.product-item-container`);
        // console.log(product);
        let product_page = Math.ceil(product.length / 3);
        let l = 0;
        let movePer = 101;
        let maxMove = 203;

        //Mobile view
        let mobile_view = window.matchMedia('(max-width: 768px)');
        if (mobile_view.matches) {
            // movePer = 50.36;
            movePer = 102.5;
            maxMove = 504;
        }

        let right_move = () => {
            l = l + movePer;
            if (product === 1) {
                l = 0;
            }
            for (const i of product) {
                if (l > maxMove) {
                    l = 0;
                }
                i.style.left = '-' + l + '%';
            }
        };
        let left_move = () => {
            l = l - movePer;
            if (l < 0) {
                l = 202;
            }
            if (l === 0) {
                l = 0;
            }
            for (const i of product) {
                if (product_page > 1) {
                    i.style.left = '-' + l + '%';
                }
            }
        };
        span[1].onclick = () => {
            right_move();
        };
        span[0].onclick = () => {
            left_move();
        };
        console.log('ef2-2');
    }, [products]);

    return (
        <div className={cx('grid wide')}>
            {console.log('bind')}
            <div className={cx('product-list')}>
                <div className={cx('product-list-header')}>
                    <h1 className={cx('product-list-header__titile')}>Feature Product</h1>
                    <p className={cx('product-list-header__sub-title')}>Some Of Our New Product</p>
                </div>
                <main>
                    <header>
                        <h1>Choose Your Product</h1>
                        <div className={cx('button-control-productlist')}>
                            <LeftOutlined className={cx('button-control-product-list')} />
                            <RightOutlined className={cx('button-control-product-list')} />
                        </div>
                    </header>
                    {loading ? (
                        <Spin size="large" />
                    ) : error ? (
                        <Alert message="Error" description={error} type="error" showIcon />
                    ) : (
                        <>
                            {products.length === 0 && (
                                <Alert
                                    style={{ width: '100%' }}
                                    message=""
                                    description="No Product Found"
                                    type="info"
                                    showIcon
                                />
                            )}
                            <section>
                                {/* products
                                    .slice(-9)
                                    .reverse() */}
                                {products.reverse().map((product) => {
                                    // console.log('wwww', product);
                                    if (product.countInStock > 0) {
                                        return <ProductItem key={product._id} product={product}></ProductItem>;
                                    }
                                    return;
                                })}
                            </section>
                            <Link to="/" className={cx('view-more-btn')}>
                                View More
                            </Link>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Product;
