import { Fragment, useEffect, useRef, createContext } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '~/routes';
import DefaultLayout from '~/layouts';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_SIGNIN_SUCCESS } from './redux/constants/userConstants';
import { fetchUser } from './redux/actions/userActions';
import { useContext } from 'react';
import { SocketContext } from './config/socketContext';
import { axiosInstance } from './config/configApiUrl';

// export const socketContext = createContext();
function App() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const userSignin = useSelector((state) => state.userSignin);
    const socket = useContext(SocketContext);
    // const socket = useRef();

    // useEffect(() => {
    //     socket.current = io('ws://localhost:8900/');
    //     // socket.current.on("getMessage", (data) => {
    //     //   console.log("io arrival message", data);
    //     // //   setArrivalMessage({
    //     // //     sender: data.senderId,
    //     // //     text: data.text,
    //     // //     createdAt: Date.now(),
    //     // //   });
    //     // });
    // }, []);

    useEffect(() => {
        // console.log('thangadvldf');
        // const firstLogin = localStorage.getItem('firstLogin')
        // if (firstLogin) {
        if (!userSignin.userInfo) {
            const getToken = async () => {
                const res = await axiosInstance.post('/api/users/refresh_token', null);
                dispatch({ type: 'GET_TOKEN', payload: res.data.access_token });
            };
            getToken();
        }
    }, [userSignin.isLogged, dispatch, token, userSignin.userInfo]);

    useEffect(() => {
        if (token) {
            const getUser = () => {
                return fetchUser(token).then((res) => {
                    dispatch({ type: USER_SIGNIN_SUCCESS, payload: { userInfo: res.data, isLogged: true } });
                    localStorage.setItem('userInfo', JSON.stringify(res.data));
                    socket.emit('addUser', res.data._id);
                    socket.on('getUsers', (users) => {
                        console.log('adu', users);
                        // setOnlineUsers(
                        //   user.followings.filter((f) => users.some((u) => u.userId === f))
                        // );
                    });
                });
            };
            getUser();
        }
    }, [token, dispatch]);
    return (
        <Router>
            <div className="App">
                <Routes>
                    {publicRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    {privateRoutes.map((route, index) => {
                        const Page = route.component;

                        let Layout = DefaultLayout;

                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }

                        let ProtectRoute = route.isPrivate || route.isAdminPrivate || route.isSellerPrivate;
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    <ProtectRoute>
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    </ProtectRoute>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
