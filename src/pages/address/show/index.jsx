import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text } from '@tarojs/components'
import { fetchAddressList } from '../../../store/actions'

const AddressCard = ( { location, name, tel, is_default, handleClick } ) => (
  <View
    className='flex justify-between items-center px-[32rpx] py-[24rpx] bg-white rounded-[32rpx]'
    onClick={ () => handleClick( { location, name, tel } ) }
  >
    <View className='flex flex-col gap-[16rpx]'>
      <View className='flex gap-[32rpx]'>
        { is_default === 'yes' && (
          <View className='flex justify-center items-center px-[8rpx] py-[2rpx] text-[20rpx] text-primary-100 bg-primary-700 rounded-[8rpx]'>
            默认
          </View>
        ) }

        <Text>{ location }</Text>
      </View>

      <View className='flex gap-[32rpx] text-primary-700 text-[28rpx]'>
        <Text>{ name }</Text>
        <Text>{ tel }</Text>
      </View>
    </View>

    <Text className='iconfont icon-xiugai07 text-[40rpx]' />
  </View>
)

const Address = () => {
  const dispatch = useDispatch()

  // 地址列表
  const [ addressList, setAddressList ] = useState( [] )

  // 获取用户收货地址
  useEffect( () => {
    dispatch( fetchAddressList() )
      .then( res => setAddressList( res ) )
  }, [] )

  // 选中地址
  const handleClick = params => {
    Taro.preload( { orderType: 1, address: params } )
    Taro.switchTab( { url: '/pages/menu/index' } )
  }

  return (
    <View className='h-full'>
      {/* 地址列表 */}
      <View className='h-[calc(100vh-120rpx)] p-[32rpx]'>
        {/* 提示 */}
        <View className={ `${ !addressList.length ? '' : 'hidden' } w-full h-full flex flex-col justify-center items-center gap-[16rpx]` }>
          <View className='w-[300rpx] h-[300rpx] bg-dimWhite rounded-[40rpx]' />
          <Text className='text-primary-400'>暂无收货地址</Text>
        </View>

        {/* 列表 */}
        <View className='flex flex-col gap-[32rpx]'>
          { addressList.map( item => (
            <AddressCard
              key={ item._id }
              handleClick={ handleClick }
              { ...item }
            />
          ) ) }
        </View>
      </View>

      {/* 按钮 */}
      <View className='flex justify-center items-center h-[120rpx] bg-white'>
        <View
          className='px-[60rpx] py-[16rpx] text-primary-100 bg-primary-700 rounded-full'
          onClick={ () => Taro.navigateTo( { url: '/pages/address/new/index' } ) }
        >
          新增收货地址
        </View>
      </View>
    </View>
  )
}

export default Address