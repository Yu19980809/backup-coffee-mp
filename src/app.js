import { useLaunch } from '@tarojs/taro'
import { Provider } from 'react-redux'
import configStore from './store'
import 'taro-ui/dist/style/index.scss'
import './app.less'

const store = configStore()

function App({ children }) {

  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return <Provider store={ store }>{ children }</Provider>
}

export default App
