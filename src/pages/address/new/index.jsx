import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { View, Text, Input, Button, Switch } from '@tarojs/components'
import { addAddress } from '../../../store/actions'

const New = () => {
  const dispatch = useDispatch

  // 地址信息
  const initialInfo = {
    name: '',
    tel: '',
    address: '',
    door: '',
    isDefault: false
  }
  const [ info, setInfo ] = useState( initialInfo )

  // 保存地址信息
  const handleSubmit = () => {
    dispatch( addAddress( info ) )
      .then( () => {
        setInfo( initialInfo )
        Taro.navigateTo( { url: '/pages/address/show/index' } )
      } )
  }

  return (
    <View className='relative h-screen'>
      {/* 信息部分 */}
      <View className='bg-white'>
        <View className='flex items-center gap-[24rpx] p-[32rpx] border-b border-primary-400'>
          <Text>联系人</Text>
          <Input type='text' placeholder='用于取餐时对您的称呼' onBlur={ e => setInfo( { ...info, name: e.detail.value } ) } />
        </View>

        <View className='flex items-center gap-[24rpx] p-[32rpx] border-b border-primary-400'>
          <Text>手机号</Text>
          <Input type='text' placeholder='请输入您的手机号' onBlur={ e => setInfo( { ...info, tel: e.detail.value } ) } />
        </View>

        <View className='flex items-center gap-[24rpx] p-[32rpx] border-b border-primary-400'>
          <Text>地址</Text>
          <Input type='text' placeholder='请输入收货地址' onBlur={ e => setInfo( { ...info, address: e.detail.value } ) } />
        </View>

        <View className='flex items-center gap-[24rpx] p-[32rpx] border-b border-primary-400'>
          <Text>门牌号</Text>
          <Input type='text' placeholder='例：2号楼801室' onBlur={ e => setInfo( { ...info, door: e.detail.value } ) } />
        </View>

        <View className='flex justify-between items-center p-[32rpx]'>
          <Text>默认地址</Text>
          <Switch style='width: 100rpx; height: 60rpx' onChange={ e => setInfo( { ...info, isDefault: e.detail.value } ) } />
        </View>
      </View>

      {/* 提交按钮 */}
      <View className='absolute bottom-[32rpx] left-0 flex justify-center items-center w-full h-[80rpx]'>
        <Button
          className='w-[80%] py-[16rpx] text-center text-primary-100 bg-primary-700 rounded-full'
          onClick={ handleSubmit }
        >
          保存
        </Button>
      </View>
    </View>
  )
}

export default New