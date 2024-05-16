import { useState } from "react";
import { toast } from "react-toastify";
import { handleCheckOTP, handleResetPassword, handleSendOTP } from "../../../components/shared/api";

function ForgotPassword({ state }) {
    const [email, setEmail] = useState('')
    const [OTP, setOTP] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [isDisableChangePass, setDisable] = useState(true)
    const [isDisableOTP, setOTPDisable] = useState(true)

    const handleInputEmail = (e) => {
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

    function handleGetOTP() {
        if (email == "") {
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
                if (response.status == 200) {
                    setDisable(false)
                }
            })
    }

    function handleChangePassword() {
        if (password === confirm) {
            handleResetPassword(email, password)
                .then((response) => {
                    if (response.status == 200) {
                        state('Login')
                    }
                })
        } else {
            toast("Confirm password does not match")
        }
    }

    return (
        <div className="card shadow-2xl p-8">
            <div className="flex flex-col justify-between text-black gap-4">
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
                    <button className="btn btn-secondary text-white" onClick={() => {handleGetOTP()}}>Send OTP</button>
                    <div>
                        <label className="text-gray-500">OTP</label>
                        <label className="input input-bordered flex items-center gap-2 bg-white">
                            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg> */}
                            <input type="text" className={`grow ${isDisableOTP && 'input-disabled'}`} placeholder="OTP" disabled={isDisableOTP} onChange={handleSetOTP} />
                        </label>
                    </div>
                    <button className="btn btn-secondary text-white" onClick={() => {handleVerifyOTP()}}>Verify OTP</button>
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
                    <button className="btn btn-secondary text-white" onClick={() => {handleChangePassword()}}>Change</button>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword;