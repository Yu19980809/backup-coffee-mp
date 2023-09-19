export default defineAppConfig({
  "lazyCodeLoading": "requiredComponents",
  pages: [
    'pages/index/index',
    'pages/menu/index',
    'pages/order/index',
    'pages/my/index',
    'pages/payment/index',
    'pages/address/show/index',
    'pages/address/new/index',
    'pages/shop/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'CodeDreamerCoffee',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#707070',
    selectedColor: '#87451B',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/images/tabbar/homepage.png',
        selectedIconPath: 'assets/images/tabbar/homepageSelected.png'
      },
      {
        pagePath: 'pages/menu/index',
        text: '菜单',
        iconPath: 'assets/images/tabbar/menu.png',
        selectedIconPath: 'assets/images/tabbar/menuSelected.png'
      },
      {
        pagePath: 'pages/order/index',
        text: '订单',
        iconPath: 'assets/images/tabbar/order.png',
        selectedIconPath: 'assets/images/tabbar/orderSelected.png'
      },
      {
        pagePath: 'pages/my/index',
        text: '我的',
        iconPath: 'assets/images/tabbar/my.png',
        selectedIconPath: 'assets/images/tabbar/mySelected.png'
      }
    ]
  }
})
