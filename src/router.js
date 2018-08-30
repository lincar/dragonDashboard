// noinspection JSAnnotator
import Main from './views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
  path: '/login',
  name: 'login',
  meta: {
    title: 'Login - 登录'
  },
  component: resolve => {
    require(['./views/login.vue'], resolve);
  }

};


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/order/list',
  component: Main,
  children: [
    {
      path: 'product/edit',
      title: '添加产品',
      name: 'product-edit',
      component: resolve => {
        require(['./camper/product/edit.vue'], resolve);
      }
    },
    {
      path: 'order/detail',
      title: '订单详情',
      name: 'order-detail',
      component: resolve => {
        require(['./camper/order/detail.vue'], resolve);
      }
    },
    {
      path: 'customer/detail',
      title: '会员详情',
      name: 'customer-detail',
      component: resolve => {
        require(['./camper/customer/detail.vue'], resolve);
      }
    }
  ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
//如果想保持组件keep-alive，组件名和name字段保持一致
export const appRouter = [
  {
    path: '/order',
    icon: 'android-folder',
    name: 'order',
    title: '订单管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '订单列表',
        name: 'order-list',
        component: resolve => {
          require(['./camper/order/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/classify',
    icon: 'android-folder',
    name: 'classify',
    title: '分类管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '分类列表',
        name: 'classify-list',
        component: resolve => {
          require(['./camper/classify/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/product',
    icon: 'android-folder',
    name: 'product',
    title: '产品管理',
    component: Main,
    children: [
      {
        path: 'list/1',
        title: '房车列表',
        name: 'product-list-1',
        component: resolve => {
          require(['./camper/product/list1.vue'], resolve);
        }
      },
      {
        path: 'list/2',
        title: '民宿列表',
        name: 'product-list-2',
        component: resolve => {
          require(['./camper/product/list2.vue'], resolve);
        }
      },
      {
        path: 'list/3',
        title: '路线列表',
        name: 'product-list-3',
        component: resolve => {
          require(['./camper/product/list3.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/customer',
    icon: 'android-folder',
    name: 'customer',
    title: '会员管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '会员列表',
        name: 'customer-list',
        component: resolve => {
          require(['./camper/customer/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/coupon',
    icon: 'android-folder',
    name: 'coupon',
    title: '优惠券管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '优惠券列表',
        name: 'coupon-list',
        component: resolve => {
          require(['./camper/coupon/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/ad',
    icon: 'android-folder',
    name: 'ad',
    title: '广告管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '广告列表',
        name: 'ad-list',
        component: resolve => {
          require(['./camper/ad/list.vue'], resolve);
        }
      }
    ]
  },
  {
    path: '/admin',
    icon: 'android-folder',
    name: 'admin',
    title: '账号管理',
    component: Main,
    children: [
      {
        path: 'list',
        title: '账号列表',
        name: 'admin-list',
        component: resolve => {
          require(['./camper/admin/list.vue'], resolve);
        }
      }
    ]
  }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  otherRouter,
  ...appRouter,
];
