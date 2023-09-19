import Taro from "@tarojs/taro"

const BASE_URL = 'http://localhost:4000/api/v1'
// const BASE_URL = 'http://123.57.167.83:4000/api/v1'
const TOKEN = JSON.parse( Taro.getStorageSync( 'token' ) )

const request = ( url, method, data ) => new Promise( ( resolve, reject ) => {
  const _url = BASE_URL + url
  const _header = method === 'POST' ? 'application/json' : 'application/x-www-form-urlencoded'

  Taro.request({
    url: _url,
    method,
    data,
    header: {
      'Content-Type': _header,
      'Authorization': TOKEN || ''
    },
    success: res => resolve( res.data ),
    fail: err => reject( err )
  })
} )

const fetchAllCommodities = () => request( '/commodity/weapp', 'GET', {} )
const fetchAllCategories = () => request( '/category/weapp', 'GET', {} )
const fetchAddressList = () => request( '/address/weapp', 'GET', {} )
const generateOrder = data => request( '/order/weapp', 'POST', data )
const generateOrderCommodities = data => request( '/order_commodity/weapp', 'POST', data )
const fetchAllOrders = () => request( '/order_commodity/weapp', 'GET', {} )
const fetchUploadParams = () => request( '/aliyun/weapp', 'GET', {} )
const updateUserInfo = data => request( '/user/weapp', 'PATCH', data )
const addAddress = data => request( '/address/weapp', 'POST', data )

export {
  fetchAllCommodities,
  fetchAllCategories,
  fetchAddressList,
  generateOrder,
  generateOrderCommodities,
  fetchAllOrders,
  fetchUploadParams,
  updateUserInfo,
  addAddress,
}
