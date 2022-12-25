import config from '~/config';

// Layouts
import { SubHeaderOnly } from '~/layouts';

// Pages
import Cart from '~/pages/Cart';
import Home from '~/pages/Home';
import Product from '~/pages/Product';
import Register from '~/pages/Register';
import SigninScreen from '~/pages/SignIn';
import ActivationEmail from '~/pages/activationEmail';
import ForgetPassword from '~/pages/ForgetPassword';
import ResetPassword from '~/pages/ResetPassword';
import ShippingAddress from '~/pages/ShippingAddress';
import PrivateRoute from '~/components/PrivateRoute';
import Order from '~/pages/Order';
import OrderHistory from '~/pages/OrderHistory/OrderHistory';
import UserProfile from '~/pages/UserProfile';
import { createProduct } from '~/redux/actions/productActions';
import ProductManagement from '~/pages/ProductManagement';
import ProductEdit from '~/pages/ProductEdit';
import AdminRoute from '~/components/AdminRoute';
import OrderList from '~/pages/OrderList';
import UserList from '~/pages/UserList/UserList';
import UserEdit from '~/pages/UserEdit';
import SellerRoute from '~/components/SellerRoute';
import SellerScreen from '~/pages/SellerScreen';
import PaySellerSalary from '~/pages/PaySellerSalary';
import OrderRollback from '~/pages/OrderRollback';

// Public routes
const publicRoutes = [
    { path: config.publicRoutes.home, component: Home, layout: null },
    { path: config.publicRoutes.productWId, component: Product, layout: SubHeaderOnly },
    { path: config.publicRoutes.cartpage, component: Cart, layout: SubHeaderOnly },
    { path: config.publicRoutes.cartpageWId, component: Cart, layout: SubHeaderOnly },
    { path: config.publicRoutes.signin, component: SigninScreen },
    { path: config.publicRoutes.register, component: Register },
    { path: config.publicRoutes.activateEmail, component: ActivationEmail },
    { path: config.publicRoutes.forgetPass, component: ForgetPassword },
    { path: config.publicRoutes.resetPass, component: ResetPassword },
    { path: config.publicRoutes.sellerPage, component: SellerScreen },

    // { path: config.publicRoutes.following, component: Following },
    // { path: config.publicRoutes.profile, component: Profile },
    // { path: config.publicRoutes.upload, component: Upload, layout: HeaderOnly },
    // { path: config.publicRoutes.search, component: Search, layout: null },
];

const privateRoutes = [
    { path: config.privateRoutes.shipping, component: ShippingAddress, isPrivate: PrivateRoute },
    { path: config.privateRoutes.orderWId, component: Order, isPrivate: PrivateRoute },
    { path: config.privateRoutes.orderHistory, component: OrderHistory, isPrivate: PrivateRoute },
    { path: config.privateRoutes.userProfile, component: UserProfile, isPrivate: PrivateRoute },
    { path: config.privateRoutes.productManagement, component: ProductManagement, isAdminPrivate: AdminRoute },
    { path: config.privateRoutes.productEditWId, component: ProductEdit, isPrivate: PrivateRoute },
    { path: config.privateRoutes.orderList, component: OrderList, isAdminPrivate: AdminRoute },
    { path: config.privateRoutes.userList, component: UserList, isAdminPrivate: AdminRoute },
    { path: config.privateRoutes.userEdit, component: UserEdit, isAdminPrivate: AdminRoute },
    { path: config.privateRoutes.productManagementSeller, component: ProductManagement, isSellerPrivate: SellerRoute },
    { path: config.privateRoutes.orderListSeller, component: OrderList, isSellerPrivate: SellerRoute },
    { path: config.privateRoutes.paySellerSalary, component: PaySellerSalary, isAdminPrivate: AdminRoute },
    { path: config.privateRoutes.rollBackOrderManagement, component: OrderRollback, isAdminPrivate: AdminRoute },
];

export { publicRoutes, privateRoutes };
