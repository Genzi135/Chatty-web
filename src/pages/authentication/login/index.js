import { useState } from "react";
import { BASE_URL, handleCheckOTP, handleLogin, handleResetPassword, handleSendOTP } from "../../../components/shared/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCurrentUser, setLogin } from "../../../hooks/redux/reducer";
import { toast } from "react-toastify";
import { checkRegex } from "../../../helpers/regex";

function Login({ state }) {
    const [viewState, setViewState] = useState('LOGIN');
    const [isShowPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [report, setReport] = useState('');
    const [change, setChange] = useState(true)

    const dispatch = useDispatch();

    const handleInputEmail = (e) => {
        setEmail(e.target.value)
    }

    const handleInputPassword = (e) => {
        setPassword(e.target.value)
    }

    const [OTP, setOTP] = useState('')
    const [confirm, setConfirm] = useState('')
    const [isDisableChangePass, setDisable] = useState(true)
    const [isDisableOTP, setOTPDisable] = useState(true)

    const handleInputEmailf = (e) => {
        setEmail(e.target.value)
    }

    const handleSetOTP = (e) => {
        setOTP(e.target.value)
    }

    const handleSetPassword = (e) => {
        setPassword(e.target.value)
    }

    const handleSetConfirm = (e) => {
        setConfirm(e.target.value)
    }

    function checkEmail() {
        if (email === "") {
            setReport("Email can not be empty")
        }
        else {
            setReport("")
            setViewState('FORGOT')
        }
    }

    function handleGetOTP() {
        if (email === "") {
            toast("Email can not be empty")
            return
        } else {
            handleSendOTP(email)
            setOTPDisable(false)
        }
    }

    function handleVerifyOTP() {
        handleCheckOTP(email, OTP)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    setDisable(false)
                    setOTPDisable(true)
                    setChange(false)
                    setReport("")
                    setOTP("")
                }
                else {
                    setReport("Incorrect OTP")
                    setOTP("")
                }
            })
    }

    function handleChangePassword() {
        if (password === confirm) {
            handleResetPassword(email, password)
                .then((response) => {
                    if (response.status == 200) {
                        document.getElementById("sendOTP").disabled = false
                        setViewState('LOGIN')
                        setChange(true)
                        setOTPDisable(true)
                        setPassword("")
                        setEmail("")
                        setReport("")
                        clearTimeout(callTimeOut)
                    }
                })
        } else {
            setReport("Confirm password does not match")
        }
    }

    function handleOTP() {
        handleGetOTP()
        document.getElementById("sendOTP").disabled = true;
        callTimeOut()
    }

    const callTimeOut = () => {
        setTimeout(() => {
            document.getElementById("sendOTP").disabled = false
        }, 60000)
    }

    function login() {
        if (!checkRegex(email, 'email')) {
            setReport('Incorrect email')
            return
        }
        else if (!checkRegex(password, 'password')) {
            setReport('Password need at least 8 characters')
            return
        }   
        handleLogin(email, password, dispatch)
            .then(response => {
                if (response.status != 200) {
                    setReport("Incorrect email or password")
                } else {
                    setReport("")
                }
            }) 
        }

    const keyPressed = (e) => {
        if (e.key === 'Enter')
            login()
    }

    return (
        <div className="card shadow-2xl p-8">
            {viewState === 'LOGIN' && <div className="flex flex-col justify-between text-black gap-4">
                <div className="flex justify-center items-center font-medium text-2xl">
                    <h1>LOGIN</h1>
                </div>
                <div className="text-sm">
                    <label>If you do not have any account </label><label className="text-secondary cursor-pointer font-semibold" onClick={() => { state('Register') }}>Sign up</label>
                </div>
                <form className="flex flex-col gap-4 w-80">

                    <div>
                        <label className="text-gray-500">Email</label>
                        <label className="input input-bordered flex items-center gap-2 bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                            <input type="text" className="grow" placeholder="Email" value={email} onChange={handleInputEmail} onKeyDown={keyPressed} />
                        </label>
                    </div>

                    <div>
                        <label className="text-gray-500">Password</label>
                        <label className="input input-bordered flex items-center gap-2 bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                            <input type={isShowPassword ? "text" : "password"} className="grow" placeholder="Password" value={password} onChange={handleInputPassword} onKeyDown={keyPressed} />
                        </label>
                        <label className="flex items-center p-1">
                            <input type="checkbox" checked={isShowPassword} onChange={() => setShowPassword(!isShowPassword)} />
                            <span className="text-xs">Show password</span>
                        </label>
                    </div>
                </form>
                <div className="flex justify-center items-center text-red-500">{report}</div>
                <div className="flex justify-center items-center font-medium">
                    <label className="text-secondary cursor-pointer" onClick={() => { checkEmail() }}>Forgot password ?</label>
                </div>
                <div className="flex justify-center items-center">
                    <button className="btn btn-secondary text-white" onClick={() => { login() }}>LOGIN</button>
                </div>
            </div>}




            {viewState === 'FORGOT' && <div className="flex flex-col justify-between text-black gap-4">
                <label>Back to <label className="text-secondary font-semibold cursor-pointer" onClick={() => setViewState('LOGIN')}>Login</label></label>
                <div className="flex justify-center items-center font-medium text-2xl">
                    <h1>FORGOT PASSWORD</h1>
                </div>
                <div className="flex flex-col gap-4 w-80">
                    <div>
                        <label className="text-gray-500">Email</label>
                        <label className="input input-bordered flex items-center gap-2 bg-white">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
                            <input type="text" className="grow" placeholder="Email" value={email} onChange={handleInputEmail} />
                        </label>
                    </div>
                    <button className="btn btn-secondary text-white" id="sendOTP" onClick={() => { handleOTP() }}>Send OTP</button>
                    <div>
                        <label className="text-gray-500">OTP</label>
                        <label className="input input-bordered flex items-center gap-2 bg-white">
                            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg> */}
                            <input type="text" className={`grow ${isDisableOTP && 'input-disabled'}`} placeholder="OTP" disabled={isDisableOTP} onChange={handleSetOTP} />
                        </label>
                    </div>
                    <button className="btn btn-secondary text-white" id="verifyOTP" value={OTP} disabled={isDisableOTP} onClick={() => handleVerifyOTP() }>Verify OTP</button>
                    <div>
                        <label className="text-gray-500">Password</label>
                        <label className="input input-bordered flex items-center gap-2 bg-white">
                            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg> */}
                            <input type="password" className={`grow ${isDisableChangePass && 'input-disabled'}`} placeholder="Password" disabled={isDisableChangePass} onChange={handleSetPassword} />
                        </label>
                        <label className="text-gray-500">Confirm password</label>
                        <label className="input input-bordered flex items-center gap-2 bg-white">
                            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg> */}
                            <input type="password" className={`grow ${isDisableChangePass && 'input-disabled'}`} placeholder="Confirm password" disabled={isDisableChangePass} onChange={handleSetConfirm} />
                        </label>
                    </div>
                    <div className="flex justify-center items-center text-red-500">{report}</div>
                    <button className="btn btn-secondary text-white" disabled={change} onClick={() => { handleChangePassword() }}>Change</button>
                </div>
            </div>}
        </div>
    )
}

export default Login;