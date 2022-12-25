import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Product.module.scss';
import { Link, useParams } from 'react-router-dom';
import data from '~/data';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Rate, Spin, Tabs } from 'antd';
import { format } from 'timeago.js';
import { useEffect, useState } from 'react';
import ProductDetail from './components/ProductDetail';
import ProductSlider from './components/ProductSlider';
import ProductBreadcrumb from './components/ProductBreadcrumb';
import { createReview, detailsProduct } from '~/redux/actions/productActions';
import { PRODUCT_REVIEW_CREATE_RESET } from '~/redux/constants/productConstants';
import { showErrorMessage, showSuccessMessage } from '~/utils/notifyService';
import { useContext } from 'react';
import { SocketContext } from '~/config/socketContext';

const cx = classNames.bind(styles);

function Product() {
    const socket = useContext(SocketContext);
    // console.log('init');
    const params = useParams();
    const { id: productId } = params;
    // console.log(productId);

    const dispatch = useDispatch();
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const productReviewCreate = useSelector((state) => state.productReviewCreate);
    const {
        loading: loadingReviewCreate,
        error: errorReviewCreate,
        success: successReviewCreate,
        review,
    } = productReviewCreate;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [newComment, setNewComment] = useState(null);
    useEffect(() => {
        // console.log('dis1');
        if (successReviewCreate) {
            // window.alert('Review Submitted Successfully');
            showSuccessMessage('Review Submitted Successfully', 'topRight');
            setRating('');
            setComment('');
            socket.emit('sendProductComment', {});
            dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
        }
        dispatch(detailsProduct(productId));
        // console.log('dis2');
    }, [dispatch, productId, successReviewCreate]);
    // if (!product) {
    //     return <div>Product Not Found</div>;
    // }
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // useEffect for socket
    useEffect(() => {
        socket.on('getProductComment', () => {
            // console.log('adu notify');
            setNewComment('yes');
        });
    }, []);

    useEffect(() => {
        if (newComment) {
            // setTimeout(() => {
            dispatch(detailsProduct(productId));
            setNewComment(null);
            // }, 500);
        }
    }, [dispatch, newComment]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (comment && rating) {
            dispatch(
                createReview(productId, {
                    rating,
                    comment,
                    name: userInfo.name,
                    avatar: userInfo.avatar,
                    userId: userInfo._id,
                }),
            );
        } else {
            showErrorMessage('Please enter comment and rating', 'topRight');
        }
    };

    const handleShowError = (error) => {
        showErrorMessage(error, 'topRight');
        dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    };

    const onChangeTabs = (key) => {
        console.log(key);
    };

    return (
        <>
            {/* {// console.log('bind-product')} */}
            {loading ? (
                <div style={{ marginTop: '100px' }}>
                    <Spin size="large" />
                </div>
            ) : error ? (
                <Alert message="Error" description={error} type="error" showIcon />
            ) : (
                <div className={cx('product')}>
                    <ProductBreadcrumb product={product} />
                    <div className={cx('grid wide')} style={{ marginTop: '100px' }}>
                        <div className={cx('row')}>
                            <div className={cx('col l-5 c-12')} style={{ overflow: 'hidden' }}>
                                <ProductSlider product={product} />
                            </div>
                            <div className={cx('col l-7 c-12')}>
                                <ProductDetail product={product} />
                            </div>
                        </div>
                        <div>
                            <div>
                                {/* <Tabs type="card" items={items} /> */}
                                <Tabs
                                    defaultActiveKey="2"
                                    onChange={onChangeTabs}
                                    items={[
                                        {
                                            label: `Description`,
                                            key: '1',
                                            children: `Content of Tab Pane 1`,
                                        },
                                        {
                                            label: `Reviews`,
                                            key: '2',
                                            children: (
                                                <div>
                                                    {product.reviews.length === 0 && (
                                                        <Alert message="There is no review" type="info" showIcon />
                                                    )}
                                                    <ul>
                                                        {product.reviews.map((review) => (
                                                            <li key={review._id}>
                                                                <div style={{ display: 'flex' }}>
                                                                    <div>
                                                                        <img
                                                                            src={review.avatar}
                                                                            alt=""
                                                                            className={cx('product__user-review-img')}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <span>
                                                                            <strong>{review.name}</strong>{' '}
                                                                            <span
                                                                                style={{
                                                                                    color: '#aaa',
                                                                                    marginLeft: '2px',
                                                                                }}
                                                                            >
                                                                                {format(review.createdAt)}
                                                                            </span>
                                                                        </span>
                                                                        {/* <Rating rating={review.rating} caption=" "></Rating> */}
                                                                        <div className={cx('product__user-rating')}>
                                                                            <Rate
                                                                                disabled
                                                                                allowHalf
                                                                                defaultValue={review.rating}
                                                                            />
                                                                        </div>
                                                                        {/* <p>{review.createdAt.substring(0, 10)}</p> */}
                                                                        <p>{review.comment}</p>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                        <li>
                                                            {userInfo ? (
                                                                !product.reviews.some(
                                                                    (review) => review.userId === userInfo._id,
                                                                ) ? (
                                                                    <form
                                                                        className={cx('form')}
                                                                        onSubmit={submitHandler}
                                                                    >
                                                                        <div>
                                                                            <h2>Write a customer review</h2>
                                                                        </div>
                                                                        <div>
                                                                            <label htmlFor="rating">Rating</label>
                                                                            <select
                                                                                id="rating"
                                                                                className={cx(
                                                                                    'product_user_review__select',
                                                                                )}
                                                                                value={rating}
                                                                                onChange={(e) =>
                                                                                    setRating(e.target.value)
                                                                                }
                                                                            >
                                                                                <option value="">Select ...</option>
                                                                                <option value="1">1- Poor</option>
                                                                                <option value="2">2- Fair</option>
                                                                                <option value="3">3- Good</option>
                                                                                <option value="4">4- Very Good</option>
                                                                                <option value="5">5- Excelent</option>
                                                                            </select>
                                                                        </div>
                                                                        <div>
                                                                            <label htmlFor="comment">Comment</label>
                                                                            <textarea
                                                                                id="comment"
                                                                                className={cx(
                                                                                    'product_user_review__textarea',
                                                                                )}
                                                                                value={comment}
                                                                                onChange={(e) =>
                                                                                    setComment(e.target.value)
                                                                                }
                                                                            ></textarea>
                                                                        </div>
                                                                        <div style={{ alignItems: 'center' }}>
                                                                            <button
                                                                                className={cx('vnpay-button')}
                                                                                type="submit"
                                                                            >
                                                                                Submit
                                                                            </button>
                                                                        </div>
                                                                        <div>
                                                                            {loadingReviewCreate && (
                                                                                <Spin size="large" />
                                                                            )}
                                                                            {/* {errorReviewCreate && (
                                                                    <Alert
                                                                        message="Error"
                                                                        description={errorReviewCreate}
                                                                        type="error"
                                                                        showIcon
                                                                    />
                                                                )} */}
                                                                            {errorReviewCreate &&
                                                                                handleShowError(errorReviewCreate)}
                                                                        </div>
                                                                    </form>
                                                                ) : (
                                                                    <div></div>
                                                                )
                                                            ) : (
                                                                <Alert
                                                                    message={
                                                                        <div>
                                                                            Please{' '}
                                                                            <Link
                                                                                to="/signin"
                                                                                className={cx('signin-btn')}
                                                                            >
                                                                                Sign In
                                                                            </Link>{' '}
                                                                            to write a review
                                                                        </div>
                                                                    }
                                                                    type="info"
                                                                    showIcon
                                                                />
                                                            )}
                                                        </li>
                                                    </ul>
                                                </div>
                                            ),
                                        },
                                        // {
                                        //     label: `Tab 3`,
                                        //     key: '3',
                                        //     children: `Content of Tab Pane 3`,
                                        // },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

// Product.propTypes = {
//     children: PropTypes.node.isRequired,
// };

export default Product;
