import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { createContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { listOrderRollback } from '~/redux/actions/orderRollbackAction';
const NotifyContext = createContext();

function NotifyProvider({ children }) {
    const [rollbackNotify, setRollbackNotify] = useState(0);
    const [orderNotify, setOrderNotify] = useState(0);

    // console.log('aaaa', rollbackNotify);

    return (
        <NotifyContext.Provider
            value={{ rollbackNotify: [rollbackNotify, setRollbackNotify], orderNotify: [orderNotify, setOrderNotify] }}
        >
            {children}
        </NotifyContext.Provider>
    );
}

export { NotifyContext, NotifyProvider };
