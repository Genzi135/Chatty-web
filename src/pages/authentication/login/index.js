import { useState } from "react";
import { BASE_URL } from "../../../components/shared/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentUser, setLogin } from "../../../hooks/redux/reducer";

function Login({ state }) {

    const [isShowPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [report, setReport] = useState('');

    const dispatch = useDispatch();

    const handleInputEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleInputPassword = (e) => {
        setPassword(e.target.value)
    }

    const handleLogin = async () => {
        console.log(email);
        console.log(password);
        try {
            const response = await axios({
                url: BASE_URL + "/api/v1/auth/login",
                method: "post",
                data: {
                    email: email,
                    password: password
                }
            })
            if (response.data.status === "success")
                setReport('');
            dispatch(setCurrentUser(response.data.data.user))
            localStorage.setItem("userToken", JSON.stringify(response.data.data.token.access_token))
            dispatch(setLogin())
        } catch (error) {
            console.log(error)
            if (error.response.data.message === 'Bad credentials.') {
                setReport('Phone or password is not correct')
            } else {
                setReport(error.response.data.message)
            }
        }
    }

    

    return (
        <div className="card shadow-2xl p-8">
            <div className="flex flex-col justify-between text-black gap-4">
                <div className="flex justify-center items-center font-medium text-2xl">
                    <h1>LOGIN</h1>
                </div>
                <div className="text-sm">
                    <label>If you do not have any account </label><label className="text-secondary cursor-pointer font-semibold" onClick={() => { state('Register') }}>Sign in</label>
                </div>
                <form className="flex flex-col gap-4 w-80">

                    <div>
                        <label className="text-gray-500">Phone/Email</label>
                        <label className="input input-bordered flex items-center gap-2 bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                            <input type="text" className="grow" placeholder="Email" value={email} onChange={handleInputEmail} />
                        </label>
                    </div>

                    <div>
                        <label className="text-gray-500">Password</label>
                        <label className="input input-bordered flex items-center gap-2 bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                            <input type={isShowPassword ? "text" : "password"} className="grow" placeholder="Password" value={password} onChange={handleInputPassword} />
                        </label>
                        <label className="flex items-center p-1">
                            <input type="checkbox" checked={isShowPassword} onChange={() => setShowPassword(!isShowPassword)} />
                            <span className="text-xs">Show password</span>
                        </label>
                    </div>
                </form>
                <div className="flex justify-center items-center text-red-500">{report}</div>
                <div className="flex justify-center items-center">
                    <button className="btn btn-secondary text-white" onClick={() => { handleLogin() }}>LOGIN</button>
                </div>
            </div>
        </div>
    )
}

export default Login;