import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import Carousel from './components/Carousel';
import { Link } from 'react-router-dom';
import Banner from './components/Banner';
import { useEffect } from 'react';
import ProductList from '../../components/ProductList';
import ProductOutroImage from './components/ProductOutroImage';
import Header from '~/layouts/components/Header';
import SubHeader from '~/layouts/components/SubHeader';
import Footer from '~/layouts/components/Footer';
import GoToTop from '~/components/GoToTop';
import ChatBot from '~/components/ChatBot';

const cx = classNames.bind(styles);

function Home() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <div className={cx('home')}>
            <Header />
            <SubHeader isHomePage />
            <Carousel />
            <Banner />
            <ProductList />
            <ProductOutroImage />
            <ChatBot />
            <GoToTop />
            <Footer />
        </div>
    );
}

// Home.propTypes = {
//     children: PropTypes.node.isRequired,
// };

export default Home;
