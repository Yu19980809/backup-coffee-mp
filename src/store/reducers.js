import Taro from '@tarojs/taro'
import { combineReducers } from 'redux'

import { FETCH_DRINKS, FETCH_CATEGORIES, ADD_TO_CART, CLEAR_CART, REMOVE_DRINK, REDUCE_DRINK, ADD_DRINK, CHECK_ALL, UNCHECK_ALL, CHECK_DRINK, UNCHECK_DRINK, LOGIN, FETCH_ORDERS, GENERATE_ORDER, FETCH_ADDRESS, UPDATE_USER, ADD_ADDRESS } from '../constants/actionType'

const categoryReducer = ( categories = [], action ) => {
  switch ( action.type ) {
    case FETCH_CATEGORIES:
      categories = action.payload
      return categories

    default:
      return categories
  }
}

const drinksReducer = ( drinks = [], action ) => {
  switch ( action.type ) {
    case FETCH_DRINKS:
      const result = action.payload.reduce( ( a, b ) => {
        if ( a[ b.category.name ] ) {
          a[ b.category.name ].push( b )
        } else {
          a[ b.category.name ] = [ b ]
        }

        return a
      }, {} )

      for ( let key in result ) {
        drinks.push( { category: key, drinks: result[ key ] } )
      }
      return drinks

    default:
      return drinks
  }
}

const cartReducer = ( cart = { drinks: [], count: 0, price: 0 }, action ) => {
  switch ( action.type ) {
    case ADD_TO_CART:
      return {
        drinks: [ ...cart.drinks, action.payload ],
        count: cart.count + action.payload.count,
        price: cart.price + action.payload.totalPrice,
      }
    
    case CLEAR_CART:
      return { drinks: [], count: 0, price: 0 }
    
    case REMOVE_DRINK:
      return {
        drinks: cart.drinks.filter( ( item, idx ) => idx !== action.payload.index ),
        count: cart.count - 1,
        price: cart.price - action.payload.drinkPrice,
      }
    
    case REDUCE_DRINK:
      return {
        drinks: cart.drinks.map( ( item, idx ) => idx === action.payload.index ? { ...item, count: item.count - 1, totalPrice: item.totalPrice - action.payload.drinkPrice } : item ),
        count: cart.count - 1,
        price: cart.price - action.payload.drinkPrice,
      }
    
    case ADD_DRINK:
      return {
        drinks: cart.drinks.map( ( item, idx ) => idx === action.payload.index ? { ...item, count: item.count + 1, totalPrice: item.totalPrice + action.payload.drinkPrice } : item ),
        count: cart.count + 1,
        price: cart.price + action.payload.drinkPrice,
      }
    
    case UNCHECK_ALL:
      return {
        drinks: cart.drinks.map( item => {
          item.checked = false
          return item
        } ),
        count: 0,
        price: 0,
        discount: 0
      }

    case CHECK_ALL:
      return {
        drinks: cart.drinks.map( item => {
          item.checked = true
          return item
        } ),
        count: cart.drinks.reduce( ( prev, cur ) => prev.count + cur.count ),
        price: cart.drinks.reduce( ( prev, cur ) => prev.totalPrice + cur.totalPrice ),
        discount: cart.drinks.reduce( ( prev, cur ) => prev.discount + cur.discount )
      }
    
    case CHECK_DRINK:
      return {
        drinks: cart.drinks.map( ( item, idx ) => idx === action.payload.index ? { ...item, checked: true } : item ),
        count: cart.count + action.payload.count,
        price: cart.price + action.payload.totalPrice,
        discount: cart.discount + action.payload.discount
      }
    
    case UNCHECK_DRINK:
      return {
        drinks: cart.drinks.map( ( item, idx ) => idx === action.payload.index ? { ...item, checked: false } : item ),
        count: cart.count - action.payload.count,
        price: cart.price - action.payload.totalPrice,
      }
    
    default:
      return cart
  }
}

const userReducer = ( authData = null, action ) => {
  switch ( action.type ) {
    case LOGIN:
      Taro.setStorageSync( 'profile', JSON.stringify( { ...action.payload.user } ) )
      Taro.setStorageSync( 'token', JSON.stringify( `Bearer ${ action.payload.token }` ) )
      return action.payload

    case UPDATE_USER:
      Taro.setStorageSync( 'profile', JSON.stringify( { ...action.payload } ) )
      return action.payload
    
    default:
      return authData
  }
}

const orderReducer = ( orders = [], action ) => {
  switch ( action.type ) {
    case FETCH_ORDERS:
      orders = action.payload
      return orders

    case GENERATE_ORDER:
      orders = [ action.payload, ...orders ]
      return orders
    
    default:
      return orders
  }
}

const addressReducer = ( address = [], action ) => {
  switch ( action.type ) {
    case FETCH_ADDRESS:
      address = action.payload
      return address

    case ADD_ADDRESS:
      address = [ action.payload, ...address ]
      return address

    default:
      return address
  }
}

export default combineReducers({ categoryReducer, drinksReducer, cartReducer, userReducer, orderReducer, addressReducer });