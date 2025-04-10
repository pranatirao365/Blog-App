import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import {useClerk,useUser} from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
function Header() {
    const {signOut} = useClerk()
    const {currentUser,setCurrentUser} = useContext(userAuthorContextObj)
    const {isSignedIn , user, isLoaded} = useUser()
    //function to signout
    async function handleSignOut(){
        await signOut(),
        setCurrentUser(null)
        Navigate('/')
    }
  return (
    <div>
        <nav className='header d-flex justify-content-between align-content-center bg-dark pt-3'>
            <div className='d-flex justify-content-center bg-dark pe-4'>
                <img className=' ps-2 mb-3 bg-dark' src="https://www.shareicon.net/download/2015/09/18/103115_blog.svg" alt="" srcset="" width="50px" />
            </div>
            <ul className="d-flex  justify-content-around list-unstyled bg-dark ">
            
            {
                !isSignedIn ?
                <>
                <li className='bg-dark'>
                <Link to = "" className=" link text-light pe-4  bg-dark" >Home</Link>
            </li>
            <li className='bg-dark'>
                <Link to = "signin" className=" link text-light  pe-4 bg-dark">Signin</Link> 
            </li>
            <li className='bg-dark'>
                <Link to = "signup"className=" link text-light pe-4 bg-dark ">Signup</Link>
            </li>
            </>:
            <div className='user-button '>
                <div style={{position:'relative'}} className='bg-dark'>
                    <img src = {user.imageUrl} width= '35px' className='rounded-circle bg-dark' alt=""/>
                    <p className='role ' style= {{position:'absolute',top:'0px',right:'18px'}}>{currentUser.role}</p>
            </div>
            <p className='mb-0 user-name bg-dark' >{user.firstName}</p>
                <button className='btn btn-primary signout-btn' onClick={handleSignOut}>Signout</button>
            </div>
            }
            
            
            </ul>
        </nav>
    </div>
  )
}

export default Header