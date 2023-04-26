import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification,
    sendPasswordResetEmail,
  } from 'firebase/auth';

import { auth,db } from '../firebase';
import {setDoc,doc} from 'firebase/firestore'



export  function signUpAccount(email, password) {
    createUserWithEmailAndPassword(auth, email, password)
    setDoc(doc(db, 'users', email), {
        savedMailClient: []
    })
}

export function sendEmailCheck() {
  sendEmailVerification(auth.currentUser)
  .then(() => {
    localStorage.setItem('email',email)
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode ,errorMessage )
  })
}

export function sendPassReset (email){
  sendPasswordResetEmail(auth, email)
  .then((data) => {
    console.log(data)
    alert("Email sent successfully, please check your email to set a new password")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert("your email does not exist")
  });
}


export function logIn(email, password,navigation,dispatchLogin,setLoad , requiredRemember) {

    setLoad(true)
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Đăng nhập thành công, trả về đối tượng người dùng (user object)
      const user = userCredential.user;
      console.log('User đã đăng nhập:', user);
      localStorage.setItem('user', JSON.stringify(user))
      if (requiredRemember ) {
        const remeberUser = {
          email: email,
          password: password,
        }
        localStorage.setItem("RememberUser", JSON.stringify(remeberUser));
      }
      setLoad(false)
      dispatchLogin(user.email)
      navigation("/")
    })
    .catch((error) => {
      // Đăng nhập thất bại, trả về đối tượng lỗi (error object)
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Đăng nhập thất bại, mật khẩu hoặc email không chính xác")
      console.log('Đăng nhập thất bại:', errorMessage);
      setLoad(false)
      handleRequire(false)
    });

  }

export  function logOutAcc() {
    signOut(auth)
    localStorage.removeItem("user")
    localStorage.removeItem("RememberUser")
  }

export const authListener = () => {
    onAuthStateChanged(auth, (currentUser) => {
        console.log("current User", currentUser)
        // console.log("current state", auth.currentUser.emailVerified ? auth.currentUser.emailVerified : "" )
      })
};

export default authListener;



