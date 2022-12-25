const publicRoutes = {
    home: '/',
    productWId: '/product/:id',
    cartpage: '/cart',
    cartpageWId: '/cart/:id',
    signin: '/signin',
    register: '/register',
    activateEmail: '/user/activate/:activation_token',
    forgetPass: '/forgot_password',
    resetPass: '/user/reset/:token',
    sellerPage: '/seller/:id',
};
const privateRoutes = {
    shipping: '/shipping',
    orderWId: '/order/:id',
    productEditWId: '/product/:id/edit',
    orderHistory: '/orderhistory',
    userProfile: '/profile',
    productManagement: '/productmanagement',
    productManagementSeller: '/productmanagement/seller',
    orderList: '/orderlist',
    orderListSeller: '/orderlist/seller',
    userList: '/userlist',
    userEdit: '/user/:id/edit',
    paySellerSalary: '/paySellerSalary',
    rollBackOrderManagement: '/rollback-order-management',
};

export { publicRoutes, privateRoutes };
