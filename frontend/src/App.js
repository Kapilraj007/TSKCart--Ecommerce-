import './App.css';
import Footer from './component/layouts/Footer';
import Header from './component/layouts/Header';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './component/Home';
import ProductDetails from './component/layouts/productDetails';
import ProductSearch from './component/layouts/ProductSearch';
import Login from './component/user/Login';
import Register from './component/user/Register';
import { useEffect, useState } from 'react';
import store from './store'
import { loadUser } from './actions/userActions';
import Profile from './component/user/Profile';
import ProdectedRoute from './component/route/ProtectedRoute';
import UpdateProfile from './component/user/UpdateProfile';
import UpdatePassword from './component/user/UpdatePassword';
import ForgotPassword from './component/user/ForgotPassword';
import ResetPassword from './component/user/ResetPassword';
import Cart from './component/cart/Cart';
import Shipping from './component/cart/Shipping';
import ConfirmOrder from './component/cart/ConfirmOrder';
import Payment from './component/cart/Payment';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from './component/cart/orderSuccess';
import UserOrders from './component/order/UserOrders';
import OrderDetail from './component/order/OrderDetail';
import Dashboard from './component/admin/Dashboard';
import ProductList from './component/admin/ProductList';
import NewProduct from './component/admin/Newproduct';
import UpdateProduct from './component/admin/UpdateProduct';
import OrderList from './component/admin/OrderList';
import UpdateOrder from './component/admin/UpdateOrder';
import UserList from './component/admin/UserList';
import UpdateUser from './component/admin/UpdateUser';
import ReviewList from './component/admin/ReviewsList';

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("")
  useEffect(() => {
    store.dispatch(loadUser)
    async function getStripeApiKey(){
      const {data} = await axios.get('/api/v1/stripeapi')
      setStripeApiKey(data.stripeApiKey)
    }
    getStripeApiKey()
  },[])
  return(
    <Router>
    <div className="App">
      <HelmetProvider>
    <Header/>
    <div className='container container-fluid'>
    
     <ToastContainer theme='dark'/>
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/search/:keyword' element={<ProductSearch/>} />
          <Route path='/product/:id' element={<ProductDetails/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/myprofile' element= {<ProdectedRoute> <Profile/></ProdectedRoute> } />
          <Route path='/myprofile/update' element= {<ProdectedRoute><UpdateProfile/></ProdectedRoute> } />
          <Route path='/myprofile/update/password' element= {<ProdectedRoute><UpdatePassword/></ProdectedRoute> } />
          <Route path='/password/forgot' element= {<ForgotPassword/>} />
          <Route path='/password/reset/:token' element= {<ResetPassword/>} />
          <Route path='/cart' element= {<Cart/>} />
          <Route path='/shipping' element= {<ProdectedRoute><Shipping/></ProdectedRoute> } />
          <Route path='/order/confirm' element= {<ProdectedRoute><ConfirmOrder/></ProdectedRoute> } />
          <Route path='/order/success' element= {<ProdectedRoute><OrderSuccess/></ProdectedRoute> } />
          <Route path='/orders' element= {<ProdectedRoute><UserOrders/></ProdectedRoute> } />
          <Route path='/order/:id' element= {<ProdectedRoute><OrderDetail/></ProdectedRoute> } />

          {stripeApiKey && <Route path='/payment' element={<ProdectedRoute><Elements stripe={loadStripe(stripeApiKey)}><Payment/></Elements></ProdectedRoute> } />
} 
      </Routes>
    </div>
  
      <Routes>
        <Route path='/admin/dashboard' element={<ProdectedRoute isAdmin={true}><Dashboard/></ProdectedRoute>} />
        <Route path='/admin/products' element={<ProdectedRoute isAdmin={true}><ProductList/></ProdectedRoute>} />
        <Route path='/admin/products/create' element={<ProdectedRoute isAdmin={true}><NewProduct/></ProdectedRoute>} />
        <Route path='/admin/product/:id' element={<ProdectedRoute isAdmin={true}><UpdateProduct/></ProdectedRoute>} />
        <Route path='/admin/orders' element={<ProdectedRoute isAdmin={true}><OrderList/></ProdectedRoute>} /> 
        <Route path='/admin/order/:id' element={<ProdectedRoute isAdmin={true}><UpdateOrder/></ProdectedRoute>} />
        <Route path='/admin/users' element={<ProdectedRoute isAdmin={true}><UserList/></ProdectedRoute>} />
        <Route path='/admin/user/:id' element={<ProdectedRoute isAdmin={true}><UpdateUser/></ProdectedRoute>} />
        <Route path='/admin/reviews' element={<ProdectedRoute isAdmin={true}><ReviewList/></ProdectedRoute>} />
        
      </Routes>
    <Footer/>
    </HelmetProvider>
    </div>
</Router>
  );
}

export default App;
