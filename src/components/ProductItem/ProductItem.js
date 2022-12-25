import { Rate } from 'antd';
import { StarFilled } from '@ant-design/icons';
import styles from './ProductItem.module.scss';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function ProductItem(props) {
    const { product, isSellerPage } = props;

    return (
        <div className={cx('product', 'product-item-container')}>
            {!isSellerPage ? (
                <Link to={`/product/${product._id}`} className={cx('picture-product')}>
                    <img src={product.image1} alt={product.name} />
                </Link>
            ) : (
                <Link to={`/product/${product._id}`} className={cx('picture-product__seller-page')}>
                    <img src={product.image1} alt={product.name} />
                </Link>
            )}
            <div className={cx('details')} style={{ height: isSellerPage && '90px' }}>
                <div className={cx('details__product')}>
                    <Link to={`/product/${product._id}`} className={cx('details__product-name')}>
                        <b>{product.name}</b>
                    </Link>
                    <br />
                    <Link to={`/seller/${product.seller._id}`} className={cx('details__product-seller-name')}>
                        {product.seller.seller.name}
                    </Link>
                </div>
                <samp>${product.price}</samp>
            </div>
            {!isSellerPage ? (
                <div className={cx('button-product-list')}>
                    <div className={cx('button-product-list__information')}>
                        <div className={cx('star')}>
                            <Rate disabled allowHalf defaultValue={product.rating} />
                        </div>
                        <small>
                            {product.numReviews <= 1
                                ? `${product.numReviews} review `
                                : `${product.numReviews} reviews`}
                        </small>
                    </div>

                    <Link to={`/product/${product._id}`} className={cx('button-add-to-cart-product-list')}>
                        View Product
                    </Link>
                    <Link to={`/product/${product._id}`} className={cx('button-add-to-cart-product-list-mobile')}>
                        View
                    </Link>
                </div>
            ) : (
                <div className={cx('footer-seller-page')}>
                    <div>
                        <span>
                            {product.rating}
                            <StarFilled style={{ color: '#fadb14' }} />
                            {product.numReviews <= 1
                                ? ` ${product.numReviews} review `
                                : ` ${product.numReviews} reviews`}
                        </span>
                    </div>
                    <div>
                        <Link to={`/product/${product._id}`} className={cx('button-add-to-cart-seller-page')}>
                            View
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductItem;
