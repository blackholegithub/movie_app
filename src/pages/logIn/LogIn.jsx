import React, { useRef, useState, useEffect } from "react";
import {
  RiMailLine,
  RiLockPasswordLine,
  RiLockUnlockLine,
} from "react-icons/ri";

import "./style.scss";
import { useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { logIn ,sendPassReset} from "../../authResponse/authResponse";
import { useDispatch } from "react-redux";
import { login } from "../../store/authSlice";


const LogIn = () => {
  const [background, setBackground] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passInput, setPasInput] = useState("");
  const [toggleShowPass, setToogleShowPass] = useState(false);
  const [loadLogin, setLoadLogin] = useState(false);

  const emailRef = useRef();
  const passRef = useRef();
  const passInputRef = useRef();
  const backgroundRef = useRef();
  const checkBoxRef = useRef();

  const { url } = useSelector((state) => state.home);
  const { data, loading } = useFetch("/movie/upcoming");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const navigation = (dir) => {
    navigate(dir);
  };

  const dispatchLogin = (data) => {
    dispatch(login(data));
  }

  const setLoad =(boolean)=>{
    setLoadLogin(boolean)
  }


  useEffect(() => {
    const random = Math.floor(Math.random() * 20);
    const bg = url.backdrop + data?.results?.[random]?.backdrop_path;
    setBackground(bg);
    backgroundRef.current.style.backgroundImage = `url(${
      !loading
        ? bg
        : "https://haycafe.vn/wp-content/uploads/2022/01/Hinh-nen-vu-tru-khong-gian.jpg"
    }`;
  }, [data]);

  const handleInput = (e, type) => {
    let value = e.value.split(" ").join("");

    type === "email" ? setEmailInput(value) : setPasInput(value);
  };

  const handleFocus = (type) => {
    type === "email"
      ? emailRef.current.classList.add("label")
      : passRef.current.classList.add("label");
  };
  const handleBlur = (type) => {
    let object = {
      email: () => {
        if (emailInput) {
          return;
        } else {
          return emailRef.current.classList.remove("label");
        }
      },
      password: () => {
        if (passInput) {
          return;
        } else {
          return passRef.current.classList.remove("label");
        }
      },
    };

    object[type]();
  };

  const handleShowPass = () => {
    let value = !toggleShowPass;
    setToogleShowPass((pre) => !pre);
    value
      ? passInputRef.current.setAttribute("type", "text")
      : passInputRef.current.setAttribute("type", "password");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const requiredRemember = checkBoxRef.current.checked
    logIn(emailInput, passInput, navigation, dispatchLogin,setLoad, requiredRemember);
 
  }

  const HandlesendPassReset =()=>{
    const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    const isValidEmail = emailRegex.test(emailInput)
    if(isValidEmail){
      sendPassReset(emailInput)
    }else{
      alert("Please enter your email to use this feature")
    }
  }

  return (
    <section ref={backgroundRef}>
      <div className="form-box">
        {!loadLogin? (
          <div className="form-value">
          <form action="">
            <h2>Log In</h2>
            <div className="inputbox">
              <RiMailLine className="icon" />
              <input
                type="email"
                value={emailInput}
                required
                onChange={(e) => handleInput(e.target, "email")}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
              />
              <label htmlFor="" ref={emailRef}>
                Email
              </label>
            </div>
            <div className="inputbox">
              <div onClick={handleShowPass} style={{ cursor: "pointer" }}>
                {toggleShowPass ? (
                  <RiLockUnlockLine className="icon" />
                ) : (
                  <RiLockPasswordLine className="icon" />
                )}
              </div>

              <input
                type="password"
                value={passInput}
                required
                ref={passInputRef}
                onChange={(e) => handleInput(e.target)}
                onFocus={() => handleFocus()}
                onBlur={() => handleBlur("password")}
              />
              <label htmlFor="" ref={passRef}>
                Password
              </label>
            </div>
            <div className="forget">
              <label htmlFor="">
                <input type="checkbox" ref={checkBoxRef} />
                Remember Me <a  onClick={HandlesendPassReset} style={{ cursor: "pointer" }}>Forget Password</a>
              </label>
            </div>
            <button onClick={handleLogin}>Log in</button>
            <div className="register">
              <p>
                Don't have a account{" "}
                <a href="#" onClick={() => navigation("/auth/signup")}>
                  Register
                </a>
              </p>
            </div>
          </form>
        </div>
        ):( <div className="loaderLogin"></div>)}
        
       
      </div>
      
    </section>
  );
};

export default LogIn;
