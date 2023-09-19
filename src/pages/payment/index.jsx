import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Image, Radio, Textarea } from '@tarojs/components'
import { generateOrder } from '../../store/actions'
import { CLEAR_CART } from '../../constants/actionType'
import './index.less'

// 自取/外送 切换组件
const SwitchButton = ( { orderType, handleClickOrderType } ) => (
  <View className='flex justify-between text-[28rpx] bg-background rounded-[32rpx]'>
    <Text
      className={ `px-[24rpx] py-[12rpx] ${ orderType === 0 ? 'bg-primary-700 text-primary-100 rounded-[32rpx]' : '' }` }
      onClick={ () => handleClickOrderType( 0 ) }
    >
      自取
    </Text>

    <Text
      className={ `px-[24rpx] py-[12rpx] ${ orderType === 1 ? 'bg-primary-700 text-primary-100 rounded-[32rpx]' : '' }` }
      onClick={ () => handleClickOrderType( 1 ) }
    >
      外送
    </Text>
  </View>
)

// 饮品卡片
const DrinkCard = ( { name, temperature, sugar, addon, image, count, totalPrice } ) => (
  <View className='flex items-center px-[48rpx] py-[24rpx] rounded-[32rpx]'>
    <Image
      src={ image }
      alt={ name }
      className='w-[120rpx] h-[120rpx] rounded-[32rpx]'
    />

    <View className='flex flex-1 justify-between items-center ml-[32rpx] py-[8rpx]'>
      <View className='flex flex-col gap-[16rpx]'>
        <View className='flex flex-col gap-[4rpx]'>
          <Text className='text-[28rpx]'>{ name }</Text>
          <Text className='block mt-[4rpx] text-primary-400 text-[24rpx]'>
            { temperature }/{ sugar }{ addon.length === 0 ? '' : `/${ addon.join( ',' ) }` }
          </Text>
        </View>

        {/* <View className={ `${ current_price === origin_price ? 'hidden' : '' } flex` }>
          <View className='px-[8rpx] py-[4rpx] text-[20rpx] text-primary-700 border border-primary-700 rounded-[8rpx]'>
            商品直减
          </View>
        </View> */}
      </View>

      <View className='flex flex-col items-end gap-[16rpx] text-primary-400'>
        <View className='flex gap-[8rpx] items-end'>
          <Text className='text-primary-700'>￥{ totalPrice }</Text>
          {/* <Text className={ `${ current_price === origin_price ? 'hidden' : '' } text-[24rpx] line-through` }>
            ￥{ origin_price * count }
          </Text> */}
        </View>

        <Text className='text-[24rpx]'>x { count }</Text>
      </View>
    </View>
  </View>
)

