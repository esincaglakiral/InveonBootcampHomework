import React from 'react'
import { Link } from 'react-router-dom'
import avater from '../../../assets/img/common/avater.png'
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom"
import Swal from 'sweetalert2';
import userManager from '../../../utils/userManager';
import { userIsLoggedIn } from '../../../app/slices/user';

const TopHeader = () => {
    let dispatch = useDispatch();
    const history = useNavigate()

    let loggedIn = useSelector(userIsLoggedIn);
    let user = useSelector((state) => state.user.user);

    const login = () => {
        const customState = { path: window.location };
        userManager.signinRedirect({ state: customState });
    }

    const cikisYap = () => {
        console.log("logouta tiklandi");
        dispatch({ type: "user/logout" })
        history("/");
    }
    return (
        <>
            <section id="top_header">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            <div className="top_header_left">
                                <p>Özel koleksiyonlar için...<Link to="/shop/shop-left-sidebar">Daha fazlası...</Link></p>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12 col-12">
                            <div className="top_header_right">
                                {
                                    !loggedIn ?
                                        <ul className="right_list_fix">

                                            <li onClick={() => login()}><Link to="#"><i className="fa fa-lock"></i>
                                                Giriş Yap</Link></li>
                                            <li><Link to="/register"><i className="fa fa-lock"></i>
                                                Kayıt Ol</Link></li>
                                        </ul>

                                        :

                                        <ul className="right_list_fix">
                                            <li><Link to="/order-tracking"><i className="fa fa-truck">
                                            </i> Siparişinizi Takip Edin!</Link></li>
                                            <li className="after_login"><img src={avater} alt="avater" />
                                                {user.profile.name} <i className="fa fa-angle-down"></i>
                                                <ul className="custom_dropdown">
                                                    <li><Link to="/my-account"><i className="fa fa-tachometer">
                                                    </i> Panel</Link></li>
                                                    <li><Link to="/my-account/customer-order">
                                                        <i className="fa fa-cubes"></i> Siparişlerim</Link></li>
                                                    <li><Link to="#!" onClick={() => { cikisYap() }} >
                                                        <i className="fa fa-sign-out"></i> Çıkış Yap</Link></li>
                                                </ul>
                                            </li>
                                        </ul>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default TopHeader