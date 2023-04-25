import React, { useRef, useState, useEffect } from "react";
import { RiMailLine, RiLockPasswordLine, RiLockUnlockLine } from "react-icons/ri"


import "./style.scss";
import { useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { signUpAccount } from "../../authResponse/authResponse";

const SignUp = () => {
  const [emailInput, setEmailInput] = useState('')
  const [passInput, setPasInput] = useState('')
  const [passResetInput, setPassResetInput] = useState('')
  const [toggleShowPass, setToggleShowPass] = useState(false)
  const [toggleShowResetPass, setToggleShowResetPass] = useState(false)
  const [message, setMessage] = useState(false)
  const [colorMessage, setColorMessage] = useState(false)
  const [required, setRequired] = useState(false)
  const [colorRequired, setColorRequired] = useState(false)

  const [confirming, setConfirming] = useState(false)
  const [loadConf, setLoadConf] = useState(false)


  const emailRef = useRef()
  const passRef = useRef()
  const passInputRef = useRef()
  const passResetRef = useRef()
  const passResetInputRef = useRef()
  const backgroundRef = useRef()
  const checkboxRef = useRef()
  const navigate = useNavigate();

  const { url } = useSelector((state) => state.home);
  const { data, loading } = useFetch("/movie/upcoming");

  const navigation = (dir) => {
    navigate(dir)
  }


  useEffect(() => {
    const random = Math.floor(Math.random() * 20)
    const bg =
      url.backdrop +
      data?.results?.[random]?.backdrop_path;
    backgroundRef.current.style.backgroundImage = `url(${!loading ? bg : 'https://haycafe.vn/wp-content/uploads/2022/01/Hinh-nen-vu-tru-khong-gian.jpg'}`;

  }, [data]);

  const handleInput = (e, type) => {
    let value = e.value.split(' ').join('')
    if (type === 'email') {
      setEmailInput(value)
    } else if (type === 'password') {
      setPasInput(value)
      if (value.length < 6) {
        setRequired(true)
        setColorRequired(false)
      } else {
        setRequired(true)
        setColorRequired(true)
        setTimeout(() => {
          setRequired(false)
        }, 2000)
      }
    } else if (type === 'resetPass') {
      setPassResetInput(value)
      if (value === passInput) {
        setMessage(true)
        setColorMessage(true)
        setTimeout(() => {
          setMessage(false)
        }, 2000)

      } else {
        setMessage(true)
        setColorMessage(false)
      }
    }
  }

  const handleFocus = (type) => {
    if (type === 'email') {
      emailRef.current.classList.add('label')
    } else if (type === 'password') {
      passRef.current.classList.add('label')
    } else if (type === 'resetPass') {
      passResetRef.current.classList.add('label')
    }

  }
  const handleBlur = (type) => {
    let object = {
      email: () => {
        if (emailInput) {
          return
        } else {
          return emailRef.current.classList.remove('label');
        }
      },
      password: () => {
        if (passInput) {
          return
        } else {
          return passRef.current.classList.remove('label');
        }
      },
      resetPass: () => {
        if (passResetInput) {
          return

        } else {
          return passResetRef.current.classList.remove('label');
        }
      },
    }

    object[type]()

  }

  const handleShowPass = (state, type) => {
    let value = !state
    let ref = ''
    if (type === 'password') {
      setToggleShowPass(value)
      ref = passInputRef.current

    }
    else if (type === 'resetPass') {
      ref = passResetInputRef.current
      setToggleShowResetPass(value)

    }

    value ? ref.setAttribute(
      'type',
      'text'
    )
      :
      ref.setAttribute(
        'type',
        'password'
      )
  }

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()


    const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
    const isValidEmail = emailRegex.test(emailInput)
    if (isValidEmail && passInput === passResetInput && checkboxRef.current.checked) {
      setConfirming(true)
      setLoadConf(true)
      try {
        await signUpAccount(emailInput, passInput)

      } catch (errorAPi) {
        console.log("error ", errorAPi);


      }
      setTimeout(() => {
        setLoadConf(false)
      }, 2000)

    }
  }

  const handleBack = (value) => {
    if (value === "login") {
      navigation("/auth/login")
    }
  }

  return (

    <section ref={backgroundRef}>
      <div className="form-box-sign">
        <div className="form-value">
          {!confirming ? (<form action="">
            <h2>Sign Up</h2>
            <div className="inputbox">
              <RiMailLine className="icon" />
              <input type="email" value={emailInput} required onChange={(e) => handleInput(e.target, 'email')} onFocus={() => handleFocus('email')} onBlur={() => handleBlur('email')} />
              <label htmlFor="" ref={emailRef} >Email</label>
            </div>
            <div className="inputbox" >
              <div onClick={() => handleShowPass(toggleShowPass, 'password')} style={{ cursor: 'pointer' }} >
                {toggleShowPass ? <RiLockUnlockLine className="icon" /> : <RiLockPasswordLine className="icon" />}
              </div>
              <input type="password" value={passInput} required ref={passInputRef} onChange={(e) => handleInput(e.target, 'password')} onFocus={() => handleFocus('password')} onBlur={() => handleBlur('password')} />
              <label htmlFor="" ref={passRef}>Password</label>
              {required ? <div className={`required ${colorRequired ? "blue" : ""}`}>
                Password must be more than 6 characters</div> : <></>}

            </div>
            <div className="inputbox" >
              <div onClick={() => handleShowPass(toggleShowResetPass, 'resetPass')} style={{ cursor: 'pointer' }} >
                {toggleShowResetPass ? <RiLockUnlockLine className="icon" /> : <RiLockPasswordLine className="icon" />}
              </div>
              <input type="password" value={passResetInput} required ref={passResetInputRef} onChange={(e) => handleInput(e.target, 'resetPass')} onFocus={() => handleFocus('resetPass')} onBlur={() => handleBlur('resetPass')} />
              <label htmlFor="" ref={passResetRef}>Reset password</label>
            </div>
            {message ? <div className={`message ${colorMessage ? "blue" : ""}`}>The password does not match, please re-enter</div> : <></>}
            <div className="forget">
              <label htmlFor="">
                <input type="checkbox" required ref={checkboxRef} />
                Agree to all policies and terms
              </label>
            </div>
            <button onClick={handleSubmit}>Confirm</button>
            <div className="register">
              <p>
                Already have an account <a onClick={() => navigation("/auth/login")}>Login now</a>
              </p>
            </div>
          </form>)
            : (loadConf ? <div className="loader"></div>
              : <>
                <h2>Confirm</h2>

                <div className="messageConfirm">Account created successfully</div>
                <div className="button" onClick={() => handleBack("login")}>Login Now !</div>
              </>
            )
          }

        </div>
      </div>
    </section>

  );
};

export default SignUp;
