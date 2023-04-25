import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendEmailVerification,
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


export function logIn(email, password,navigation,dispatchLogin) {

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Đăng nhập thành công, trả về đối tượng người dùng (user object)
      const user = userCredential.user;
      console.log('User đã đăng nhập:', user);
      localStorage.setItem('user', JSON.stringify(user));
      dispatchLogin(user.email)
      navigation("/")
    })
    .catch((error) => {
      // Đăng nhập thất bại, trả về đối tượng lỗi (error object)
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Đăng nhập thất bại, mật khẩu hoặc email không chính xác")
      console.log('Đăng nhập thất bại:', errorMessage);
    });

  }

export  function logOutAcc() {
    return signOut(auth);
  }

export const authListener = () => {
    onAuthStateChanged(auth, (currentUser) => {
        console.log("current User", currentUser)
        // console.log("current state", auth.currentUser.emailVerified ? auth.currentUser.emailVerified : "" )
      })
};

export default authListener;



