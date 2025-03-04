import React, { useActionState } from 'react'

const ActionState = () => {

  const handleSubmit=({previousState, formData})=>{
    console.log('Form Submitted')
  }
  const intialState={loading:false, error:null, data:null}

  const[state,formAction, pending]=useActionState(handleSubmit, intialState)
  return (
    <div>
      <form className='flex flex-col bg-amber-200 p-4 rounded-lg' action={formAction}>
        <label htmlFor="">Enter your Name</label>
        <input className='border-2' type="text" placeholder='Enter Your Name'/>
        <label htmlFor="">Enter your Password</label>
        <input className='border-2' type="text" placeholder='Enter Password'/>
      </form>
    </div>
  )
}

export default ActionState