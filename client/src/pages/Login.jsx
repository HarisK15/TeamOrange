import { useState } from "react"
import axios from 'axios'

export default function Login() {
    const[data,setData] = useState({
        email:'',
        password:'',

    })
    // sends a get request to the root page without the bowser automatically refreshing the page
    const loginUser = (e) => {
        e.preventDefault()
            axios.get('/')
    }
    return (
        <div>
            <form onSubmit={loginUser}>
                <label>Email</label>
                <input type='email' placeholder='enter email address..' value ={data.email} onChange={(e) => setData({...data,email: e.target.value})}></input>
                <label>Password</label>
                <input type='password' placeholder='enter password...' value ={data.password} onChange={(e) => setData({...data,password: e.target.value})}></input>
                <button type='submit'> Login </button>
            </form>
        </div>
    )
}
