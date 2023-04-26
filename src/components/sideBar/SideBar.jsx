import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  RiSearch2Line,
  RiHomeHeartLine,
  RiMovie2Line,
  RiMailSendLine,
  RiFireLine,
  RiStarHalfLine,
  RiEmotionHappyLine,
  RiLogoutBoxLine,
  RiTv2Line,
  RiLoginBoxLine,
} from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";


import { logOutAcc } from "../../authResponse/authResponse";
import EmailForm from "../emailForm/EmailForm";

import "./style.scss";


const SideBar = () => {
  const { user } = useSelector((state) => state.auth);

  console.log(user)

  const [query, setQuery] = useState("");
  const [logged, setLogged] = useState(false);
  const [showEnailForm,setShowEnailForm] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(()=>{
    if(user){
      setLogged(true)
    }else{
      setLogged(false)
    }
  },[user])

  const navigation = (dir) => {
    navigate(dir)
  }

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  const handleUserStateManage =()=>{
    if(user){
      logOutAcc()
      dispatch(logout())
      setLogged(false)
      navigation("/")
    }else{
      navigation("/auth/login")
    }

  }

  const handleContact =()=>{
    if(user) {
      setShowEnailForm(true)

    }else{
      alert("You need to be logged in to use this feature")
      setShowEnailForm(false)
    }
  }



  return (
    <>
    <nav className={`sideBar`}>
      <div className="wrapper">
        <header>
          <div className="image-text">
            <span className="image">
              <img
                src={logged ? "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2023/02/Hinh-anh-avatar-Facebook.jpg?ssl=1": "https://w1.pngwing.com/pngs/743/500/png-transparent-circle-silhouette-logo-user-user-profile-green-facial-expression-nose-cartoon.png"}
                alt=""
              />
            </span>
            <span className="info">
              <div className="nameInf">{logged ? "Hello !" : "Admin" }</div>
              <div className="profession">{logged ? user : "Web developer" }</div>
            </span>
          </div>
        </header>

        <div className="content">
          <div className="search">
            <RiSearch2Line style={{ color: "white", fontSize: "30px" }} />
            <input type="text" placeholder="Search..." onChange={(e) => setQuery(e.target.value)}
              onKeyUp={searchQueryHandler} />
          </div>
          <div className="menu">
            <ul >
              <li className="nav-link" onClick={() => navigation("/")}>
                <RiHomeHeartLine style={{ color: "white", fontSize: "30px" }} />
                <span className="text ">Home</span>
              </li>

              <li className="nav-link" onClick={() => navigation("/explore/movie")}>
                <RiMovie2Line style={{ color: "white", fontSize: "30px" }} />
                <span className="text ">Movies</span>
              </li>

              <li className="nav-link" onClick={() => navigation("/explore/tv")}>
                <RiTv2Line style={{ color: "white", fontSize: "30px" }} />
                <span className="text ">TV Shows</span>
              </li>

              <li className="nav-link" onClick={() => navigation("/explore/trending")}>
                <RiFireLine style={{ color: "white", fontSize: "30px" }} />
                <span className="text ">Trending</span>
              </li>

              <li className="nav-link" onClick={() => navigation("/explore/popular")}>
                <RiEmotionHappyLine
                  style={{ color: "white", fontSize: "30px" }}
                />
                <span className="text ">Popular</span>
              </li>

              <li className="nav-link" onClick={() => navigation("/explore/top_rated")}>
                <RiStarHalfLine style={{ color: "white", fontSize: "30px" }} />
                <span className="text nav-text">Top Rated</span>
              </li>

              <li className="nav-link" onClick={handleContact}>
                <RiMailSendLine style={{ color: "white", fontSize: "30px" }} />
                <span className="text ">Contact</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer">
          <div className="logout" onClick={handleUserStateManage} >
            {logged ? (
              <>
                <RiLogoutBoxLine style={{ color: "white", fontSize: "30px" }} />
                <span className="text ">Log Out</span>
              </>
            ) :
              (
                <>
                  <RiLoginBoxLine style={{ color: "white", fontSize: "30px" }}  />
                  <span className="text ">Log In</span>
                </>
              )
            }


          </div>
        </div>
        
      </div>
    </nav>

    {showEnailForm ?  <div className="contact">
         <EmailForm setShowEnailForm={setShowEnailForm} user={user}/>  
    </div>
    :
    <></>}
   
    </>
  );
};

export default SideBar;
