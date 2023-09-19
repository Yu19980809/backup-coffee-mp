import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, Image, Checkbox, ScrollView } from '@tarojs/components'
import { drinksTemperature, drinksSugar, drinksAddon } from '../../constants'
import { ADD_TO_CART, CLEAR_CART, REMOVE_DRINK, REDUCE_DRINK, ADD_DRINK, CHECK_ALL, UNCHECK_ALL, CHECK_DRINK, UNCHECK_DRINK } from '../../constants/actionType'
import { showModal } from '../../utils'
import './index.less'
// import { fetchAllCommodities, fetchAllCategories, fetchAddressList } from '../../store/actions'

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

// 右侧饮品种类模块组件
const DrinkSection = ( { index, category, drinks, setCurrentDrink, setShowParams } ) => (
  <View id={ `category${ index }` } className='pt-[16rpx] drink-section'>
    <Text className='mx-[16rpx] text-primary-400'>{ category }</Text>

    <View>
      { drinks.map( ( drink, index ) => (
        <DrinkCard
          key={ drink.name }
          index={ index }
          setCurrentDrink={ setCurrentDrink }
          setShowParams={ setShowParams }
          { ...drink }
        />
      ) ) }
    </View>
  </View>
)

// 右侧饮品卡片组件
const DrinkCard = ( { index, _id, name, sales, image, price, setCurrentDrink, setShowParams } ) => {
  const handleClick = () => {
    setCurrentDrink( { _id, name, image, price } )
    setShowParams( true )
  }

  return (
    <View className={ `${ index === 0 ? '' : 'mt-[32rpx]' } relative flex items-center px-[48rpx] py-[24rpx] rounded-[32rpx]` }>
      <Image
        src={ image }
        alt={ name }
        className='w-[120rpx] h-[120rpx] rounded-[32rpx]'
      />

      <View className='flex flex-col ml-[32rpx] py-[8rpx] text-[28rpx]'>
        <View className='flex flex-col'>
          <Text>{ name }</Text>
          <Text className='mt-[4rpx] text-primary-400 text-[24rpx]'>销量 { sales }</Text>
        </View>

        <View className='flex items-end gap-[8rpx] mt-[12rpx]'>
          <Text>￥{ price }</Text>
          {/* <Text className={ `text-primary-400 text-[24rpx] line-through ${ origin_price === current_price ? 'hidden' : '' }` }>￥{ origin_price }</Text> */}
        </View>
      </View>

      <View
        className='absolute right-[48rpx] bottom-[32rpx] px-[16rpx] h-[48rpx] text-center leading-[48rpx] text-[24rpx] text-primary-100 bg-primary-700 rounded-[32rpx]'
        onClick={ handleClick }
      >
        选规格
      </View>
    </View>
  )
}

// 购物车详情中饮品卡片组件
const CartDrinkCard = ( { index, name, image, temperature, sugar, count, addon, price, totalPrice, checked, handleCartReduce, handleCartAdd, handleCheckDrink } ) => {
  return (
    <View className='relative flex justify-between items-center px-[48rpx] py-[24rpx] rounded-[32rpx]'>
      <View className='flex items-center gap-[24rpx]'>
        <Checkbox color='#d29f7e' checked={ checked } onClick={ () => handleCheckDrink( index ) } />

        <Image
          src={ image }
          alt={ name }
          className='w-[120rpx] h-[120rpx] ml-[16rpx] rounded-[32rpx]'
        />

        <View className='flex flex-col ml-[32rpx] py-[8rpx] text-[28rpx]'>
          <View className='flex flex-col'>
            <Text>{ name }</Text>
            <Text className='mt-[4rpx] text-primary-400 text-[24rpx]'>{ temperature }/{ sugar }{ addon.length === 0 ? '' : `/${ addon.join( ',' ) }` }
            </Text>
          </View>

          <View className='flex items-center gap-[8rpx] mt-[12rpx]'>
            <Text>￥{ totalPrice }</Text>
            {/* <Text className={ `${ origin_price === current_price ? 'hidden' : '' } text-[24rpx] text-primary-400 line-through` }>
              ￥{ origin_price * count }
            </Text> */}
          </View>
        </View>
      </View>
      
      <View className='flex justify-around items-center'>
        <Text
          className='iconfont icon-jianshao1 text-primary-400 text-[48rpx]'
          onClick={ () => handleCartReduce( index ) }
        />
        <Text className='mx-[24rpx]'>{ count }</Text>
        <Text
          className='iconfont icon-tianjia3 text-primary-700 text-[48rpx]'
          onClick={ () => handleCartAdd( index ) }
        />
      </View>
    </View>
  )
}

