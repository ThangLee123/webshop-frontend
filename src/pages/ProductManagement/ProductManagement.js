import { createProduct, deleteProduct, listProducts } from '~/redux/actions/productActions';
import { Alert, Radio, Space, Spin, Pagination, Input } from 'antd';
import { useEffect, useState } from 'react';
import Product from '../Product/Product';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET } from '~/redux/constants/productConstants';
import styles from './ProductManagement.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
const { Search } = Input;
export default function ProductManagement() {
    // const { pageNumber = 1 } = useParams();
    const { pathname } = useLocation();
    const sellerMode = pathname.indexOf('/seller') >= 0;
    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages, totalProductsCount } = productList;
    const productCreate = useSelector((state) => state.productCreate);
    const {
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: createdProduct,
    } = productCreate;

    const productDelete = useSelector((state) => state.productDelete);
    const { loading: loadingDelete, success: successDelete, error: errorDelete } = productDelete;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(4);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (successCreate) {
            dispatch({ type: PRODUCT_CREATE_RESET });
            navigate(`/product/${createdProduct._id}/edit`);
        } else if (errorCreate) {
            dispatch({ type: PRODUCT_CREATE_RESET });
        } else if (successDelete) {
            dispatch({ type: PRODUCT_DELETE_RESET });
        }
        dispatch(
            listProducts({
                seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
                currentPage,
                itemsPerPage,
                searchValue,
            }),
        );
    }, [createdProduct, dispatch, navigate, successCreate, successDelete, currentPage]);

    // useEffect(() => {
    //     if (currentPage) {
    //         dispatch(
    //             listProducts({
    //                 seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
    //                 currentPage,
    //                 itemsPerPage,
    //             }),
    //         );
    //     }
    // }, [currentPage]);
    const deleteHandler = (product) => {
        if (window.confirm('Are you sure to delete?')) {
            dispatch(deleteProduct(product._id));
        }
    };
    const createHandler = () => {
        dispatch(createProduct());
    };

    const onSearch = (searchValue) => {
        setCurrentPage(1);
        setSearchValue(searchValue);
        dispatch(
            listProducts({
                seller: sellerMode ? JSON.parse(localStorage.getItem('userInfo'))._id : '',
                currentPage,
                itemsPerPage,
                searchValue,
            }),
        );
    };

    const handleChangePage = (page) => {
        // console.log('page', page);
        setCurrentPage(page);
    };

    return (
        <div className={cx('product-management-container')}>
            <div className={cx('product-management-heading')}>
                <h1>Products</h1>
                {localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).isSeller === true && (
                    <button type="button" className={cx('btn', 'btn-fill-out', 'btn-block')} onClick={createHandler}>
                        Create Product
                    </button>
                )}
            </div>
            <div style={{ margin: '0 20px 20px', width: '24%' }}>
                <Search
                    placeholder="Input product name"
                    onSearch={onSearch}
                    // onChange={(e) => setSearchValue(e.target.value)}
                    enterButton
                />
            </div>
            {localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).isSeller === true && (
                <div style={{ margin: '0 0 10px 20px', fontStyle: 'italic', color: `var(--product-text-color)` }}>
                    *Note For Seller: Please Remember Update Your Seller Information in Profile Before Using Create
                    Product Function
                </div>
            )}

            <div className={cx('row')}>
                {loadingDelete && <Spin size="large" />}
                {errorDelete && (
                    <Alert
                        message="Error"
                        style={{ width: '100%', margin: '0 30px 30px' }}
                        description={errorDelete}
                        type="error"
                        showIcon
                    />
                )}
                {loadingCreate && <Spin size="large" />}
                {errorCreate && (
                    <Alert
                        message="Error"
                        style={{ width: '100%', margin: '0 30px 30px' }}
                        description={errorCreate}
                        type="error"
                        showIcon
                    />
                )}
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <Alert message="Error" description={error} type="error" showIcon />
                ) : (
                    <>
                        <table className={cx('product-management-table')}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>PRICE</th>
                                    <th>COUNT IN STOCK</th>
                                    <th>CATEGORY</th>
                                    <th>BRAND</th>
                                    {localStorage.getItem('userInfo') &&
                                        JSON.parse(localStorage.getItem('userInfo')).isAdmin === true && (
                                            <th>SELLER EMAIL</th>
                                        )}
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td>{product._id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.countInStock}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        {localStorage.getItem('userInfo') &&
                                            JSON.parse(localStorage.getItem('userInfo')).isAdmin === true && (
                                                <td>{product.seller.email}</td>
                                            )}
                                        <td>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    marginBottom: '5px',
                                                }}
                                            >
                                                <div style={{ flex: 1, marginRight: '5px' }}>
                                                    <button
                                                        className={cx('btn', 'btn-fill-out', 'btn-block')}
                                                        style={{ width: '100%', height: '100%' }}
                                                        onClick={() => navigate(`/product/${product._id}`)}
                                                    >
                                                        View
                                                    </button>
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <button
                                                        className={cx('btn', 'btn-fill-out', 'btn-block')}
                                                        style={{ width: '100%', height: '100%' }}
                                                        onClick={() => navigate(`/product/${product._id}/edit`)}
                                                    >
                                                        Edit
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                className={cx('btn', 'btn-fill-out', 'btn-block')}
                                                style={{ width: '100%' }}
                                                onClick={() => deleteHandler(product)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={'container-pagination'}>
                            <Pagination
                                current={currentPage}
                                onChange={handleChangePage}
                                pageSize={itemsPerPage}
                                total={totalProductsCount}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
