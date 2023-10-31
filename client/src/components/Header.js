import React, { useEffect, useState } from 'react'
import "./style.css"
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Badge from '@mui/material/Badge';
import Nav from 'react-bootstrap/Nav'
import Menu from '@mui/material/Menu';
import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/esm/Table';
import { DLT } from '../redux/actions/action';
import { loadStripe } from '@stripe/stripe-js';

const Header = () => {

    const [price, setPrice] = useState(0);
    // console.log(price);


    const auth = localStorage.getItem('user');

    const getdata = useSelector((state) => state.cartreducer.carts);
    // console.log(getdata);

    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const dlt = (id) => {
        dispatch(DLT(id))
    }


    const total = () => {
        let price = 0;
        getdata.map((ele, k) => {
            price = ele.price * ele.qnty + price
        });
        setPrice(price);
    };
    

    useEffect(() => {
        total();
    },[total])

    // for  payment integration
    const makePayment = async () => {
        const stripe = await loadStripe("pk_test_51O5nX9SCau38a3rcGSxt9dyK6DcZrf4LesjZDfpnecvdYTGeUlafMyiXjH6F8SaYleXsAjyOJBtVAuH7IRRyBpQ800rbM0GTvM");

        const body = {
            products: getdata
        }
        const headers = {
            "Content-Type": "application/json"
        }
        const response = await fetch("http://localhost:5000/api/create-checkout-session", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });

        const session = await response.json();

        const result = stripe.redirectToCheckout({
            sessionId: session.id
        });

        if (result.error) {
            console.log(result.error);
        }
    }

    return (
        <>
            <Navbar className="nav" bg="dark" variant="dark" style={{ height: "60px" }}>
                <Container>
                    <NavLink to="/Signup" className="text-decoration-none text-light mx-3">My Account</NavLink>
                    <Nav className="me-auto">
                        <NavLink to="/" className="text-decoration-none text-light">Menu</NavLink>
                    </Nav>

                    <Badge badgeContent={getdata.length} color="primary"
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <i class="fa-solid fa-cart-shopping text-light" style={{ fontSize: 25, cursor: "pointer" }}></i>
                    </Badge>

                </Container>


                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >

                    {
                        getdata.length ?
                            <div className='card_details' style={{ width: "24rem", padding: 10 }}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Photo</th>
                                            <th>Restaurant Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            getdata.map((e) => {
                                                return (
                                                    <>
                                                        <tr>
                                                            <td>
                                                                <NavLink to={`/cart/${e.id}`} onClick={handleClose}>
                                                                    <img src={e.imgdata} style={{ width: "5rem", height: "5rem" }} alt="" />
                                                                </NavLink>
                                                            </td>
                                                            <td>
                                                                <p>{e.rname}</p>
                                                                <p>Price : ₹{e.price}</p>
                                                                <p>Quantity : {e.qnty}</p>
                                                                <p style={{ color: "red", fontSize: 20, cursor: "pointer" }} onClick={() => dlt(e.id)}>
                                                                    <i className='fas fa-trash smalltrash'></i>
                                                                </p>
                                                            </td>

                                                            <td className='mt-5' style={{ color: "red", fontSize: 20, cursor: "pointer" }} onClick={() => dlt(e.id)}>
                                                                <i className='fas fa-trash largetrash'></i>
                                                            </td>
                                                        </tr>
                                                    </>
                                                )
                                            })
                                        }
                                        <p className='text-center'>Total :₹ {price}</p>

                                           { auth ?
                                            <button type="button" onClick={makePayment} className="btnbn">
                                                Checkout
                                            </button> :
                                       
                                           <Link to ="/login">
                                            <span onClick={handleClose} style={{fontWeight:'bold'}}> My Account   </span> </Link>
                                                                                   
                                            
                                        }                                  
                                    </tbody>
                                </Table>
                            </div> :

                            <div className='card_details d-flex justify-content-center align-items-center' style={{ width: "24rem", padding: 10, position: "relative" }}>
                                <i className='fas fa-close smallclose'
                                    onClick={handleClose}
                                    style={{ position: "absolute", top: 2, right: 20, fontSize: 23, cursor: "pointer" }}></i>
                                <p style={{ fontSize: 22 }}>Your carts is empty</p>
                                <img src="./cart.gif" alt="" className='emptycart_img' style={{ width: "5rem", padding: 10 }} />
                            </div>
                    }

                </Menu>
            </Navbar>
        </>
    )
}

export default Header