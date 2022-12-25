import React from 'react';
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import styles from './Carousel.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
const content = [
    {
        title: 'LED 75 INCH F58',
        description: 'Get up to 50% Off Today',
        button: 'Shop Now',
        image: 'https://oility.jamstacktemplates.dev/assets/images/hero-slider/six/1.jpg',
        user: 'Luan Gjokaj',
        userProfile: 'https://i.imgur.com/JSW6mEk.png',
    },
    {
        title: 'Smart Phones',
        description: '40% Off in All Products',
        button: 'Discover',
        image: 'https://oility.jamstacktemplates.dev/assets/images/hero-slider/six/2.jpg',
        user: 'Erich Behrens',
        userProfile: 'https://i.imgur.com/0Clfnu7.png',
    },
    {
        title: 'Jeat Headphone',
        description: 'Taking your Listening Experience to Next Level',
        button: 'Buy now',
        image: 'https://oility.jamstacktemplates.dev/assets/images/hero-slider/six/3.jpg',
        user: 'Bruno Vizovskyy',
        userProfile: 'https://i.imgur.com/4KeKvtH.png',
    },
];

const Carousel = () => {
    function MouseOver(event) {
        var prevBtn = document.querySelector('.previousButton');
        Object.assign(prevBtn.style, {
            visibility: 'visible',
            opacity: 1,
            transition: 'opacity 1s ease',
        });
        var nextBtn = document.querySelector('.nextButton');
        Object.assign(nextBtn.style, {
            visibility: 'visible',
            opacity: 1,
            transition: 'opacity 1s ease',
        });
    }
    function MouseOut(event) {
        var prevBtn = document.querySelector('.previousButton');
        Object.assign(prevBtn.style, {
            visibility: 'hidden',
            opacity: 0,
            transition: 'opacity 1s ease',
        });
        var nextBtn = document.querySelector('.nextButton');
        Object.assign(nextBtn.style, {
            visibility: 'hidden',
            opacity: 0,
            transition: 'opacity 1s ease',
        });
    }
    return (
        <div className={cx('carousel-container')} onMouseOver={MouseOver} onMouseOut={MouseOut}>
            <Slider className={cx('slider-wrapper')} infinite={true} autoplay={2000}>
                {content.map((item, index) => (
                    <div
                        key={index}
                        className={cx('slider-content')}
                        style={{ background: `url('${item.image}') no-repeat center center` }}
                    >
                        <div className={cx('inner')}>
                            <div className={cx('inner-1')}>
                                <div>
                                    <p>{item.description}</p>
                                </div>
                                <div>
                                    <h1>{item.title}</h1>
                                </div>
                                <div style={{ marginTop: 10 }}>
                                    <button className={cx('button1')}>{item.button}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
