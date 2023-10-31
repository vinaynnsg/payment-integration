import React, { useEffect, useState } from 'react'
import "./style.css";
import Table from 'react-bootstrap/Table'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { DLT, ADD, REMOVE } from '../redux/actions/action'
import {loadStripe} from '@stripe/stripe-js';
import {Link } from 'react-router-dom';

const CardsDetails = () => {
  const auth = localStorage.getItem('user');
  const [data, setData] = useState([]);
  // console.log(data);

  const { id } = useParams();
  // console.log(id);

  const history = useNavigate();

  const dispatch = useDispatch();
  const [price,setPrice] = useState(0);

  const getdata = useSelector((state) => state.cartreducer.carts);
  console.log(getdata);


  const compare = () => {
    let comparedata = getdata.filter((e) => {
      return e.id == id
    });
    setData(comparedata);
  }

  // add data


  const send = (e) => {
    // console.log(e);
    dispatch(ADD(e));
  }

  const dlt = (id) => {
    dispatch(DLT(id));
    history("/");
  }

  // remove one
  const remove = (item) => {
    dispatch(REMOVE(item))
  }
  const total = ()=>{
    let price = 0;
    getdata.map((ele,k)=>{
        price = ele.price * ele.qnty + price
    });
    setPrice(price);
};



  useEffect(() => {
    compare();
    total();
  }, [total,id])

  // for  payment integration
  const makePayment = async()=>{
    const stripe = await loadStripe("pk_test_51O5nX9SCau38a3rcGSxt9dyK6DcZrf4LesjZDfpnecvdYTGeUlafMyiXjH6F8SaYleXsAjyOJBtVAuH7IRRyBpQ800rbM0GTvM");

    const body = {
        products:getdata
    }
    const headers = {
        "Content-Type":"application/json"
    }
    const response = await fetch("http://localhost:5000/api/create-checkout-session",{
        method:"POST",
        headers:headers,
        body:JSON.stringify(body)
    });

    const session = await response.json();

    const result = stripe.redirectToCheckout({
        sessionId:session.id
    });
    
    if(result.error){
        console.log(result.error);
    }
}

  return (
    <>
      <div className="container mt-2">
        <h2 className='text-center'>Items Details Page
        </h2>

        <section className='container mt-3'>
          <div className="itemsdetails">
            {
              data.map((ele) => {
                return (
                  <>
                    <div className="items_img">
                      <img src={ele.imgdata} alt="" />
                    </div>

                    <div className="details">
                      <Table>
                        <tr>
                          <td>
                            <p> <strong>Restaurant</strong>  : {ele.rname}</p>
                            <p> <strong>Price</strong>  : ₹{ele.price}</p>
                            <p> <strong>Dishes</strong>  : {ele.address}</p>
                            <p> <strong>Subtotal</strong>  :₹  {ele.price * ele.qnty}</p>
                            <div className='mt-5 d-flex justify-content-between align-items-center' style={{ width: 100, cursor: "pointer", background: "#ddd", color: "#111" }}>
                              <span style={{ fontSize: 24 }} onClick={ele.qnty <= 1 ? () => dlt(ele.id) : () => remove(ele)}>-</span>
                              <span style={{ fontSize: 22 }}>{ele.qnty}</span>
                              <span style={{ fontSize: 24 }} onClick={() => send(ele)}>+</span>

                            </div>

                          </td>
                          <td>
                            <p><strong>Rating :</strong> <span style={{ background: "green", color: "#fff", padding: "2px 5px", borderRadius: "5px" }}>{ele.rating} ★	</span></p>
                            <p><strong>Order Review :</strong> <span >{ele.somedata}	</span></p>
                            <p><strong>Remove :</strong> <span ><i className='fas fa-trash' onClick={() => dlt(ele.id)} style={{ color: "red", fontSize: 20, cursor: "pointer" }}></i>	</span></p>
                            <div>
                            <p className='text-center-btn'><b>Total :₹ {price}</b></p>
                            { auth ?
                                            <button type="button" onClick={makePayment} className="btnbn">
                                                Checkout
                                            </button> :
                                       
                                           <Link to ="/login">
                                            <span  style={{fontWeight:'bold'}}> My Account   </span> </Link>
                                                                                   
                                            
                                        }         
                            </div>
                          </td>

                        </tr>
                      </Table>

                    </div>



                  </>
                )
              })
            }
          </div>
        </section>
      </div>
    </>
  )
}

export default CardsDetails