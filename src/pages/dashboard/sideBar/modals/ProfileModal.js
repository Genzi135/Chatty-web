import { useEffect, useState } from "react";
import HeaderModal from "../../../../components/common/HeaderModal";
import icons from "../../../../components/shared/icon";
import Button from "../../../../components/common/Button";
import InputDate from "../../../../components/common/InputDate";
import { useSelector } from "react-redux";
import { formatDate } from "../../../../helpers/formatDate";

export default function ProfileModal() {

    const [viewStateProfile, setViewStateProfile] = useState('profile');
    const [option, setOption] = useState('');
    const [userName, setUserName] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');

    const userData = useSelector((state) => state.currentUser);

    const onUserNameChange = (e) => setUserName(e.target.value);
    const onGenderChange = (e) => setGender(e.target.value);

    useEffect(() => {
        if (option === 'cancel') {
            setViewStateProfile('profile')
            setOption('')
        } else if (option === 'confirm') {
            console.log(userName, gender, dob);
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
                        <div className="avatar absolute bottom-0 left-3 flex justify-center items-center tooltip" data-tip="Click to change avatar">
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
                            <label>Phone number</label>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label>{userData.gender}</label>
                            <label>{formatDate(userData.dateOfBirth)}</label>
                            <label>{userData.phone}</label>
                        </div>
                    </div>
                </div>
                <div className="w-full flex justify-center items-center text-secondary font-semibold p-3 mt-2">
                    <label className="cursor-pointer">Change password</label>
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
                <Button value={setOption} />
            </div>}
        </div>
    )
}