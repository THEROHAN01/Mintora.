/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import "./style.css"
function Input({label,state,setState,placeholder,type}) {
  return (
    <div className='input-wrapper'>
        <p className='input-label'>{label}</p>
        <input
         type={type}
         placeholder={placeholder}
         value={state}
         onChange={(e) => setState(e.target.value)} 
         className='input-custom'
         />
        
    </div>
  )
}

export default Input