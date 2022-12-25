import { SmileOutlined } from '@ant-design/icons';
import { Alert, Button, Input, Spin } from 'antd';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '~/redux/actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '~/redux/constants/userConstants';
import Axios from 'axios';
import { showErrorMessage } from '~/utils/notifyService';
import styles from './UserProfile.module.scss';
import { axiosInstance } from '~/config/configApiUrl';

const cx = classNames.bind(styles);
export default function UserProfile() {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const token = useSelector((state) => state.token);
    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;
    console.log('fff', user);

    // Avatar
    const [imgUrl, setImgUrl] = useState('');
    const [avatar, setAvatar] = useState();
    // console.log('ava ne', avatar);
    // User Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [sellerName, setSellerName] = useState('');
    const [sellerLogo, setSellerLogo] = useState('');
    const [sellerPayment, setSellerPayment] = useState('');
    const [sellerDescription, setSellerDescription] = useState('');

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { success: successUpdate, error: errorUpdate, loading: loadingUpdate } = userUpdateProfile;
    const dispatch = useDispatch();

    useEffect(() => {
        if (userSignin.userInfo) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
            dispatch(detailsUser(userInfo._id));
        }
    }, [dispatch, userInfo, userSignin.userInfo]);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            if (user.seller) {
                setSellerName(user.seller.name);
                setSellerLogo(user.seller.logo);
                setSellerPayment(user.seller.paymentSalaryMethod ? user.seller.paymentSalaryMethod : '');
                setSellerDescription(user.seller.description);
            }
        }
    }, [user]);

    // Remove the last url when change the new avatar
    useEffect(() => {
        return () => {
            avatar && URL.revokeObjectURL(avatar.preview);
        };
    }, [avatar]);

    // Handle file upload avatar
    const handlePreviewAvatar = (e) => {
        const file = e.target.files[0];
        file.preview = URL.createObjectURL(file);
        setAvatar(file);
    };

    const uploadFileHandler = async () => {
        const bodyFormData = new FormData();
        bodyFormData.append('image', avatar);
        try {
            // const { data } = await Axios.post("/api/uploads/s3", // upload to upload folder s3
            const { data } = await axiosInstance.post('/api/uploads', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${token}`,
                },
            });
            dispatch(
                updateUserProfile({
                    userId: user._id,
                    name,
                    email,
                    password,
                    avatar: `https://webshop-api.onrender.com${data}`,
                    sellerName,
                    sellerLogo,
                    sellerPayment,
                    sellerDescription,
                }),
            );
            //   setLoadingUpload(false);
        } catch (error) {
            //   setErrorUpload(error.message);
            //   setLoadingUpload(false);
        }
    };

    const isFile = (input) => 'File' in window && input instanceof File;
    const submitHandler = (e) => {
        e.preventDefault();
        // dispatch update profile
        if (password !== confirmPassword) {
            // alert('Password and Confirm Pasword are not matched');
            showErrorMessage('Password and Confirm Pasword are not matched');
        } else {
            if (isFile(avatar)) {
                uploadFileHandler();
                setImgUrl('');
            } else {
                dispatch(
                    updateUserProfile({
                        userId: user._id,
                        name,
                        email,
                        password,
                        avatar: avatar ? avatar.preview : '',
                        sellerName,
                        sellerLogo,
                        sellerPayment,
                        sellerDescription,
                    }),
                );
                setImgUrl('');
            }
        }
    };

    // Handle by change image url
    const handleFillInputImg = (e) => {
        const randomIMG = [
            'https://c4.wallpaperflare.com/wallpaper/22/441/78/anime-girls-genshin-impact-kamisato-ayaka-genshin-impact-hd-wallpaper-preview.jpg',
            'https://i.redd.it/jcwx0kdkddq71.jpg',
            'https://thicc.mywaifulist.moe/waifus/33593/2add0cb8392db37d41a74e7a61f48f1a63eb4b482654b11dd01ecaa3c40badf2_thumb.jpg',
            'https://pbs.twimg.com/media/FeOJu73VQAE_TRW?format=jpg&name=large',
            'https://pbs.twimg.com/media/FdVqgWrWYAIKWkX?format=jpg&name=medium',
            'https://pbs.twimg.com/media/FciIqpIX0AMP9X4?format=jpg&name=medium',
            'https://pbs.twimg.com/media/Fa7pOeaUUAEKOu7?format=jpg&name=240x240',
            'https://pbs.twimg.com/media/FWlB1WBWIAAM-2A?format=jpg&name=large',
            'https://pbs.twimg.com/media/FZJ29UeVQAAmPBT?format=jpg&name=large',
        ];
        setImgUrl(randomIMG[Math.floor(Math.random() * randomIMG.length)]);
    };
    const handleFillInputClear = (e) => {
        setImgUrl('');
    };

    const handleSubmitInputImg = (e) => {
        setAvatar({ preview: imgUrl });
    };
    return (
        <div>
            <form className={cx('user-profile')} onSubmit={submitHandler}>
                <div>
                    <h1 style={{ fontSize: '28px', marginTop: '60px', marginBottom: '15px' }}>User Profile</h1>
                </div>
                {loading ? (
                    <div style={{ marginTop: '200px' }}>
                        <Spin size="large" />
                    </div>
                ) : error ? (
                    <Alert message="Error" description={error} type="error" showIcon />
                ) : (
                    <>
                        {loadingUpdate && (
                            <div style={{ marginTop: '200px' }}>
                                <Spin size="large" />
                            </div>
                        )}
                        {errorUpdate && <Alert message="Error" description={errorUpdate} type="error" showIcon />}{' '}
                        {/* {successUpdate && (
                            <Alert
                                message="Success"
                                description="Profile Updated Successfully"
                                type="success"
                                showIcon
                            />
                        )} */}
                        <div className={cx('user-avatar-container')}>
                            <div className={cx('user-avatar')}>
                                {/* <Avatar size={64} icon={<UserOutlined />} /> */}
                                <label htmlFor="image">
                                    <input
                                        type="file"
                                        name="image"
                                        id="image"
                                        onChange={handlePreviewAvatar}
                                        style={{ display: 'none' }}
                                    />
                                    <img
                                        src={
                                            avatar
                                                ? avatar.preview
                                                : user
                                                ? user.avatar
                                                : 'https://lh3.googleusercontent.com/ogw/AOh-ky2cDJHc-NTAFLMLBbT19rsSQA5ltof99w0f85eU=s32-c-mo'
                                        }
                                        alt="User Avatar"
                                    />
                                </label>
                            </div>
                            <div className={cx('user-avatar-url')}>
                                Image
                                <Input
                                    className={cx('user-avatar-url-input')}
                                    placeholder="Select Image By Input URL"
                                    prefix={<SmileOutlined style={{ color: '#03dbfc' }} />}
                                    value={imgUrl}
                                    onChange={(e) => setImgUrl(e.target.value)}
                                />
                                <div className={cx('user-avatar-url__button')}>
                                    <Button
                                        type="danger"
                                        className={cx('user-avatar-url__button-submit')}
                                        onClick={handleSubmitInputImg}
                                    >
                                        Select
                                    </Button>
                                    <Button
                                        className={cx('user-avatar-url__button-onFill')}
                                        onClick={handleFillInputImg}
                                    >
                                        Random
                                    </Button>
                                    <Button
                                        className={cx('user-avatar-url__button-clear')}
                                        onClick={handleFillInputClear}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                className={cx('user-profile__input')}
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
                                className={cx('user-profile__input')}
                                id="email"
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                className={cx('user-profile__input')}
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                className={cx('user-profile__input')}
                                id="confirmPassword"
                                type="password"
                                placeholder="Enter confirm password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            ></input>
                        </div>
                        {user && user.isSeller && (
                            <>
                                <h2>Seller</h2>
                                <div>
                                    <label htmlFor="sellerName">Seller Name</label>
                                    <input
                                        className={cx('user-profile__input')}
                                        id="sellerName"
                                        type="text"
                                        placeholder="Enter Seller Name"
                                        value={sellerName}
                                        onChange={(e) => setSellerName(e.target.value)}
                                    ></input>
                                </div>
                                <div>
                                    <label htmlFor="sellerLogo">Seller Logo</label>
                                    <input
                                        className={cx('user-profile__input')}
                                        id="sellerLogo"
                                        type="text"
                                        placeholder="Enter Seller Logo"
                                        value={sellerLogo}
                                        onChange={(e) => setSellerLogo(e.target.value)}
                                    ></input>
                                </div>
                                <div>
                                    <label htmlFor="sellerPayment">Seller Payment</label>
                                    <input
                                        className={cx('user-profile__input')}
                                        id="sellerPayment"
                                        type="text"
                                        placeholder="STK/Tên chủ thẻ/Tên Ngân Hàng "
                                        value={sellerPayment}
                                        onChange={(e) => setSellerPayment(e.target.value)}
                                    ></input>
                                </div>
                                <div>
                                    <label htmlFor="sellerDescription">Seller Description</label>
                                    <input
                                        className={cx('user-profile__input')}
                                        id="sellerDescription"
                                        type="text"
                                        placeholder="Enter Seller Description"
                                        value={sellerDescription}
                                        onChange={(e) => setSellerDescription(e.target.value)}
                                    ></input>
                                </div>
                            </>
                        )}
                        <div>
                            <label />
                            <button className={cx('btn', 'btn-fill-out', 'btn-block')} type="submit">
                                Update
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
