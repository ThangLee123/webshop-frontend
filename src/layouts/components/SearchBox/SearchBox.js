import {} from '@ant-design/icons';
import { Button } from 'antd';
import styles from './SearchBox.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
function SearchBox() {
    return (
        <div className={cx('sub-header__search-container')}>
            <div className={cx('sub-header__search-input')}>
                <input type="text" placeholder="Search Product..."></input>
            </div>
            <div className={cx('sub-header__search-btn')}>
                <Button type="danger">Search</Button>
            </div>
        </div>
    );
}

export default SearchBox;
