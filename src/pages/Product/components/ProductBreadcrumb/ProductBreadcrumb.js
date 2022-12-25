import { HomeOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ProductBreadcrumb.module.scss';
import { Link, useParams } from 'react-router-dom';
import data from '~/data';

const cx = classNames.bind(styles);

function ProductBreadcrumb(props) {
    const { product } = props;
    // console.log(productId);

    if (!product) {
        return;
    }

    return (
        <div className={cx('product-breadcrumb')}>
            <h1 className={cx('product-breadcrumb__title')}>{product.name}</h1>
            <div className={cx('product-breadcrumb__link')}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <Link to="/">
                            <HomeOutlined />
                        </Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href="">
                        <ShoppingOutlined />
                        <span>Shop</span>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
                </Breadcrumb>
            </div>
        </div>
    );
}

// ProductBreadcrumb.propTypes = {
//     children: PropTypes.node.isRequired,
// };

export default ProductBreadcrumb;