const Payment = () => {
  const dispatch = useDispatch()

  // 获取用户信息
  const user = JSON.parse( Taro.getStorageSync( 'profile' ) )

  // 从store中获取所有cart信息
  const cart = useSelector( state => state.cartReducer )
  useEffect( () => { console.log( 'payment', cart ) }, [] )

  // 标识订单类型（自取/外送）
  const [ orderType, setOrderType ] = useState( 0 )
  const [ shop, setShop ] = useState( '鸿达中央广场店' )
  const [ address, setAddress ] = useState( '迪马数智天地C2栋' )

  useEffect( () => {
    const { orderType } = Taro.getCurrentInstance().router.params
    setOrderType( orderType )
  }, [] )

  // 标识付款方式
  const [ paymentWay, setPaymentWay ] = useState( 1 )

  // 付款方式相关参数
  const [ showPaymentWay, setShowPaymentWay ] = useState( false )

  // 留言相关参数
  const [ showComment, setShowComment ] = useState( false )
  const [ needNoTouch, setNeedNoTouch ] = useState( false )
  const [ needNapkin, setNeedNapkin ] = useState( false )
  const [ comment, setComment ] = useState( '' )

  // 切换订单类型（自取/外送）
  const handleClickOrderType = index => {
    if ( index === 0 ) {
      setOrderType( 0 )
      Taro.navigateTo( { url: '/pages/shop/index' } )
    } else {
      setOrderType( 1 )
      Taro.navigateTo( { url: '/pages/address/show/index' } )
    }
  }

  // 处理留言内容
  const handleComment = () => {
    let commentInfo = []
    if ( comment !== '' ) commentInfo.push( comment )
    if ( needNoTouch ) commentInfo.push( '需要无接触配送' )
    if ( needNapkin ) commentInfo.push( '需要纸巾' )
    return commentInfo.join( ',' )
  }

  // 支付
  const handlePayment = () => {
    const data = {
      type: orderType === 0 ? '自提' : '外送',
      status: '制作中',
      address,
      shop_id: '64d4a479120400fab1036b62',
      user_id: user._id,
      ...cart
    }

    dispatch( generateOrder( data ) )
      .then( () => {
        dispatch( { type: CLEAR_CART } )
        Taro.switchTab( { url: '/pages/order/index' } )
      } )
  }

  return (
    <View className='relative flex flex-col h-screen'>
      {/* 头部 */}
      <View className='flex justify-between items-center w-full h-[120rpx] px-[48rpx] py-[16rpx] bg-white border-b border-background z-99'>
        <View
          className={ `flex flex-col justify-around items-start ${ orderType === 0 ? '' : 'hidden' }` }
          onClick={ () => Taro.navigateTo( { url: '/pages/shop/index' } ) }
        >
          <View>
            <Text>{ shop }</Text>
            <Text className='ml-[8rpx] iconfont icon-xiangyou1 text-[32rpx]' />
          </View>

          <Text className='mt-[8rpx] text-primary-400 text-[24rpx]'>距您203m</Text>
        </View>

        <View
          className={ `flex flex-col justify-around items-start ${ orderType === 1 ? '' : 'hidden' }` }
          onClick={ () => Taro.navigateTo( { url: '/pages/address/show/index' } ) }
        >
          <View>
            <Text>{ address }</Text>
            <Text className='ml-[8rpx] iconfont icon-xiangyou1 text-[32rpx]' />
          </View>

          <View className='flex items-center gap-[24rpx] mt-[8rpx] text-primary-400 text-[24rpx]'>
            <Text>{ user.tel }</Text>
            <Text>{ user.name }{ user.gender === 0 ? '先生' : '女士' }</Text>
          </View>
        </View>

        <SwitchButton
          orderType={ orderType }
          setOrderType={ setOrderType }
          handleClickOrderType={ handleClickOrderType }
        />
      </View>

      {/* 主体内容区域 */}
      <View className='px-[32rpx] pb-[32rpx]'>
        {/* 自取选项 */}
        <View className={ `${ orderType === 0 ? '' : 'hidden' } flex justify-between items-center mt-[24rpx] px-[32rpx] py-[32rpx] bg-white rounded-[32rpx]` }>
          <Text>自取选项</Text>

          <View className='flex gap-[16rpx] text-primary-400 text-[24rpx]'>
            <View
              className='px-[16rpx] py-[8rpx] border border-primary-400 rounded-[8rpx]'
            >
              立即自取
            </View>

            <View
              className='px-[16rpx] py-[8rpx] border border-primary-400 rounded-[8rpx]'
            >
              选择时间
            </View>
          </View>
        </View>

        {/* 饮品列表 */}
        <View className='mt-[24rpx] bg-white rounded-t-[32rpx]'>
          { cart.drinks.filter( item => item.checked ).map( item => (
            <DrinkCard
              key={ item._id }
              { ...item }
            />
          ) ) }
        </View>

        {/* 优惠券 */}
        <View className='relative flex justify-between items-center px-[32rpx] py-[32rpx] bg-white border-t border-dashed border-primary-200 rounded-b-[32rpx]'>
          <Text>优惠券</Text>

          <View className='flex items-center gap-[8rpx] text-primary-400 text-[28rpx]'>
            <Text>暂无可用优惠券</Text>
            <Text className='iconfont icon-xiangyou1' />
          </View>

          <View className='absolute left-[-16rpx] top-[-16rpx] w-[32rpx] h-[32rpx] bg-background rounded-full' />
          <View className='absolute right-[-16rpx] top-[-16rpx] w-[32rpx] h-[32rpx] bg-background rounded-full' />
        </View>

        {/* 备注 */}
        <View className='relative flex justify-between items-center mt-[24rpx] px-[32rpx] py-[32rpx] bg-white rounded-[32rpx]'>
          <Text>备注</Text>

          <View
            className='flex items-center gap-[8rpx] text-primary-400 text-[28rpx]'
            onClick={ () => setShowComment( true ) }
          >
            <View className={ `${ ( !needNoTouch && !needNapkin && !comment ) ? '' : 'hidden' }` }>
              <Text>给商家留言</Text>
              <Text className='iconfont icon-xiangyou1' />
            </View>

            <View className={ `${ ( needNoTouch || needNapkin || comment !== '' ) ? '' : 'hidden' } text-primary-900` }>
              <Text className='w-[400rpx] ellipse'>
                { handleComment() }
              </Text>
              <Text className='iconfont icon-xiangyou1' />
            </View>
          </View>
        </View>

        {/* 支付方式 */}
        <View className='relative flex justify-between items-center mt-[24rpx] px-[32rpx] py-[32rpx] bg-white rounded-[32rpx]'>
          <Text>付款方式</Text>

          <View
            className='flex items-center text-[28rpx]'
            onClick={ () => setShowPaymentWay( true ) }
          >
            <View className='w-[32rpx] h-[32rpx] mr-[4rpx] bg-background rounded-[8rpx]' />
            <Text>{ paymentWay === 0 ? '账户余额' : '微信支付' }</Text>
            <Text className='iconfont icon-xiangyou1 ml-[8rpx]' />
          </View>
        </View>
      </View>

      {/* 底部 */}
      <View className='absolute left-0 bottom-0 flex justify-between items-center w-full h-[120rpx] px-[48rpx] py-[16rpx] bg-white'>
        <View className='flex flex-col h-full'>
          <Text>应付 <Text className='text-[36rpx] text-primary-700'>￥{ cart.price }</Text></Text>
          {/* <Text className='mt-[8rpx] text-primary-400 text-[24rpx]'>总计优惠 ￥{ cart.discount }</Text> */}
        </View>

        <View
          className='flex justify-center items-center w-[240rpx] h-[80rpx] text-primary-100 bg-primary-700 rounded-[40rpx]'
          onClick={ handlePayment }
        >
          去支付
        </View>
      </View>

      {/* 选择付款方式 */}
      <View
        className={ `${ showPaymentWay ? '' : 'hidden' } mask flex items-end w-full px-[32rpx] pb-[150rpx]` }
        onClick={ () => setShowPaymentWay( false ) }
      >
        <View
          className='w-full bg-white rounded-[32rpx]'
          onClick={ e => e.stopPropagation() }
        >
          <View className='w-full h-[120rpx] text-center leading-[120rpx] bg-background rounded-t-[32rpx]'>支付中心</View>

          {/* 账户余额 */}
          <View
            className='px-[32rpx] py-[16rpx]'
            onClick={ () => setPaymentWay( 0 ) }
          >
            <View className='flex justify-between items-center text-primary-400'>
              <View className='flex items-center gap-[8rpx]'>
                <View className='w-[96rpx] h-[96rpx] bg-background rounded-[32rpx]' />
                <Text className='text-primary-900'>账户余额</Text>
                <Text className='text-[24rpx]'>(￥0)</Text>
              </View>

              <Radio color='#87451b' checked={ paymentWay === 0 } />
            </View>
          </View>

          {/* 微信支付 */}
          <View
            className='px-[32rpx] py-[16rpx]'
            onClick={ () => setPaymentWay( 1 ) }
          >
            <View className='flex justify-between items-center text-primary-400'>
              <View className='flex items-center gap-[16rpx]'>
                <View className='w-[96rpx] h-[96rpx] bg-background rounded-[32rpx]' />
                <Text className='text-primary-900'>微信支付</Text>
                <View className='px-[8rpx] py-[4rpx] text-primary-100 text-[24rpx] bg-primary-700 rounded-[8rpx]'>推荐</View>
              </View>

              <Radio color='#87451b' checked={ paymentWay === 1 } />
            </View>
          </View>
        </View>
      </View>

      {/* 留言 */}
      <View
        className={ `${ showComment ? '' : 'hidden' } mask flex items-end p-[32rpx]` }
        onClick={ () => setShowComment( false ) }
      >
        <View
          className='w-full bg-white rounded-[32rpx]'
          onClick={ e => e.stopPropagation() }
        >
          <View className='h-[120rpx] text-center leading-[120rpx] bg-background rounded-t-[32rpx]'>订单备注</View>

          <View className='flex-col px-[32rpx] py-[24rpx]'>
            {/* 无接触配送 */}
            <View className='flex py-[24rpx]'>
              <Text>无接触配送：</Text>

              <View className='flex gap-[16rpx] ml-[16rpx] text-[24rpx]'>
                <View
                  className={ `px-[16rpx] py-[4rpx] rounded-[8rpx] ${ needNoTouch ? 'text-primary-700 border border-primary-700' : 'bg-primary-700 text-primary-100' }` }
                  onClick={ () => setNeedNoTouch( false ) }
                >
                  不需要
                </View>

                <View
                  className={ `px-[16rpx] py-[4rpx] rounded-[8rpx] ${ needNoTouch ? 'bg-primary-700 text-primary-100' : 'text-primary-700 border border-primary-700' }` }
                  onClick={ () => setNeedNoTouch( true ) }
                >
                  需要
                </View>
              </View>
            </View>

            {/* 纸巾 */}
            <View className='flex py-[24rpx]'>
              <Text>纸巾：</Text>

              <View className='flex gap-[16rpx] ml-[16rpx] text-[24rpx]'>
                <View
                  className={ `px-[16rpx] py-[4rpx] rounded-[8rpx] ${ needNapkin ? 'text-primary-700 border border-primary-700' : 'bg-primary-700 text-primary-100' }` }
                  onClick={ () => setNeedNapkin( false ) }
                >
                  不需要
                </View>

                <View
                  className={ `px-[16rpx] py-[4rpx] rounded-[8rpx] ${ needNapkin ? 'bg-primary-700 text-primary-100' : 'text-primary-700 border border-primary-700' }` }
                  onClick={ () => setNeedNapkin( true ) }
                >
                  需要
                </View>
              </View>
            </View>

            {/* 输入框 */}
            <View className=' py-[24rpx]'>
              <Textarea
                style='height:80rpx;padding:24rpx;font-size:24rpx;background-color:#f4f4f4;border-radius:8rpx;overflow-y:scroll;'
                placeholder='请输入备注内容'
                maxlength={ 50 }
              />
            </View>

            {/* 确定按钮 */}
            <View
              className='h-[60rpx] text-primary-100 text-center leading-[60rpx] bg-primary-700 rounded-[30rpx]'
              onClick={ () => setShowComment( false ) }
            >
              确认
          </View>

          </View>
        </View>
      </View>

    </View>
  )
}

export default Payment
