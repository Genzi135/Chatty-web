import { useState } from "react";
import Login from "./login";
import Register from "./register";
import ForgotPassword from "./forgotPassword";

function Authentication() {

    const [state, setState] = useState('Login');

    return (
        <div style={{ width: '100vw', height: '100vh' }} className="bg-white flex justify-center items-center">
            {state === 'Login' && <Login state={setState} />}
            {state === 'Register' && <Register state={setState} />}
            {state === 'ForgotPassword' && <ForgotPassword state={setState} />}
        </div>
    )
}

export default Authentication;