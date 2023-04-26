import { createSlice } from "@reduxjs/toolkit";


const productsSlice = createSlice({
    name: 'products', //slice oda name
    initialState:{  //api vanga late acha na loading nu kamikunu
        loading:false 
    }, 
    reducers:{
        productsRequest(state,action){
            return{
                loading:true
            }
        },
        productsSuccess(state, action){
            return{
                loading:false,
                products:action.payload.products,
                productsCount: action.payload.count,
                resPerPage : action.payload.resPerPage
               
            }
        },
        productsFail(state, action){
            return{
                loading:false,
                error: action.payload
            }
        },
        adminProductsRequest(state,action){
            return{
                loading:true
            }
        },
        adminProductsSuccess(state, action){
            return{
                loading:false,
                products:action.payload.products,
               
            }
        },
        adminProductsFail(state, action){
            return{
                loading:false,
                error: action.payload
            }
        },
        clearError(state, action){
            return{
                ...state,
                error: null
            }
        }
    }
});

const {actions, reducer} = productsSlice;//destructuring method viva la productsSlice la erunthu properties ha vanganum

export const {productsRequest,
              productsSuccess,
              productsFail,
              adminProductsRequest,
             adminProductsSuccess,
            adminProductsFail,
            clearError} = actions; //action creater

export default reducer;
