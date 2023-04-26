import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { createReview, getProduct } from "../../actions/productsAction";
import Loader from './Loader';
import {Carousel} from 'react-bootstrap';
import MetaData from '../layouts/MetaData';
import { addcartItem } from "../../actions/cartActions";
import {Modal } from 'react-bootstrap';
import { clearReviewSubmitted, clearError, clearProduct } from '../../slices/productSlice';
import { toast } from "react-toastify";
import ProductReview from "./ProductReview";

export default function ProductDetails(){

    const dispatch = useDispatch();

    const {id} = useParams()//get id
    
   const {loading, product={}, isReviewSubmitted, error} =  useSelector((state)=>state.productState);
   const {user} =useSelector((state)=>state.authState);
   const [quantity, setQuantity] = useState(1);
    const increaseQty = () =>{
        const count = document.querySelector('.count');
        if(product.stock ===0 || count.valueAsNumber >= product.stock ) return;
        const qty = count.valueAsNumber + 1; //qty ha increase panurom
        setQuantity(qty);
    }
    const decreaseQty = () =>{
        const count = document.querySelector('.count');
        if(count.valueAsNumber === 1) return;
        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }
    const reviewHandler = () =>{
        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', comment);
        formData.append('productId', id);
       dispatch(createReview(formData));

    }
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    useEffect(()=>{
        if(isReviewSubmitted){
            handleClose()
            toast('Review Submitted successfully',{
                type: 'success',
                position: toast.POSITION.BOTTOM_CENTER,
                onOpen: () => dispatch(clearReviewSubmitted())
            })

        }
        if(error)  {
            toast(error, {
                position: toast.POSITION.BOTTOM_CENTER,
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }
        if(!product._id || isReviewSubmitted){
            dispatch(getProduct(id))

        }
        return () =>{
            dispatch(clearProduct())
        }

    }, [dispatch, id, isReviewSubmitted, error]);

    return(
        <Fragment>
         {loading? <Loader/>:
            <Fragment>
            <MetaData title={product.name}/>
            <div className="container container-fluid">
            <div className="row f-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <Carousel pause='hover'>
                    {product.images && product.images.map(image => //loop mari podanum
                        <Carousel.Item key={image._id}>
                            <img className="d-block w-100" src={image.image} alt={product.name} height="500" width="500"/>

                        </Carousel.Item>
                        
                    )}
                    </Carousel>
                </div>

                <div className="col-12 col-lg-5 mt-5">
                    <h3>{product.name}</h3>
                        <p id="product_id">Product # {product._id}</p>

                    <hr/>
    
                    <div className="rating-outer">
                        <div className="rating-inner" style={{width: `${product.ratings/ 5 *100}%`}}></div>
                    </div>
                    <span id="no_of_reviews">({product.numOfReviews}Reviews)</span>

                    <hr/>
                <p id="product_price"> 
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
               <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
              </svg>
              {product.price}
                </p>
                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>

                        <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                        <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                    </div>
                    <button type="button" id="cart_btn"
                    disabled={product.stock===0?true:false} 
                    onClick={()=>{
                        dispatch(addcartItem(product._id,quantity))
                       
                            toast('Card Item Added!!',{
                                type: 'success',
                                position: toast.POSITION.BOTTOM_CENTER,
                               
                             })
                
                       
                    }}
                    className="btn btn-primary d-inline ml-4">
                        Add to Cart
                    </button>

                    <hr/>

                    <p>Status: <span id="stock_status" className= {product.stock > 0?'greenColor':'redColor'}>{product.stock > 0?'Stock Avialabe':'Out of Stock'}</span></p>

                    <hr/>

                    <h4 className="mt-2">Description:</h4>
                    <p>{product.description}</p>
                    <hr/>
                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                    {user ?
                    <button  onClick={handleShow} id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                Submit Your Review
                    </button>:
                    <div className="alert alert-danger mt-5">Login to Post Review </div>

                    }
                    
                    <div className="row mt-2 mb-5">
                        <div className="rating w-50">
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                <Modal.Title>Submit Review</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                <ul className="stars" >
                                    {
                                        [1,2,3,4,5].map(star => (
                                            <li 
                                            value={star}
                                            onClick={()=>setRating(star)}
                                            className={`star ${star<=rating?'orange':''}`}
                                            onMouseOver={(e) => e.target.classList.add('yellow')}
                                            onMouseOut={(e) => e.target.classList.remove('yellow')}

                                            ><i className="fa fa-star"></i></li>
                                        ))
                                    }
                                                
                                            </ul>

                                            <textarea onChange={(e)=>setComment(e.target.value)} value={comment} name="review" id="review" className="form-control mt-3">

                                            </textarea>

                                       
                                    <button disabled={loading} onClick={reviewHandler} aria-label="Close" className="btn my-3 float-right review-btn px-4 text-white">Submit</button>
                                </Modal.Body>
                               
                            </Modal>
                        </div>
                    </div>		
                </div>

            </div>

        </div>
        {product.reviews && product.reviews.length > 0 ?
        <ProductReview reviews={product.reviews}/>:null}
            </Fragment>

          
         }
        </Fragment>
    )
}