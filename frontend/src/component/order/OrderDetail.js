import { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom";
import  { orderDetail as orderDetailAction } from '../../actions/orderActions';
import Loader from "../layouts/Loader";
export default function OrderDetail (){
    const { orderDetail, loading } = useSelector(state => state.orderState)
    const { shippingInfo={}, user={}, orderStatus = "Processing", orderItems=[] , totalPrice = 0, paymentInfo= {} } = orderDetail;
    const isPaid = paymentInfo && paymentInfo.status === "succedded" ? true : false;
    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(()=>{
        dispatch(orderDetailAction(id))
    },[id])
    return(
        <Fragment>
                   {loading ? <Loader/> :
        <Fragment>
                 <div className="container container-fluid">
	
    <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-details">

                    <h1 className="my-5">Order #{orderDetail._id}</h1>

                    <h4 className="mb-4">Shipping Info</h4>
                    <p><b>Name:</b>{user.name}</p>
                    <p><b>Phone:</b>{shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>Address:</b>{shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>
                    <p><b>Amount:</b><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                   <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                </svg>{totalPrice}</p>

                    <hr />

                    <h4 className="my-4">Payment</h4>
                    <p className={isPaid? 'greenColor': 'redColor'}><b>{isPaid? 'PAID': 'NOT PAID'}</b></p>


                    <h4 className="my-4">Order Status:</h4>
                    <p className={orderStatus&& orderStatus.includes('Delivered')? 'greenColor': 'redColor'}><b>{orderStatus}</b></p>


                    <h4 className="my-4">Order Items:</h4>

                    <hr />
                    <div className="cart-item my-1">
                        {orderItems && orderItems.map(item => (
                                <div className="row my-5">
                                <div className="col-4 col-lg-2">
                                    <img src={item.image} alt={item.name} height="45" width="65" />
                                </div>

                                <div className="col-5 col-lg-5">
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                </div>


                                <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                    <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-currency-rupee" viewBox="0 0 16 16">
                   <path d="M4 3.06h2.726c1.22 0 2.12.575 2.325 1.724H4v1.051h5.051C8.855 7.001 8 7.558 6.788 7.558H4v1.317L8.437 14h2.11L6.095 8.884h.855c2.316-.018 3.465-1.476 3.688-3.049H12V4.784h-1.345c-.08-.778-.357-1.335-.793-1.732H12V2H4v1.06Z"/>
                </svg>{item.price}</p>
                                </div>

                                <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                    <p>{item.quantity} Piece(s)</p>
                                </div>
                            </div>
                        ))}
                                
                    </div>
                    <hr />
                </div>
            </div>
    
    </div>
        </Fragment>
    }
        </Fragment>
     
    )
}