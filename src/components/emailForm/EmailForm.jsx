import React, { useState } from 'react'
import "./style.scss"

import { updateDoc,doc,arrayUnion } from "firebase/firestore"; 
import { db } from "../../firebase";

import {
    RiUser2Line,
    RiPhoneLine,
    RiCloseCircleLine
    
  } from "react-icons/ri";

const EmailForm = (props) => {
    const {setShowEnailForm, user} = props
    const [name,setName]=useState("")
    const [phone,setPhone]=useState("")
    const [message,setMessage]=useState("")

    const userInf = doc(db,'users',`${user}`)

    const handleChangeInput = (e,type)=>{
        const value = e.target.value
        const object = {
            name : ()=>{
                setName(value)
            },
            phone : ()=>{
                setPhone(value)
            },message : ()=>{
                setMessage(value)   
            }
        }
        object[type]()
    }

    const handleSendMail = async (e)=>{
        e.preventDefault()
        await updateDoc(userInf,{
            savedMailClient: arrayUnion({
                name: name,
                phone: phone,
                message : message,
            })
        })
        alert("Email sent successfully, I will see and reply as soon as possible")
        setMessage("")
        setPhone("")
        setName("")
      
    }


  return (
    <div class="container">
        <div class="box">
            <div className='closeBtn' onClick={()=>setShowEnailForm(false)} >
                <RiCloseCircleLine />
            </div>
            <h3>Get in Touch</h3>
            <div class="name">
            <RiUser2Line  className='user' />
                <input type="text" placeholder="Name" value={name} id="name" onChange={(e)=>handleChangeInput(e,"name")}/>
            </div>
            <div class="phone">
            <RiPhoneLine  className='phoneNumber' />
                <input type="text" placeholder="Phone" value={phone} id="phone" onChange={(e)=>handleChangeInput(e,"phone")}/>
            </div>
            <div class="message-box">
                <textarea id="msg" cols="30" rows="10" value={message} placeholder="Message" onChange={(e)=>handleChangeInput(e,"message")}></textarea>
            </div>
            
            <div class="buttonSend">
                <button id="send"  onClick={handleSendMail}>Send</button>
            </div>
 
        </div>
    </div>
  )
}

export default EmailForm