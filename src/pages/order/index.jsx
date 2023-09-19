import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Image } from '@tarojs/components'
import { formatDate } from '../../utils'
import { fetchAllOrders } from '../../store/actions'

const DrinkCard = ( { image, name, count, price, temperature, sugar, addon } ) => (
  <View className='flex justify-between items-center'>
    <View className='flex items-center gap-[16rpx]'>
      <Image src={ image } className='w-[120rpx] h-[120rpx] rounded-[32rpx]' />

      <View className='flex flex-col gap-[12rpx]'>
        <Text>{ name }</Text>
        <Text className='text-primary-400 text-[20rpx]'>
          { temperature }/{ sugar }{ addon.length > 0 ? `/${ addon.join( ',' ) }` : '' }
        </Text>
      </View>
    </View>

    <View className='flex flex-col gap-[12rpx] items-end'>
      <Text>￥{ price }</Text>
      <Text className='text-primary-400'>x{ count }</Text>
    </View>
  </View>
)

const OrderCard = ( { count, price, type, address, shop, createdAt, status, drinks } ) => (
  <View className='flex flex-col p-[32rpx] text-[28rpx] text-primary-900 bg-white rounded-[32rpx]'>
    {/* 头部 */}
    <View className='flex justify-between items-center'>
      <View className='flex items-center gap-[16rpx]'>
        <View className='p-[8rpx] text-primary-100 text-[20rpx] bg-primary-700 rounded-[8rpx]'>{ type }</View>

        <Text>{ type === '自取' ? shop.name : address }</Text>
      </View>

      <Text className={ `${ status === '已完成' ? '' : 'hidden' }` }>已完成</Text>
      <Text className={ `${ status === '制作中' ? '' : 'hidden' } text-primary-400` }>制作中</Text>
    </View>

    {/* 商品列表 */}
    <View className='my-[24rpx] py-[24rpx] border-y border-dashed border-primary-200'>
      { drinks.map( item => (
        <DrinkCard
          key={ item._id }
          { ...item }
        />
      ) ) }
    </View>

    {/* 底部 */}
    <View className='flex justify-between items-center text-primary-400 text-[28rpx]'>
      <Text>{ formatDate( createdAt ) }</Text>
      <Text>共{ count }件商品 合计：<Text className='text-primary-900 text-[32rpx]'>￥{ price }</Text></Text>
    </View>

    {/* 按钮 */}
    <View className='flex justify-end gap-[16rpx] mt-[24rpx] text-primary-700'>
      <View className='px-[16rpx] py-[4rpx] border border-primary-700 rounded-[8rpx]'>
        再来一单
      </View>
      <View className='px-[16rpx] py-[4rpx] border border-primary-700 rounded-[8rpx]'>
        开发票
      </View>
    </View>
  </View>
)

const Order = () => {
  const dispatch = useDispatch()

  // 订单列表
  const [ orders, setOrders ] = useState( [] )

  useEffect( () => {
    dispatch( fetchAllOrders() )
      .then( res => { setOrders( res ) } )
  }, [] )

  // 标识订单类型
  const [ orderType, setOrderType ] = useState( 0 )

  return (
    <View className='h-screen text-primary-400'>
      {/* 顶部tab */}
      <View className='flex justify-around items-center h-[120rpx] px-32rpx bg-white'>
        <View
          className={ `p-[36rpx] ${ orderType === 0 ? 'text-primary-700 border-b border-primary-700' : '' }` }
          onClick={ () => setOrderType( 0 ) }
        >
          门店订单
        </View>

        <View
          className={ `p-[36rpx] ${ orderType === 1 ? 'text-primary-700 border-b border-primary-700' : '' }` }
          onClick={ () => setOrderType( 1 ) }
        >
          积分商城订单
        </View>

        <View
          className={ `p-[36rpx] ${ orderType === 2 ? 'text-primary-700 border-b border-primary-700' : '' }` }
          onClick={ () => setOrderType( 2 ) }
        >
          更多订单
        </View>
      </View>

      {/* 订单列表 */}
      <View className='flex flex-col gap-[32rpx] min-h-[calc(100vh-120rpx)] p-[32rpx]'>
        {/* 列表 */}
        { orders.map( ( item, index ) => (
            <OrderCard
              key={ index }
              { ...item }
            />
          ) ) }

        {/* 到底提示 */}
        <View className={ `${ !orders ? 'hidden' : '' } mt-[32rpx] w-full h-[60rpx] flex justify-center items-center` }>
          <Text className='text-dimWhite text-[24rpx]'>已经到底啦~</Text>
        </View>

        {/* 无历史订单 */}
        <View className={ `flex flex-col justify-center items-center h-full ${ !orders ? '' : 'hidden' }` }>
          <View className='w-[300rpx] h-[300rpx] bg-[#d9d9d9] rounded-[32rpx]' />
          <Text className='mt-[60rpx] mb-[32rpx]'>暂无订单哦~</Text>
          <View className='w-[300rpx] h-[72rpx] text-center leading-[72rpx] text-primary-100 bg-primary-700 rounded-[36rpx]'>去逛逛</View>
        </View>
      </View>
    </View>
  )
}

export default Order