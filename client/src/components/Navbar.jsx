import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        // adds links on the navbar to navigate to each page
        <nav>
            <Link to='/'>Home</Link>
            <Link to='/Register'>Register</Link>
            <Link to='/Login'>Login</Link>
            <Link to='/Clucks'>Clucks</Link>
        </nav>
    )
}
