import { Alert, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './UserEdit.module.scss';
import classNames from 'classnames/bind';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUser } from '~/redux/actions/userActions';
import { USER_UPDATE_RESET } from '~/redux/constants/userConstants';
import { showErrorMessage } from '~/utils/notifyService';

const cx = classNames.bind(styles);

function UserEdit() {
    const navigate = useNavigate();
    const params = useParams();
    const { id: userId } = params;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSeller, setIsSeller] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdate = useSelector((state) => state.userUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = userUpdate;

    const dispatch = useDispatch();
    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: USER_UPDATE_RESET });
            navigate('/userlist');
        }
        if (!user) {
            dispatch(detailsUser(userId));
        } else {
            // console.log('wwref', user);
            setName(user.name);
            setEmail(user.email);
            setIsSeller(user.isSeller);
            setIsAdmin(user.isAdmin);
        }
    }, [dispatch, navigate, successUpdate, user, userId]);
    const submitHandler = (e) => {
        e.preventDefault();
        // dispatch update user
        if (isSeller && isAdmin) {
            return showErrorMessage('User Can Only Be Admin Or Seller Role', 'topRight');
        }
        dispatch(updateUser({ _id: userId, name, email, isSeller, isAdmin }));
    };
    return (
        <div>
            <form className={cx('user-edit')} onSubmit={submitHandler}>
                <div>
                    <h1 style={{ fontSize: '28px', marginTop: '60px', marginBottom: '15px' }}>Edit User {name}</h1>
                </div>
                {loadingUpdate && <Spin size="large" />}
                {errorUpdate && (
                    <Alert
                        message="Error"
                        style={{ width: '100%', margin: '0 30px 30px' }}
                        description={errorUpdate}
                        type="error"
                        showIcon
                    />
                )}
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <Alert
                        message="Error"
                        style={{ width: '100%', margin: '0 30px 30px' }}
                        description={error}
                        type="error"
                        showIcon
                    />
                ) : (
                    <>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="isSeller">Is Seller</label>
                            <input
                                id="isSeller"
                                type="checkbox"
                                checked={isSeller}
                                onChange={(e) => setIsSeller(e.target.checked)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="isAdmin">Is Admin</label>
                            <input
                                id="isAdmin"
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            ></input>
                        </div>
                        <div>
                            <button type="submit" className={cx('btn', 'btn-fill-out', 'btn-block')}>
                                Update
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}

export default UserEdit;
