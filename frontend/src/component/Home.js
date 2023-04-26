import { Fragment, useEffect, useState } from "react";
import { getProducts } from "../actions/productsAction";
import {useDispatch, useSelector} from "react-redux"
import MetaData from "./layouts/MetaData";
import Loader from "./layouts/Loader";
import {toast} from "react-toastify";
import {Link} from 'react-router-dom';
import Pagination from 'react-js-pagination';

export default function Home(){
const dispatch = useDispatch();//hoook function
const {products, loading, error,productsCount, resPerPage} = useSelector((state)=>state.productsState) 
const [currentPage, setCurrentPage] = useState(1);
 
    const setCurrentPageNo = (pageNo) =>{

        setCurrentPage(pageNo)
       
    }
useEffect(()=>{//useffect one mattum tha run agum
 if(error){
   return toast(error,{
     position: toast.POSITION.BOTTOM_CENTER
  })
 }
    dispatch(getProducts(null,null,null,null, currentPage))//null is for some times keyword gets no value
  },[error, dispatch, currentPage])
    return(
      <Fragment>
        {loading ? <Loader/>:
           <Fragment> 
            <MetaData title={'Buy best Product'}/>
             <h1 id="products_heading">Latest Products</h1>

<section id="products" className="container mt-5">
  <div className="row">
    {products && products.map(product => (
        <div className="col-sm-12 col-md-6 col-lg-4 my-3">
        <div className="card p-3 rounded">
        {product.images.length > 0 &&
                <img
                className="card-img-top mx-auto"
                src={product.images[0].image}
                alt={product.name}
                />}

          <div className="card-body d-flex flex-column">
            <h5 className="card-title">
              <Link to={`/product/${product._id}`}>{product.name}</Link>
            </h5>
            <div className="ratings mt-auto">
              <div className="rating-outer">
                <div className="rating-inner" style={{width: `${product.ratings/ 5 * 100}%` }}></div>
              </div>
              <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
            </div>
            <p className="card-text">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                   <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                </svg>
                {product.price} 
           </p>
           <Link to={`/product/${product._id}`}id="view_btn" className="btn btn-block">View Details</Link>
          </div>
        </div>
   
  
    </div>
 ))}
  </div>
</section>
{productsCount > 0 && productsCount > resPerPage?
                    <div className="d-flex justify-content-center mt-5">
                           <Pagination 
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resPerPage}
                                nextPageText={'Next'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass={'page-item'}
                                linkClass={'page-link'}
                           />     
                    </div> : null }
           </Fragment>
        }
        </Fragment>
    )
}