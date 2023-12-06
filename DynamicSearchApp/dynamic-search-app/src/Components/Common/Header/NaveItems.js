import React from "react";
import { Link } from "react-router-dom";

//NaveItems constructor ına parametre gönderiyorum 
//NaveItems const componeninden bir nesne oluştulduğunda props ile buna veri gönderimi yapılıyor

const NaveItems = (props) => {
    return(
        <>
            {
                <li className="has-drowdown">
                    <a href={props.item.href} className="main-menu-link">{props.item.name}
                    {
                        props.item.children && 
                        <i className="fa fa-angle-down"></i>
                    }

                    </a>
                        {
                            props.item.children &&
                            <ul className="sub-menu">
                                {props.item.children.map((subMenu,subMenuIndex)=> (
                                    <li key={subMenuIndex}>
                                        <Link to={subMenu.href}>{subMenu.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        }
                </li>
            }
        </>
    )
}

export default NaveItems