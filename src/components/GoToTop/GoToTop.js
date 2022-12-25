import { BackTop } from 'antd';
import { UpCircleOutlined, UpOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './GoToTop.module.scss';
const cx = classNames.bind(styles);
const GoToTop = () => (
    <BackTop>
      <span className={cx('go-to-top-btn')}><UpCircleOutlined/></span>
    </BackTop>
);
export default GoToTop;