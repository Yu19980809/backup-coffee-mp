import * as api from '../api'
import { FETCH_DRINKS, FETCH_CATEGORIES, FETCH_ORDERS, GENERATE_ORDER, FETCH_ADDRESS, UPDATE_USER, ADD_ADDRESS } from '../constants/actionType'

// const login = code => async ( dispatch ) => {
//   try {
//     const data = await api.login( code )
//     dispatch( { type: LOGIN, payload: data } )
//     return data
//   } catch (error) {
//     console.log( error )
//   }
// }

const fetchAllCommodities = () => async ( dispatch ) => {
  try {
    const { data } = await api.fetchAllCommodities()
    dispatch( { type: FETCH_DRINKS, payload: data } )
    return data
  } catch (error) {
    console.log( 'fetchAllCommodities error', error )
  }
}

const fetchAllCategories = () => async ( dispatch ) => {
  try {
    const { data } = await api.fetchAllCategories()
    dispatch( { type: FETCH_CATEGORIES, payload: data } )
    return data
  } catch (error) {
    console.log( 'fetchAllCategories error', error )
  }
}

const fetchAddressList = () => async ( dispatch ) => {
  try {
    const { data } = await api.fetchAddressList()
    dispatch( { type: FETCH_ADDRESS, payload: data } )
    return data
  } catch (error) {
    console.log( 'fetchAddressList error', error )
  }
}

const generateOrder = data => async ( dispatch ) => {
  try {
    const { data: order } = await api.generateOrder( data )
    dispatch( { type: GENERATE_ORDER, payload: order } )
    await api.generateOrderCommodities( { commodities: data.drinks, orderId: order._id } )
  } catch (error) {
    console.log( 'generateOrder error', error )
  }
}

const fetchAllOrders = () => async ( dispatch ) => {
  try {
    const { data } = await api.fetchAllOrders()
    dispatch( { type: FETCH_ORDERS, payload: data } )
    return data
  } catch (error) {
    console.log( 'fetchAllOrders error', error )
  }
}

const fetchUploadParams = () => async ( dispatch ) => {
  try {
    const { data } = await api.fetchUploadParams()
    // dispatch( { type: FETCH_POLICY_SIGNATURE, payload: data } )
    return data
  } catch (error) {
    console.log( 'fetchUploadParams error', error )
  }
}

const updateUserInfo = params => async ( dispatch ) => {
  try {
    const { data } = await api.updateUserInfo( params )
    dispatch( { type: UPDATE_USER, payload: data } )
    return data
  } catch (error) {
    console.log( 'updateUserInfo error', error )
  }
}

const addAddress = params => async ( dispatch ) => {
  try {
    const { data } = await api.addAddress( params )
    dispatch( { type: ADD_ADDRESS, payload: data } )
  } catch (error) {
    console.log( 'addAddress error', error )
  }
}

export {
  // login,
  fetchAllCommodities,
  fetchAllCategories,
  fetchAddressList,
  generateOrder,
  fetchAllOrders,
  fetchUploadParams,
  updateUserInfo,
  addAddress,
}
