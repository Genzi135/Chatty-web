import { useState } from "react";
import InputDate from "../../../components/common/InputDate";
import {handleCheckOTP, handleLogin, handleRegisterAPI, handleSearchFriendAPI, handleSendOTP} from '../../../components/shared/api';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { checkRegex } from "../../../helpers/regex";

function Register({ state }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [userName, setUserName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [report, setReport] = useState('');
    const [isShowPassword, setShowPassword] = useState(false);
    const [OTP, setOTP] = useState('')

    const [OTPDisable, setOTPDisable] = useState(true)
    const [registerDisable, setRegisterDisable] = useState(true)

    const onEmailChange = (e) => setEmail(e.target.value);
    const onPasswordChange = (e) => setPassword(e.target.value);
    const onConfirmChange = (e) => setConfirm(e.target.value);
    const onUserNameChange = (e) => setUserName(e.target.value);
    const onGenderChange = (e) => setGender(e.target.value);
    const onOTPChange = (e) => setOTP(e.target.value);
    
    const dispatch = useDispatch();

    function getOTP() {
        if (!checkRegex(email, 'email')) {
            setReport("Incorrect email")
            return
        }
        handleSearchFriendAPI(email)
            .then(response => {
                console.log(response)
                if (response.status == 200) {
                    setReport("Email had been registered")
                }
                else if (email == '') {
                    setReport("Email cannot be empty")
                } else {
                    handleSendOTP(email)
                    setOTPDisable(false)
                }
            })
    }

    function callTimeOut() {
        setTimeout(() => {
            setOTPDisable(true)
        }, 60000)
    }

    const verifyOTP = () => {
        handleCheckOTP(email, OTP)
            .then(response => {
                if (response.status == 200) {
                    setRegisterDisable(false)
                    setOTPDisable(true)
                } else {
                    setReport("Incorrect OTP")
                }
            })
    }

    const handleRegister = () => {
        if (password !== confirm) {
            setReport('Passwords do not match');
            return;
        }

        if (!email || !password || !confirm || !userName || !gender || !dob) {
            setReport('Please fill in all fields');
            return;
        }

        handleRegisterAPI(email, password, userName, gender, dob)
            .then(response => {
                if (response.status == 200) {
                    toast("Register successfully")
                } else toast("Register failed")
            })
        handleLogin(email, password, dispatch);

        setEmail('')
        setPassword('')
        setConfirm('')
        setUserName('')
        setGender('')
        setDob('')
        setRegisterDisable(true)
        setOTPDisable(true)

        clearTimeout(callTimeOut)
    };

    return (
        <div className="card shadow-2xl p-8">
            <div className="flex flex-col text-black justify-between gap-4">
                <div className="flex justify-center items-center font-medium text-2xl">
                    <h1>REGISTER</h1>
                </div>
                <div className="text-sm">
                    <label>If you have an account  </label>
                    <label className="text-secondary cursor-pointer font-semibold" onClick={() => state('Login')}>Login</label>
                </div>
                <div className="flex flex-col w-80 gap-2 text-base">
                    <div>
                        <label className="text-gray-500">Email</label>
                        <input type="email" placeholder="Email" value={email} onChange={onEmailChange} className="input input-bordered w-full bg-white" />
                    </div>
                    <div className="flex justify-center items-center">
                    <button className="btn btn-secondary text-white" onClick={() => getOTP()}>
                        SEND OTP
                    </button>
                </div>
                    <div>
                        <label className="text-gray-500">OTP</label>
                        <input type="text" placeholder="OTP" disabled={OTPDisable} value={OTP} onChange={onOTPChange} className="input input-bordered w-full bg-white" />
                    </div>
                    <button className="btn btn-secondary text-white" disabled={OTPDisable} onClick={verifyOTP}>
                        VERIFY OTP
                    </button>
                    <div>
                        <label className="text-gray-500">Password</label>
                        <input type={isShowPassword ? "text" : "password"} disabled={registerDisable} placeholder="Password" value={password} onChange={onPasswordChange} className="input input-bordered w-full bg-white" />
                    </div>
                    <div>
                        <label className="text-gray-500">Confirm password</label>
                        <input type={isShowPassword ? "text" : "password"} disabled={registerDisable} placeholder="Confirm password" value={confirm} onChange={onConfirmChange} className="input input-bordered w-full bg-white" />
                        <label className="flex items-center p-1">
                            <input type="checkbox" checked={isShowPassword} onClick={() => setShowPassword(!isShowPassword)} />
                            <span className="text-xs">Show password</span>
                        </label>
                    </div>
                    <div>
                        <label className="text-gray-500">Name</label>
                        <input type="text" placeholder="User name" value={userName} disabled={registerDisable} onChange={onUserNameChange} className="input input-bordered w-full bg-white" />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-gray-500">
                        <div className="flex items-center gap-2">
                            <label>Male</label>
                            <input type="radio" name="gender" disabled={registerDisable} className="radio radio-secondary radio-sm" value="male" checked={gender === 'male'} onChange={onGenderChange} />
                        </div>
                        <div className="flex items-center gap-2">
                            <label>Female</label>
                            <input type="radio" name="gender" disabled={registerDisable} className="radio radio-secondary radio-sm" value="female" checked={gender === 'female'} onChange={onGenderChange} />
                        </div>
                    </div>
                    <div>
                        <InputDate setDob={setDob} />
                    </div>
                </div>
                {report && <div className="text-red-500">{report}</div>}

                <div className="flex justify-center items-center">
                    <button className="btn btn-secondary text-white" onClick={handleRegister}>
                        REGISTER
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;
