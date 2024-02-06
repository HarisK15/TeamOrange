import { useState } from "react";
import axios from 'axios';
import {toast} from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export default function Register() {
    //variable navigate is used to navigate to another page
    const navigate = useNavigate()
    const [data, setData] = useState({
        userName: '',
        email: '',
        password: '',
    })

    //Prevents the page to automatically load
    const registerUser = async (e) => {
        e.preventDefault();
        //passing the data from the form as a post request
        const {userName,email,password} = data
        try {
            const{data} = await axios.post('register',
            {
                userName,email,password
            }
            )
            if(data.error)
            {
                toast.error(data.error)
            }
            else
            {
                setData({})
                toast.success('Login Successful. Welcome!')
                navigate('/login')
            }
        } catch (error) {
            
        }
    }

    return (
        // page to submit and register user, with function registerUser on press of submit button
        <div>
            <form onSubmit={registerUser}>
                <label>User Name</label>
                <input type='text' placeholder='enter user name...' value ={data.userName} onChange={(e) => setData({...data,userName: e.target.value})}></input>
                <label>Email</label>
                <input type='email' placeholder='enter email address..' value ={data.email} onChange={(e) => setData({...data,email: e.target.value})}></input>
                <label>Password</label>
                <input type='password' placeholder='enter password...' value ={data.password} onChange={(e) => setData({...data,password: e.target.value})}></input>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}
