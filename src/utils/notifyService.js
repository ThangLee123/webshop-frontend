import { notification } from 'antd';

const showSuccessMessage = (content, placement) => {
    notification.success({
        message: 'Success',
        description: content,
        placement,
    });
};

const showErrorMessage = (content, placement) => {
    notification.error({
        message: 'Error',
        description: content,
        placement,
    });
};

const showWarningMessage = (content) => {
    notification.warning({
        message: 'Error Message',
        description: content,
    });
};

export { showErrorMessage, showWarningMessage, showSuccessMessage };
