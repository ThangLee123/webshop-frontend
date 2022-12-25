import { message } from 'antd';

const successLoading = () => {
    const hide = message.loading('Loading ...', 0);
    // Dismiss manually and asynchronously
    setTimeout(hide, 1000);
};

export { successLoading }