import { BackTop } from 'antd';
import { UpCircleOutlined, UpOutlined } from '@ant-design/icons';
import MessengerCustomerChat from 'react-messenger-customer-chat';
import classNames from 'classnames/bind';
import styles from './ChatBot.module.scss';
const cx = classNames.bind(styles);
const ChatBot = () => (
    <>
    <MessengerCustomerChat
    pageId="<PAGE_ID>"
    appId="<APP_ID>"
    htmlRef="<REF_STRING>"
  />,
    </>
);
export default ChatBot;