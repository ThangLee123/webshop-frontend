import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ProductEdit.module.scss';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Alert, Radio, Space, Spin } from 'antd';

import { detailsProduct, updateProduct } from '~/redux/actions/productActions';
import { PRODUCT_UPDATE_RESET } from '~/redux/constants/productConstants';
import { axiosInstance } from '~/config/configApiUrl';
const cx = classNames.bind(styles);

export default function ProductEdit() {
    const navigate = useNavigate();
    const params = useParams();
    const { id: productId } = params;
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image1, setImage1] = useState('');
    const [imageFile1, setImageFile1] = useState('');
    const [image2, setImage2] = useState('');
    const [imageFile2, setImageFile2] = useState('');
    const [image3, setImage3] = useState('');
    const [imageFile3, setImageFile3] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');

    const productUpdate = useSelector((state) => state.productUpdate);
    const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

    const token = useSelector((state) => state.token);
    const dispatch = useDispatch();
    useEffect(() => {
        if (
            product &&
            product._id === productId &&
            product.seller._id !== JSON.parse(localStorage.getItem('userInfo'))._id
        ) {
            navigate('/');
        }
    }, [navigate, product, productId]);
    useEffect(() => {
        if (successUpdate) {
            if (JSON.parse(localStorage.getItem('userInfo')).isAdmin === true) {
                navigate('/productmanagement');
            } else {
                navigate('/productmanagement/seller');
            }
        }
        if (!product || product._id !== productId || successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            dispatch(detailsProduct(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage1(product.image1);
            setImage2(product.image2);
            setImage3(product.image3);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setBrand(product.brand);
            setDescription(product.description);
        }
    }, [product, dispatch, productId, successUpdate, navigate]);

    const uploadFileHandler = (e, imgNo) => {
        const file = e.target.files[0];
        file.preview = URL.createObjectURL(file);
        if (imgNo === 1) {
            setImage1(file.preview);
            setImageFile1(file);
        } else if (imgNo === 2) {
            setImage2(file.preview);
            setImageFile2(file);
        } else {
            setImage3(file.preview);
            setImageFile3(file);
        }
    };

    const handleUploadFile = async (imgFile) => {
        const bodyFormData = new FormData();
        bodyFormData.append('image', imgFile);
        try {
            // const { data } = await Axios.post("/api/uploads/s3", // upload to upload folder s3
            const { data } = await axiosInstance.post('/api/uploads', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `${token}`,
                },
            });
            return data;
        } catch (error) {
            //   setErrorUpload(error.message);
            //   setLoadingUpload(false);
        }
    };

    // Function to check if value is file or not
    const isFile = (input) => 'File' in window && input instanceof File;

    // Handle Update Product Click
    const submitHandler = async (e) => {
        e.preventDefault();
        let img1 = image1;
        let img2 = image2;
        let img3 = image3;
        if (isFile(imageFile1)) {
            const img1URL = await handleUploadFile(imageFile1);
            img1 = `https://webshop-api.onrender.com${img1URL}`;
        }
        if (isFile(imageFile2)) {
            const img2URL = await handleUploadFile(imageFile2);
            img2 = `https://webshop-api.onrender.com${img2URL}`;
        }
        if (isFile(imageFile3)) {
            const img3URL = await handleUploadFile(imageFile3);
            img3 = `https://webshop-api.onrender.com${img3URL}`;
        }
        dispatch(
            updateProduct({
                _id: productId,
                name,
                price,
                image1: img1,
                image2: img2,
                image3: img3,
                category,
                brand,
                countInStock,
                description,
            }),
        );
    };

    return (
        <div className={cx('wrapper')}>
            <form className={cx('form')} onSubmit={submitHandler}>
                <div>
                    <h1>Edit Product {productId}</h1>
                </div>
                {loadingUpdate && <Spin size="large" />}
                {errorUpdate && (
                    <Alert message="Error" style={{ width: '100%' }} description={errorUpdate} type="error" showIcon />
                )}
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <Alert message="Error" description={error} type="error" showIcon />
                ) : (
                    <>
                        <Link to={`/product/${productId}`}>
                            <button
                                style={{ width: '30%', height: '44px', marginLeft: '10px' }}
                                className={cx('btn', 'btn-fill-out', 'btn-block')}
                            >
                                View Product
                            </button>
                        </Link>
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
                            <label htmlFor="price">Price</label>
                            <input
                                id="price"
                                type="text"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></input>
                        </div>
                        <div className={cx('upload-file-img-container')}>
                            <label htmlFor="image">Product Image 1</label>
                            <input
                                id="image"
                                type="text"
                                placeholder="Choose image file or input url"
                                value={image1}
                                onChange={(e) => setImage1(e.target.value)}
                            ></input>
                            <input
                                type="file"
                                id="img1"
                                style={{ display: 'none' }}
                                onChange={(e) => uploadFileHandler(e, 1)}
                            />
                            <label htmlFor="img1" className={cx('upload-file-img-btn')}>
                                Choose File
                            </label>
                        </div>
                        <div className={cx('upload-file-img-container')}>
                            <label htmlFor="image">Product Image 2</label>
                            <input
                                id="image"
                                type="text"
                                placeholder="Choose image file or input url"
                                value={image2}
                                onChange={(e) => setImage2(e.target.value)}
                            ></input>
                            <input
                                type="file"
                                id="img2"
                                style={{ display: 'none' }}
                                onChange={(e) => uploadFileHandler(e, 2)}
                            />
                            <label htmlFor="img2" className={cx('upload-file-img-btn')}>
                                Choose File
                            </label>
                        </div>
                        <div className={cx('upload-file-img-container')}>
                            <label htmlFor="image">Product Image 3</label>
                            <input
                                id="image"
                                type="text"
                                placeholder="Choose image file or input url"
                                value={image3}
                                onChange={(e) => setImage3(e.target.value)}
                            ></input>
                            <input
                                type="file"
                                id="img3"
                                style={{ display: 'none' }}
                                onChange={(e) => uploadFileHandler(e, 3)}
                            />
                            <label htmlFor="img3" className={cx('upload-file-img-btn')}>
                                Choose File
                            </label>
                        </div>
                        <div>
                            <label htmlFor="category">Category</label>
                            <input
                                id="category"
                                type="text"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="brand">Brand</label>
                            <input
                                id="brand"
                                type="text"
                                placeholder="Enter brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="countInStock">Count In Stock</label>
                            <input
                                id="countInStock"
                                type="text"
                                placeholder="Enter countInStock"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                rows="3"
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label></label>
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
