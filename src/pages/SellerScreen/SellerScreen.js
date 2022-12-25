import React from 'react';
import classNames from 'classnames/bind';
import styles from './SellerScreen.module.scss';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser } from '~/redux/actions/userActions';
import { listProducts } from '~/redux/actions/productActions';
import { Alert, Pagination, Rate, Spin } from 'antd';
import ProductItem from '~/components/ProductItem';
import { useState } from 'react';

const cx = classNames.bind(styles);

function SellerScreen() {
    const params = useParams();
    const { id: sellerId } = params;
    const dispatch = useDispatch();
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const productList = useSelector((state) => state.productList);
    const { loading: loadingProducts, error: errorProducts, products, page, pages, totalProductsCount } = productList;

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    useEffect(() => {
        dispatch(detailsUser(sellerId));
        dispatch(listProducts({ seller: sellerId, currentPage, itemsPerPage }));
    }, [dispatch, sellerId, currentPage]);

    const handleChangePage = (page) => {
        // console.log('page', page);
        setCurrentPage(page);
    };
    return (
        <div style={{ marginTop: 'var(--subHeader-height)' }}>
            <div className={cx('grid wide')}>
                <div className="row">
                    <div className="col l-3">
                        {loading ? (
                            <Spin size="large" />
                        ) : error ? (
                            <Alert message="Error" description={error} type="error" showIcon />
                        ) : (
                            <>
                                {user && (
                                    <div className={cx('seller-info-table')}>
                                        <img
                                            className={cx('seller-info-table__avatar')}
                                            src={user.seller.logo}
                                            alt={user.seller.name}
                                        ></img>
                                        <div className={cx('seller-info-table__name')}>
                                            <h1>{user.seller.name}</h1>
                                        </div>
                                        <div className={cx('seller-info-table__review')}>
                                            <Rate disabled allowHalf defaultValue={user.seller.rating} />(
                                            {user.seller.numReviews > 1
                                                ? `${user.seller.numReviews} reviews`
                                                : `${user.seller.numReviews} review`}
                                            )
                                        </div>
                                        <div className={cx('seller-info-table__mail')}>
                                            <a href={`mailto:${user.email}`}>Contact Seller</a>
                                        </div>
                                        <div className={cx('seller-info-table__description')}>
                                            {user.seller.description}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className="col l-9">
                        {loadingProducts ? (
                            <Spin size="large" />
                        ) : errorProducts ? (
                            <Alert message="Error" description={errorProducts} type="error" showIcon />
                        ) : (
                            <div className="row">
                                {products.length === 0 && (
                                    <Alert
                                        style={{ width: '100%' }}
                                        message=""
                                        description="No Product Found"
                                        type="info"
                                        showIcon
                                    />
                                )}
                                {products
                                    .slice(-9)
                                    .reverse()
                                    .map((product) => {
                                        // console.log('wwww', product);
                                        return (
                                            <div
                                                className="col l-4 m-6 c-12"
                                                key={product._id}
                                                style={{ marginBottom: '20px' }}
                                            >
                                                <div className={cx('seller-productlist')}>
                                                    <ProductItem product={product} isSellerPage></ProductItem>
                                                </div>
                                            </div>
                                        );
                                    })}
                                <div className={'container-pagination'}>
                                    <Pagination
                                        current={currentPage}
                                        onChange={handleChangePage}
                                        pageSize={itemsPerPage}
                                        total={totalProductsCount}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerScreen;
