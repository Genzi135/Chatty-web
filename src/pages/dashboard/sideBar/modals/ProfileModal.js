/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import HeaderModal from "../../../../components/common/HeaderModal";
import icons from "../../../../components/shared/icon";
import Button from "../../../../components/common/Button";
import InputDate from "../../../../components/common/InputDate";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../../../../helpers/formatDate";
import { checkLogin, handleGetMe, handleUpdateAvatar, handleUpdateProfile, handleChangePassword } from "../../../../components/shared/api";
import { setCurrentUser } from "../../../../hooks/redux/reducer";
import { toast } from "react-toastify";
import { checkRegex } from "../../../../helpers/regex";

export default function ProfileModal() {

    const [viewStateProfile, setViewStateProfile] = useState('profile');
    const [option, setOption] = useState('');
    const [userName, setUserName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    //avatar
    const [avatar, setAvatar] = useState(null);
    const [displayAvatar, setDisplayAvatar] = useState(null);
    //changePassword
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isDisableChangePass, setDisableChangePass] = useState(true)
    //current User data
    const userData = useSelector((state) => state.currentUser);

    const [report, setReport] = useState('')

    const onUserNameChange = (e) => setUserName(e.target.value);
    const onGenderChange = (e) => setGender(e.target.value);

    const dispatch = useDispatch()

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setDisplayAvatar(URL.createObjectURL(file));
        }
    };

    function onPasswordChange(e) {
        setPassword(e.target.value)
    }
    function onNewPasswordChange(e) {
        setNewPassword(e.target.value)
    }
    function onConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value)
    }

    function handlePasswordChange() {
        if (!password || !confirmPassword) {
            setReport("Please fill all field")
            return
        }

        if (!checkRegex(newPassword, "password")) {
            setReport("Password need to have at least 8 characters")
            return
        }

        if (newPassword === confirmPassword) {
            handleChangePassword(password, newPassword)
                .then(response => {
                    if (response.status === 200) {
                        toast("Password change successfully")
                        setReport("")
                        setDisableChangePass(true)
                    }
                    else {toast("Password change failed"); setDisableChangePass(true)}
                    setViewStateProfile('profile')
                })
            return
        } else setReport("New password does not match")
    }

    function checkOldPassword() {
        checkLogin(userData.email, password)
            .then(response => {
                if (response.status === 200)
                    setDisableChangePass(false)
                else {setDisableChangePass(true); setReport("Incorrect password")}
            })
    }

    function handleChangeAvatar() {
        handleUpdateAvatar(userData._id, avatar)
            .then(response => {
                if (response.status === 200) {
                    toast("Change avatar successfully")
                    handleGetMe().then(response => dispatch(setCurrentUser(response.data.data)))
                }
                else { toast("Change avatar failed") }
                setViewStateProfile('profile')
            })
    }

    useEffect(() => {
        if (option === 'cancel') {
            setViewStateProfile('profile')
            setOption('')
            setReport('')
        } else if (option === 'confirm') {
            if (!userName || !gender || !dob) {
                setReport("Please fill all field")
                return
            }
            handleUpdateProfile(userName, gender, dob)
                .then((response) => { 
                    if (response.status === 200) toast("Change profile successfully"); 
                    else { toast("Change profile failed"); return }
                })
                .then(() => {
                    handleGetMe().then((response) => { dispatch(setCurrentUser(response.data.data)) })
                })
            setViewStateProfile("profile")
            setOption('')
        }
    }, [option])

    useEffect(() => {
        setViewStateProfile('profile')
    }, [])

    return (
        <div className="flex flex-col w-96 bg-white rounded-lg p-5">
            <HeaderModal name={'Profile'} />
            {viewStateProfile === 'profile' && <div>
                <div className="relative w-full h-40 mb-5">
                    <div className="w-full h-36">
                        <img src={userData.background} alt="bg-img" />
                    </div>
                    <div className="flex flex-row justify-center items-center w-full">
                        <div className="avatar absolute bottom-0 left-3 flex justify-center items-center tooltip" data-tip="Click to change avatar"
                            onClick={() => { setViewStateProfile('changeAvatar') }}>
                            <div className="avatar rounded-full w-16 bg-black ">
                                <img src={userData.avatar} alt="avatar" />
                            </div>
                        </div>
                        <div className="flex justify-center items-center gap-1 p-1 text-xl">
                            <label>{userData.name}</label>
                            <div
                                onClick={() => { setViewStateProfile('updateProfile') }}
                                className="flex justify-center items-center hover:bg-gray-200 rounded-full p-2">
                                {icons.pencilSquare}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                    <label className="font-bold">Personal information</label>
                    <div className="flex justify-start items-center gap-2">
                        <div className="flex flex-col gap-2">
                            <label>Gender</label>
                            <label>Birthday</label>
                            <label>Email</label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>{userData.gender}</label>
                            <label>{formatDate(userData.dateOfBirth)}</label>
                            <label>{userData.email}</label>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center text-secondary font-semibold p-3 mt-2">
                    <label className="cursor-pointer" onClick={() => setViewStateProfile('changePassword')}>Change password</label>
                </div>
            </div>}
            {viewStateProfile === 'updateProfile' && <div>
                <div className="flex flex-col gap-2">
                    <div>
                        <label>Name</label>
                        <input type="text" value={userName} onChange={onUserNameChange} className="input input-bordered w-full bg-white" />
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
                        <label>Birthday</label>
                        <InputDate setDob={setDob} />
                    </div>
                </div>
                {report && <div className="text-red-500 whitespace-pre-wrap break-words w-80">{report}</div>}
                <Button value={setOption} />
            </div>}
            {viewStateProfile === 'changeAvatar' && <div>
                <div className="flex flex-col gap-2">
                    <input
                        type="file"
                        className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
                        accept="image/png, image/gif, image/jpeg"
                        onChange={(e) => { handleFileChange(e) }}
                    // value={avatar.name}
                    />
                </div>
                <div>
                    {displayAvatar && <div className="flex flex-col justify-center items-center p-2 gap-2">
                        <div className="avatar">
                            <div className="w-24 rounded-full">
                                <img src={displayAvatar} alt="avatar" />
                            </div>
                            <label className="rounded-full bg-gray-200 hover:bg-gray-400 w-8 h-8 flex justify-center items-center"
                                onClick={() => { setAvatar(null); setDisplayAvatar(null) }}
                            >{icons.xClose}</label>
                        </div>

                    </div>}
                </div>
                <div className="flex justify-end items-center mt-2 gap-2">
                    <button className="btn btn-outline" onClick={() => { setAvatar(null); setDisplayAvatar(null); setViewStateProfile('profile') }}>Cancel</button>
                    <button className="btn btn-secondary" onClick={() => { handleChangeAvatar() }}>Confirm</button>
                </div>
            </div>}
            {viewStateProfile === "changePassword" && <div className="w-full">
                <div className="flex flex-col justify-between  gap-2">
                    <label>Old password</label>
                    <input type="password" placeholder="Enter old password" className="input input-bordered input-secondary w-full "
                        onChange={(e) => { onPasswordChange(e) }}
                    />
                    <button className="btn btn-secondary" onClick={() => { checkOldPassword() }}>Check</button>
                </div>
                <div className="flex flex-col justify-between gap-2 mt-2">
                    <label>New password</label>
                    <input type="password" placeholder="Enter new password" className={`input input-bordered input-secondary w-full ${isDisableChangePass && 'input-disabled'}`}
                        onChange={(e) => { onNewPasswordChange(e) }}
                        disabled={isDisableChangePass}
                    />
                </div>
                <div className="flex flex-col justify-between  gap-2 mt-2">
                    <label>Confirm password</label>
                    <input type="password" placeholder="Confirm password" className={`input input-bordered input-secondary w-full  ${isDisableChangePass && 'input-disabled'}`}
                        onChange={(e) => { onConfirmPasswordChange(e) }}
                        disabled={isDisableChangePass}
                    />
                </div>
                {report && <div className="text-red-500 whitespace-pre-wrap break-words w-80">{report}</div>}
                <div className="flex justify-end items-center mt-2 gap-2">
                    <button className="btn btn-outline" onClick={() => { setPassword(''); setNewPassword(''); setConfirmPassword(''); setViewStateProfile('profile') }}>Cancel</button>
                    <button className="btn btn-secondary" onClick={() => { handlePasswordChange() }}>Confirm</button>
                </div>
            </div>}
        </div>
    )
}