const Menu = () => {
  const dispatch = useDispatch()

  // // 从store中获取所有数据
  const categories = useSelector( state => state.categoryReducer )
  const drinks = useSelector( state => state.drinksReducer )
  const cart = useSelector( state => state.cartReducer )
  const addressList = useSelector( state => state.addressReducer )

  // 商品列表
  // const [ drinks, setDrinks ] = useState( [] )
  // useEffect( () => {
  //   dispatch( fetchAllCommodities() )
  //     .then( res => setDrinks( res ) )
  // }, [] )

  // 分类列表
  // const [ categories, setCategories ] = useState( [] )
  // useEffect( () => {
  //   dispatch( fetchAllCategories() )
  //     .then( res => setCategories( res ) )
  // }, [] )

  // 购物车
  // const [ cart, setCart ] = useState( { drinks: [], count: 0, price: 0  } )

  // 地址列表
  // const [ addressList, setAddressList ] = useState( [] )
  // useEffect( () => {
  //   dispatch( fetchAddressList() )
  //     .then( res => setAddressList( res ) )
  // }, [] )

  // 标识订单类型（自取/外送）
  const [ orderType, setOrderType ] = useState( 0 )

  // 当前地址
  const [ currentAddress, setCurrentAddress ] = useState( '' )

  useEffect( () => {
    const data = Taro.getCurrentInstance().preloadData
    if ( !data ) return

    if ( data.orderType === 0 ) {
      setOrderType( 0 )
    } else {
      setOrderType( 1 )
      setCurrentAddress( data.address )
    }

    Taro.preload( {} )
  }, [] )

  // useEffect( () => {
  //   const data = Taro.getCurrentInstance().preloadData
  //   if ( !data ) return
  //   setOrderType( data.orderType )
  //   Taro.preload( {} )
  // }, [] )

  

  // useEffect( () => {
  //   if ( orderType === 0 ) return

  //   const data = Taro.getCurrentInstance().preloadData
  //   console.log( 'data', data )
  //   setOrderType( orderType )

  //   if ( !data ) {
  //     console.log( 'address list', addressList )
  //     const defaultAddress = addressList.find( item => item.is_default === 'yes' )
  //     console.log( 'default address', defaultAddress )
  //     setCurrentAddress( defaultAddress )
  //   } else {
  //     setCurrentAddress( address )
  //     Taro.preload( {} )
  //   }
  // }, [] )

  // 左侧饮品目录相关参数
  const [ categoryIndex, setCategoryIndex ] = useState( 0 )
  const [ selectedCategory, setSelectedCategory ] = useState( '' )
  const [ categoryHeight, setCategoryHeight ] = useState( [] )

  // 右侧饮品列表相关参数
  const [ scrollTop, setScrollTop ] = useState( 0 )
  const [ scrollDistance, setScrollDistance ] = useState( 0 )

  // 饮品相关参数
  let drink = Taro.getStorageSync( 'currentDrink' )
  drink = !drink ? {} : JSON.parse( drink )
  Taro.removeStorageSync( 'currentDrink' )
  const [ currentDrink, setCurrentDrink ] = useState( drink )

  // 选规格相关参数
  const [ showParams, setShowParams ] = useState( JSON.stringify( drink ) !== '{}' )
  const [ temperature, setTemperature ] = useState( '正常冰' )
  const [ sugar, setSugar ] = useState( '不另外加糖' )
  const [ addon, setAddon ] = useState( [] )
  const [ totalPrice, setTotalPrice ] = useState( 0 )
  const [ count, setCount ] = useState( 1 )

  useEffect( () => setTotalPrice( currentDrink.price ), [ currentDrink ] )

  // 购物车相关参数
  const [ showCart, setShowCart ] = useState( cart.count !== 0 )

  // 购物车详情相关参数
  const [ showCartDetails, setShowCartDetails ] = useState( false )
  const [ checkAll, setCheckAll ] = useState( true )

  // 获取右侧饮品列表每个种类模块距离顶部的高度
  const getCategoryHeight = () => {
    let heights = [], initialHeight = 0
    const query = Taro.createSelectorQuery()
    query.selectAll( '.drink-section' ).boundingClientRect()
    query.exec( res => {
      res[0].forEach( section => {
        initialHeight += section.height
        heights.push( initialHeight )
      } )

      setCategoryHeight( heights )
      setScrollTop( heights[ categoryIndex - 1 ] )
    } )
  }

  useEffect( () => getCategoryHeight(), [] )

  // 处理左侧饮品类型的切换
  const handleCategoryClick = index => {
    setCategoryIndex( index )
    setSelectedCategory( 'category' + index )
  }

  // 处理右侧列表滚动
  const handleScroll = e => {
    if ( categoryHeight.length === 0 ) return
    let { scrollTop } = e.detail

    // 到达底部
    if ( scrollTop >= categoryHeight[ categoryIndex - 1 ] ) {
      // 到达底部要把锚点id清除，否则锚点id选中不到第一项item1，因为item1此时已经变成了默认值，无法通过锚点跳转
      setSelectedCategory( '' )
    }

    // 判断滚动方向
    if ( scrollTop >= scrollDistance ) {
      // 向下滚动
      if ( categoryIndex + 1 < categoryHeight.length && scrollTop >= categoryHeight[ categoryIndex ] ) {
        setCategoryIndex( categoryIndex + 1 )
      }
    } else {
      // 向上滚动
      if ( categoryIndex - 1 >= 0 && scrollTop < categoryHeight[ categoryIndex - 1 ] ) {
        setCategoryIndex( categoryIndex - 1 )
      }
    }

    // 存储滚动的距离
    setScrollDistance( scrollTop )
  }

  // 处理小料的添加
  const handleAddon = obj => {
    const { name, price } = obj

    if ( addon.includes( name ) ) {
      setAddon( addon.filter( item => item !== name ) )
      setTotalPrice( totalPrice - price * count )
    } else {
      setAddon( [ ...addon, name ] )
      setTotalPrice( totalPrice + price * count )
    }
  }

  // 处理数量加减
  const handleReduce = () => {
    if ( count === 1 ) return false
    setCount( count - 1 )

    let addonPrice = 0
    if ( addon.includes( '珍珠' ) ) addonPrice += 2
    if ( addon.includes( '椰冻' ) ) addonPrice += 3

    setTotalPrice( totalPrice - currentDrink.price - addonPrice  )
  }

  const handleAdd = () => {
    setCount( count + 1 )

    let addonPrice = 0
    if ( addon.includes( '珍珠' ) ) addonPrice += 2
    if ( addon.includes( '椰冻' ) ) addonPrice += 3

    setTotalPrice( totalPrice + currentDrink.price + addonPrice  )
  }

  // 重置饮品参数
  const resetDrinkParams = () => {
    setTemperature( '正常冰' )
    setSugar( '标准糖' )
    setAddon( [] )
    setCount( 1 )
  }

  // 添加到购物车
  const addToCart = () => {
    const drink = {
      _id: currentDrink._id,
      name: currentDrink.name,
      image: currentDrink.image,
      temperature,
      sugar,
      addon,
      price: currentDrink.price,
      totalPrice,
      count,
      checked: true
    }

    dispatch( { type: ADD_TO_CART, payload: drink } )
    setShowCart( true )
    setShowParams( false )
    resetDrinkParams()
  }

  // 展示购物车详情
  const handleCartDetails = () => {
    setShowCart( false )
    setShowCartDetails( true )
  }

  // 隐藏购物车详情
  const hideCartDetailMask = () => {
    setShowCartDetails( false )
    setShowCart( true )
  }

  // 重置购物车相关参数
  const resetCartParams = () => {
    dispatch( { type: CLEAR_CART } )
    setShowCartDetails( false )
  }

  // 清空购物车
  const clearCart = () => showModal( '确认清空购物车吗？', resetCartParams )

  // 处理购物车详情中的数量加减
  const handleCartReduce = index => {
    const drink = cart.drinks[ index ]
    if ( !drink.checked ) return
    const drinkPrice = drink.totalPrice / drink.count

    if ( cart.count === 1 ) {
      const isConfirm = showModal( '确定不要了吗？', resetCartParams )
      if ( !isConfirm ) return false
    }

    if ( drink.count === 1 ) {
      dispatch( { type: REMOVE_DRINK, payload: { index, drinkPrice } } )
    } else {
      dispatch( { type: REDUCE_DRINK, payload: { index, drinkPrice } } )
    }
  }

  const handleCartAdd = index => {
    const drink = cart.drinks[ index ]
    if ( !drink.checked ) return
    const drinkPrice = drink.totalPrice / drink.count
    dispatch( { type: ADD_DRINK, payload: { index, drinkPrice } } )
  }

  // 购物车详情，判断是否勾选了所有商品
  const checkDrinksStatus = () => {
    if ( cart.every( item => item.checked === true ) ){
      setCheckAll( true )
    }
  }

  // 购物车详情，（取消）选中所有商品
  const checkAllDrinks = () => {
    if ( checkAll ) {
      setCheckAll( false )
      dispatch( { type: UNCHECK_ALL } )
    } else {
      setCheckAll( true )
      dispatch( { type: CHECK_ALL } )
    }
  }

  // 购物车详情，（取消）选中饮品
  const handleCheckDrink = index => {
    const drink = cart.drinks[ index ]
    const { checked, count, totalPrice, price } = drink

    if ( checked ) {
      setCheckAll( false )
      dispatch( { type: UNCHECK_DRINK, payload: { index, count, totalPrice } } )
    } else {
      dispatch( { type: CHECK_DRINK, payload: { index, count, totalPrice } } )
      checkDrinksStatus()
    }
  }

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

  // 跳转至结算页面
  const goToPayment = e => {
    e.stopPropagation()
    Taro.navigateTo( { url: `/pages/payment/index?orderType=${ orderType }` } )
  }

  return (
    <View className='flex flex-col h-screen bg-white'>
      {/* 头部 */}
      <View className='flex justify-between items-center w-full h-[120rpx] px-[32rpx] py-[16rpx] border-b border-background z-99'>
        <View
          className={ `flex flex-col justify-around items-start ${ orderType === 0 ? '' : 'hidden' }` }
          onClick={ () => Taro.navigateTo( { url: '/pages/shop/index' } ) }
        >
          <View>
            <Text>鸿达中央广场店</Text>
            <Text className='ml-[8rpx] iconfont icon-xiangyou1 text-[32rpx]' />
          </View>

          <Text className='mt-[8rpx] text-primary-400 text-[24rpx]'>距您203m</Text>
        </View>

        <View
          className={ `flex flex-col justify-around items-start ${ orderType === 1 ? '' : 'hidden' }` }
          onClick={ () => Taro.navigateTo( { url: '/pages/address/show/index' } ) }
        >
          <View>
            <Text>{ currentAddress.location }</Text>
            <Text className='ml-[8rpx] iconfont icon-xiangyou1 text-[32rpx]' />
          </View>

          <View className='flex items-center gap-[24rpx] mt-[8rpx] text-primary-400 text-[24rpx]'>
            <Text>{ currentAddress.tel }</Text>
            <Text>{ currentAddress.name }</Text>
          </View>
        </View>

        <SwitchButton
          orderType={ orderType }
          setOrderType={ setOrderType }
          handleClickOrderType={ handleClickOrderType }
        />
      </View>

      {/* 内容区域 */}
      <View className='flex flex-1 justify-between'>
        {/* 左侧目录 */}
        <ScrollView scrollY className='w-[200rpx] h-[calc(100vh-120rpx)] bg-background'>
          { categories.map( ( item, index ) => (
            <View
              key={ item.name }
              className={ `flex justify-center items-center w-[200rpx] h-[120rpx] text-primary-400 bg-white ${ index === categoryIndex ? 'border-l-[8rpx] border-primary-700' : '' }` }
              onClick={ () => handleCategoryClick( index ) }
            >
              <Text className={ `flex justify-center items-center w-full h-full ${ index === categoryIndex ? 'text-primary-700 bg-white' : 'bg-background' } ${ index === ( categoryIndex - 1 ) ? 'rounded-br-[32rpx]' : '' } ${ index === ( categoryIndex + 1 ) ? 'rounded-tr-[32rpx]' : '' }` }>{ item.name }</Text>
            </View>
          ) ) }
        </ScrollView>

        {/* 右侧商品列表 */}
        <ScrollView
          scrollY
          scrollWithAnimation
          scrollIntoView={ selectedCategory }
          enhanced
          bounces={ false }
          onScroll={ handleScroll }
          scrollTop={ scrollTop }
          className='flex-1 h-[calc(100vh-120rpx)]'
        >
          { drinks.map( ( item, index ) => (
            <DrinkSection
              key={ item._id }
              index={ index }
              setCurrentDrink={ setCurrentDrink }
              setShowParams={ setShowParams }
              { ...item }
            />
          ) ) }

          { drinks.length > 0 && <View className='flex justify-center items-center w-full h-[60rpx] mt-[20rpx] text-[24rpx] text-dimWhite'>已经到底啦~~~</View> }
        </ScrollView>
      </View>

      {/* 选规格 */}
      <View
        className={ `mask flex items-end ${ showParams ? '' : 'hidden' }` }
        onClick={ () => setShowParams( false ) }
      >
        <View
          className='flex flex-col w-full px-[32rpx] bg-white rounded-t-[32rpx]'
          onClick={ e => e.stopPropagation() }
        >
          {/* 顶部 */}
          <View className='flex'>
            <Image
              src={ currentDrink.image }
              className='relative top-[-40rpx] w-[144rpx] h-[144rpx] rounded-[32rpx] box-shadow'
            />
            <Text className='ml-[32rpx] mt-[32rpx]'>{ currentDrink.name }</Text>
          </View>

          {/* 温度 */}
          <View>
            <Text>温度</Text>

            <View className='flex gap-[24rpx] mt-[16rpx] text-primary-400'>
              { drinksTemperature.map( item => (
                <View
                  className={ `px-[24rpx] py-[12rpx] border border-primary-400 rounded-[16rpx] ${ item.name === temperature ? 'text-primary-100 bg-primary-700' : 'border border-primary-400' }` }
                  onClick={ () => setTemperature( item.name ) }
                >
                  { item.name }
                </View>
              ) ) }
            </View>
          </View>

          {/* 糖度 */}
          <View className='mt-[32rpx]'>
            <Text>糖度</Text>

            <View className='flex gap-[24rpx] mt-[16rpx] text-primary-400'>
              { drinksSugar.map( item => (
                <View
                  className={ `px-[24rpx] py-[12rpx] rounded-[16rpx] ${ item.name === sugar ? 'text-primary-100 bg-primary-700' : 'border border-primary-400' }` }
                  onClick={ () => setSugar( item.name ) }
                >
                  { item.name }
                </View>
              ) ) }
            </View>
          </View>

          {/* 小料 */}
          <View className='mt-[32rpx]'>
            <Text>加料</Text>

            <View className='flex gap-[24rpx] mt-[16rpx] text-primary-400'>
              { drinksAddon.map( item => (
                <View
                  className={ `px-[24rpx] py-[12rpx] rounded-[16rpx] border ${ addon.includes( item.name ) ? 'text-primary-100 bg-primary-700 border-primary-700' : 'border-primary-400' }` }
                  onClick={ () => handleAddon( item ) }
                >
                  { item.name } ￥{ item.price }
                </View>
              ) ) }
            </View>
          </View>

          {/* 分隔线 */}
          <View className='my-[32rpx] border-t border-dashed border-primary-400' />

          {/* 数量价格 */}
          <View className='flex justify-between items-center'>
            <Text>￥{ totalPrice }</Text>

            <View className='flex justify-around items-center'>
              <Text
                className='iconfont icon-jianshao1 text-primary-400 text-[48rpx]'
                onClick={ handleReduce }
              />
              <Text className='mx-[32rpx]'>{ count }</Text>
              <Text
                className='iconfont icon-tianjia3 text-primary-700 text-[48rpx]'
                onClick={ handleAdd }
              />
            </View>
          </View>

          {/* 按钮 */}
          <View
            className='my-[40rpx] w-full h-[100rpx] text-primary-100 text-center leading-[100rpx] bg-primary-700 rounded-[50rpx]'
            onClick={ addToCart }
          >
            加入购物车
          </View>
        </View>
      </View>

      {/* 购物车 */}
      <View className={ `fixed left-0 bottom-0 w-full px-[32rpx] mb-[32rpx] z-99 ${ showCart ? '' : 'hidden' }` }>
        <View
          className='flex justify-between px-[48rpx] py-[24rpx] text-primary-100 bg-primary-700 rounded-full'
          onClick={ handleCartDetails }
        >
          <View className='flex ITEMS-CENTER gap-[24rpx]'>
            <View className='relative'>
              <Text className='iconfont icon-gouwugouwuchedinggou text-[56rpx]' />

              <View className='absolute top-[-16rpx] right-[-16rpx] w-[40rpx] h-[40rpx] text-primary-100 text-[28rpx] text-center leading-[40rpx] bg-red-500 rounded-full z-100'>{ cart.count }</View>
            </View>

            <View className='flex flex-col gap-[12rpx]'>
              <Text>预计到手 ￥{ cart.price }</Text>
              {/* <Text className='text-[24rpx]'>已享受优惠,共减免￥{ cart.discount }</Text> */}
            </View>
          </View>

          <View
            className='flex items-center gap-[8rpx]'
            onClick={ goToPayment }
          >
            <Text>去结算</Text>
            <Text className='iconfont icon-xiangyou1 text-[32rpx]' />
          </View>
        </View>
      </View>

      {/* 购物车详情 */}
      <View
        className={ `mask flex items-end ${ showCartDetails ? '' : 'hidden' }` }
        onClick={ hideCartDetailMask }
      >
        <View
          className='w-full bg-white rounded-t-[32rpx]'
          onClick={ e => e.stopPropagation() }
        >
          {/* 顶部 */}
          <View className='flex justify-between items-center h-[80rpx] px-[48rpx] border-b border-dashed border-primary-400'>
            <View className='flex gap-[16rpx]'>
              <Checkbox color='#d29f7e' checked={ checkAll } onClick={ checkAllDrinks } />
              <Text>已选购商品（{ cart.count }件）</Text>
            </View>

            <View
              className='flex gap-[12rpx]'
              onClick={ clearCart }
            >
              <Text className='iconfont icon-shanchu text-primary-400 text-[40rpx]' />
              <Text>清空购物车</Text>
            </View>
          </View>

          {/* 饮品列表 */}
          <View>
            { cart.drinks.map( ( item, index ) => (
              <CartDrinkCard
                key={ item.name }
                index={ index }
                handleCartReduce={ handleCartReduce }
                handleCartAdd={ handleCartAdd }
                handleCheckDrink={ handleCheckDrink }
                { ...item }
              />
            ) ) }
          </View>
        </View>
      </View>
    </View>
  )
}

export default Menu
