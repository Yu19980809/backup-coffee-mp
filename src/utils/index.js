import Taro from '@tarojs/taro'

const showModal = ( content, callback ) => {
  Taro.showModal( {
    content,
    confirmColor: '#87451b',
    success: res => {
      if ( res.cancel ) return false
      if ( res.confirm ) {
        callback()
        return true
      }
    }
  } )
}

const formatDate = date => {
  date = new Date( date )
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

export {
  showModal,
  formatDate
}
