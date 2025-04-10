import React from 'react'
import {SignIn} from '@clerk/clerk-react'
function Signin() {
  return (
    <div className='d-flex justify-content-center align-items-center pt-5'>
      < SignIn></SignIn>
    </div>
  )
}

export default Signin