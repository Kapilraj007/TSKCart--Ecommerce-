import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Search from './Search';
import {Dropdown, Image} from 'react-bootstrap';
import { logout } from '../../actions/userActions';

export default function Header(){
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler=()=>{
    dispatch(logout)
  }

  const {isAuthenticated, user} = useSelector(state => state.authState);
  const {shippingInfo={} } = useSelector(state => state.cartState)
  const {items:cartItems} = useSelector(state => state.cartState);
  return(
      <nav class="navbar row ">
      <div class="col-12 col-md-3">
        <div class="navbar-brand">
          <Link to="/">

          <img width="125px" src="/images/logo.png" alt='no'/>
          </Link>
         
    <div className='list-unstyled components'>
    <Link to="/shipping"><span  style={{color: 'white', fontSize:12}}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
</svg>
{shippingInfo.address},
{shippingInfo.city}... 
{shippingInfo.postalCode}


                  </span></Link></div> 
        </div>
      </div>
   

      <div class="col-12 col-md-6 mt-2 mt-md-0">
       <Search/>
      </div>

      <div class="col-12 col-md-3 mt-4 mt-md-0 text-center">
      {isAuthenticated ? 
      (
        <Dropdown className='d-inline'>
          <Dropdown.Toggle variant='default text-white pr-5' id='dropdown-basic'>
            <figure className='avatar avatar-nav'>
              <Image width="50px" src={user.avatar??'./images/default_avatar.png'}/>
            </figure>
            <span>{user.name}</span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {user.role == 'admin'&&
          <Dropdown.Item onClick={()=>{navigate('/admin/dashboard')}} className='text-dark'>  Dashboard </Dropdown.Item>
      }
          <Dropdown.Item onClick={()=>{navigate('/myprofile')}} className='text-dark'>   Profile   </Dropdown.Item>
          <Dropdown.Item onClick={()=>{navigate('/orders')}} className='text-dark'>  Myorder </Dropdown.Item>
           
            <Dropdown.Item onClick={logoutHandler} className='text-danger'>   LogOut   </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )
      :
      <Link to="/login"  className="btn" id="login_btn">Login</Link>
    }
       <Link to="/cart"><span id="cart" class="ml-3">Cart</span></Link> 
        <span class="ml-1" id="cart_count">{cartItems.length}</span>
      </div>
    </nav>
    )
}