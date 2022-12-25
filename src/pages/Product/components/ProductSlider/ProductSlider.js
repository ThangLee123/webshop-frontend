import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ProductSlider.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);

function ProductSlider(props) {
    const { product } = props;

    const productImagesList = [product.image1, product.image2, product.image3];

    const [activeThumb, setActiveThumb] = useState();
    // console.log(activeThumb);
    useEffect(() => {
        document.querySelector('.swiper-button-prev').innerHTML = '<';
        document.querySelector('.swiper-button-next').innerHTML = '>';
    }, []);
    if (!product) {
        return;
    }
    function MouseOver(event) {
        var prevBtn = document.querySelector('.swiper-button-prev');
        Object.assign(prevBtn.style, {
            visibility: 'visible',
            opacity: 1,
            transition: 'opacity 1s ease',
        });
        var nextBtn = document.querySelector('.swiper-button-next');
        Object.assign(nextBtn.style, {
            visibility: 'visible',
            opacity: 1,
            transition: 'opacity 1s ease',
        });
    }
    function MouseOut(event) {
        var prevBtn = document.querySelector('.swiper-button-prev');
        Object.assign(prevBtn.style, {
            visibility: 'hidden',
            opacity: 0,
            transition: 'opacity 0.5s ease',
        });
        var nextBtn = document.querySelector('.swiper-button-next');
        Object.assign(nextBtn.style, {
            visibility: 'hidden',
            opacity: 0,
            transition: 'opacity 0.5s ease',
        });
    }

    return (
        <div className={cx('product-slider')}>
            <div onMouseOver={MouseOver} onMouseOut={MouseOut}>
                <Swiper
                    loop={true}
                    spaceBetween={10}
                    navigation={true}
                    modules={[Navigation, Thumbs]}
                    grabCursor={true}
                    thumbs={{
                        swiper: activeThumb && !activeThumb.destroyed ? activeThumb : null,
                    }}
                    className="product-images-slider"
                >
                    {productImagesList.map((item, index) => (
                        <SwiperSlide key={index}>
                            <img src={item} alt="product images" />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <Swiper
                    onSwiper={setActiveThumb}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={3}
                    modules={[Navigation, Thumbs]}
                    className="product-images-slider-thumbs"
                >
                    {productImagesList.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div className="product-images-slider-thumbs-wrapper">
                                <img src={item} alt="product images" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default ProductSlider;
