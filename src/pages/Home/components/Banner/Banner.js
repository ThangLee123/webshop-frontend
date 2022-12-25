import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Banner.module.scss';
import { Link } from 'react-router-dom';
const cx = classNames.bind(styles);

function Banner() {
    return (
        <div className="banner">
            <div className="grid wide" style={{ height: '100%' }}>
                <div className={cx('banner-list')}>
                    <div className="row ">
                        <div className={cx('col l-4 m-6 c-12', 'mobile-margin')}>
                            <div className={cx('banner-item')}>
                                <Link to="/">
                                    <figure className={cx('effect-apollo')}>
                                        <img
                                            src="/assets/images/banner/shop_banner_img7.jpg"
                                            alt="shop_banner_img3"
                                            className={cx('banner-item__img')}
                                        />
                                        <figcaption></figcaption>
                                    </figure>
                                </Link>
                            </div>
                        </div>
                        <div className={cx('col l-4 m-6 c-12', 'mobile-margin')}>
                            <div className={cx('banner-item')}>
                                <Link to="/">
                                    <figure className={cx('effect-apollo')}>
                                        <img
                                            src="/assets/images/banner/shop_banner_img8.jpg"
                                            alt="shop_banner_img3"
                                            className={cx('banner-item__img')}
                                        />
                                        <figcaption></figcaption>
                                    </figure>
                                </Link>
                            </div>
                        </div>
                        <div className={cx('col l-4 m-6 c-12', 'mobile-margin')}>
                            <div className={cx('banner-item')}>
                                <Link to="/">
                                    <figure className={cx('effect-apollo')}>
                                        <img
                                            src="/assets/images/banner/shop_banner_img9.jpg"
                                            alt="shop_banner_img3"
                                            className={cx('banner-item__img')}
                                        />
                                        <figcaption></figcaption>
                                    </figure>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
