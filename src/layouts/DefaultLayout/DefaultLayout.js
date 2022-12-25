import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Header from '~/layouts/components/Header';
import styles from './DefaultLayout.module.scss';
import SubHeader from '../components/SubHeader';
import Footer from '../components/Footer';
import { useLocation } from 'react-router-dom';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    // const { pathname } = useLocation();
    return (
        <div className={cx('wrapper')}>
            {/* {pathname.includes('') <Header />} */}
            <Header />
            <SubHeader />
            <div className={cx('container')}>
                <div className={cx('content')} >{children}</div>
            </div>
            <Footer />
        </div>
    );
}

DefaultLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default DefaultLayout;
