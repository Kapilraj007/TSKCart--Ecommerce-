import { Fragment, useEffect, useState } from "react";
import { getProducts } from "../../actions/productsAction";
import {useDispatch, useSelector} from "react-redux"
import MetaData from ".././layouts/MetaData";
import Loader from ".././layouts/Loader";
import {toast} from "react-toastify";
import {Link, useParams} from 'react-router-dom';
import Slider from "rc-slider";
import 'rc-slider/assets/index.css';
import Tooltip from "rc-tooltip";
import 'rc-tooltip/assets/bootstrap.css'
import Pagination from 'react-js-pagination';

export default function ProductSearch(){
const dispatch = useDispatch();//hoook function
const {products, loading, error,productsCount, resPerPage} = useSelector((state)=>state.productsState) 
const [currentPage, setCurrentPage] = useState(1);
const { keyword } = useParams();
const [price, setPrice] = useState([1,20000]);
const [priceChanged, setPriceChanged] = useState(price);
const [category, setCategory] = useState(null);
const [rating, setRating] = useState(0);
const categories = [  
    'Electronics',
    'Mobile Phones',
    'Laptops',
    'Accessories',
    'Headphones',
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'Home'
];
const setCurrentPageNo = (pageNo) =>{

    setCurrentPage(pageNo)
   
}
useEffect(()=>{//useffect one mattum tha run agum
 if(error){
   return toast(error,{
     position: toast.POSITION.BOTTOM_CENTER
  })
 }
    dispatch(getProducts(keyword,priceChanged,category,rating, currentPage))
  },[error, dispatch, keyword,priceChanged,currentPage,category,rating])
    return(
      <Fragment>
        {loading ? <Loader/>:
           <Fragment> 
            <MetaData title={'Buy best Product'}/>
             <h1 id="products_heading">Search Products</h1>

<section id="products" className="container mt-5">
  <div className="row">
    <div className="col-6 col-md-3 mb-5 mt-5">
        {/*Price Filter */}
        <div className="px-5" onMouseUp={()=>setPriceChanged(price)}>
      
        <Slider
                                        range={true}
                                        marks = {
                                             {
                                                1: "1",
                                                20000: "20000"
                                             }   
                                        }
                                        min={1}
                                        max={20000}
                                        defaultValue={price}
                                        onChange={(price)=>{
                                            setPrice(price)
                                        }}
                                        handleRender={
                                            renderProps => {
                                                return (
                                                    <Tooltip  overlay={`$${renderProps.props['aria-valuenow']}`}  >
                                                         <div {...renderProps.props}>  </div>
                                                    </Tooltip>
                                                )
                                            }
                                        }
                                    />
        </div>
         {/*categare Filter */}
        <hr className="mt-5"/>
            <div className="mt-3 ml-5">
                <h3 className="mb-3"> categaries</h3>
                <ul className="pl-0">
                    {categories.map(category=>
                         <li style={{
                            cursor:"pointer",
                            listStyle:"none"
                        }}
                        key={category}
                        onClick={()=>{
                            setCategory(category)
                        }}>
                           {category}
                        </li>
                        )}
                   
                </ul>
            </div>
         {/*rating Filter */}
         <div className="mt-5">
                                    <h4 className="mb-3 ml-5">Ratings</h4>
                                    <ul className="pl-0 ml-5">
                                        {[5, 4, 3, 2, 1].map(star =>
                                             <li
                                             style={{
                                                 cursor:"pointer",
                                                 listStyleType: "none"
                                             }}
                                             key={star}
                                             onClick={()=>{
                                                setRating(star)
                                             }}
                                             >
                                               <div className="rating-outer">
                                                    <div 
                                                    className="rating-inner"
                                                    style={{
                                                        width: `${star * 20}%`
                                                    }}
                                                    > 

                                                    </div>
                                               </div>
                                             </li>
                                            
                                            )}
                                           
                                       </ul>
                                </div>
    </div>
   
    <div className="col-6 col-md-9">
        <div className="row">
         
        {products && products.map(product => (
        <div className="col-sm-12 col-md-6 col-lg-5 my-3">
        <div className="card p-3 rounded">
          <img
            className="card-img-top mx-auto"
            src={product.images[0].image}
            alt=' '
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title">
              <Link to={`/product/${product._id}`}>{product.name}</Link>
            </h5>
            <div className="ratings mt-auto">
              <div className="rating-outer">
                <div className="rating-inner" style={{width: `${product.ratings/5*100}%`}}></div>
              </div>
              <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
            </div>
            <p className="card-text">${product.price}</p>
           <Link to={`/product/${product._id}`}id="view_btn" className="btn btn-block">View Details</Link>
          </div>
        </div>
   
  
    </div>
         ))}
        </div>
    </div>
   
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