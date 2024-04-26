import { useState } from "react";
import InputDate from "../../../components/common/InputDate";
import {handleLogin, handleRegisterAPI} from '../../../components/shared/api';
import { useDispatch } from "react-redux";

function Register({ state }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [userName, setUserName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    const [report, setReport] = useState('');
    const [isShowPassword, setShowPassword] = useState(false);

    const onEmailChange = (e) => setEmail(e.target.value);
    const onPasswordChange = (e) => setPassword(e.target.value);
    const onConfirmChange = (e) => setConfirm(e.target.value);
    const onUserNameChange = (e) => setUserName(e.target.value);
    const onGenderChange = (e) => setGender(e.target.value);
    
    const dispatch = useDispatch();

    const handleRegister = () => {
        if (password !== confirm) {
            setReport('Passwords do not match');
            return;
        }

        if (!email || !password || !confirm || !userName || !gender || !dob) {
            setReport('Please fill in all fields');
            return;
        }

        handleRegisterAPI (email, password, userName, gender, dob);
        handleLogin(email, password, dispatch);

        setEmail('')
        setPassword('')
        setConfirm('')
        setUserName('')
        setGender('')
        setDob('')
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
                <form className="flex flex-col w-80 gap-2 text-base">
                    <div>
                        <label className="text-gray-500">Email</label>
                        <input type="email" placeholder="Email" value={email} onChange={onEmailChange} className="input input-bordered w-full bg-white" />
                    </div>
                    <div>
                        <label className="text-gray-500">Password</label>
                        <input type={isShowPassword ? "text" : "password"} placeholder="Password" value={password} onChange={onPasswordChange} className="input input-bordered w-full bg-white" />
                    </div>
                    <div>
                        <label className="text-gray-500">Confirm password</label>
                        <input type={isShowPassword ? "text" : "password"} placeholder="Confirm password" value={confirm} onChange={onConfirmChange} className="input input-bordered w-full bg-white" />
                        <label className="flex items-center p-1">
                            <input type="checkbox" checked={isShowPassword} onClick={() => setShowPassword(!isShowPassword)} />
                            <span className="text-xs">Show password</span>
                        </label>
                    </div>
                    <div>
                        <label className="text-gray-500">Name</label>
                        <input type="text" placeholder="User name" value={userName} onChange={onUserNameChange} className="input input-bordered w-full bg-white" />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-gray-500">
                        <div className="flex items-center gap-2">
                            <label>Male</label>
                            <input type="radio" name="gender" className="radio radio-secondary radio-sm" value="male" checked={gender === 'male'} onChange={onGenderChange} />
                        </div>
                        <div className="flex items-center gap-2">
                            <label>Female</label>
                            <input type="radio" name="gender" className="radio radio-secondary radio-sm" value="female" checked={gender === 'female'} onChange={onGenderChange} />
                        </div>
                    </div>
                    <div>
                        <InputDate setDob={setDob} />
                    </div>
                </form>
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
