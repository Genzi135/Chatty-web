/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import HeaderModal from "../../../../components/common/HeaderModal";
import ConversationSkeleton from "../../../../components/common/ConversationSkeleton";
import CustomButton from "../../../../components/common/CustomButton";
import { handleCancelFriendRequest, handleRejectFriendRequest, handleSearchFriendAPI, handleSearchFriendID, handleSendFriendRequest } from "../../../../components/shared/api";
import AddFriendCard from "../../../../components/common/AddFriendCard";
import { useSocket } from "../../../../hooks/context/socket";
import { checkRegex } from "../../../../helpers/regex";

export default function AddFriendModal({ onClose }) {
    const [option, setOption] = useState('');
    const [email, setEmail] = useState('');
    const [dataSource, setDataSource] = useState(null)
    const [value, setValue] = useState('')
    const [report, setReport] = useState('')
    const [request, setRequest] = useState({})

    const { socket } = useSocket()

    const setInputEmail = (e) => {
        setEmail(e.target.value)
    }

    useEffect(() => {
        if (option === 'cancel') {
            setOption('')
            onClose('addFriendModal');
        }
    }, [option])

    function searchFriend() {
        if (!email) {
            setReport("Email cannot be empty")
            return;
        }
        else if (!checkRegex(email, 'email')) {
            setReport("Incorrect email")
            return
        }
        handleSearchFriendAPI(email)
            .then((response) => {
                if (response.status === 200) {
                    handleSearchFriendID(response.data.data._id)
                        .then(response => {
                            setDataSource(response.data.data)
                            setRequest(response.data.data.friend)
                            setReport('')
                        })
                        .then(() => {
                        })
                }
                else {
                    setReport("User not found")
                }
            })
    }

    useEffect(() => {
        if (value === 'cancel') {
            handleCancelFriendRequest(request._id)
                .then(() => { searchFriend(); })
        } else if (value === 'confirm') {
            handleSendFriendRequest(dataSource._id)
                .then((response) => {
                    searchFriend()
                    setRequest(response.data.data)
                })
        }
        setValue('')
    }, [value])

    return (
        <div className="flex flex-col justify-between bg-white p-5 w-96 rounded-xl">
            <HeaderModal name={"Add friend"} />
            <div className="w-60 h-10 bg-pink-100 input input-bordered flex items-center gap-2">
                <div><input type="text" className="w-60" placeholder="Search" onChange={setInputEmail} /></div>
                <div onClick={() => searchFriend()}><CustomButton name={"Search"} /></div>
            </div>
            <div>
                {dataSource ? (
                    <div>
                        <AddFriendCard props={dataSource} value={setValue} />
                    </div>
                ) : (
                    <div className="mt-5">
                        {/* <ConversationSkeleton /> */}
                    </div>
                )}
            </div>
            <span className="text-sm text-error">{report}</span>
            <Button value={setOption} />
        </div>
    )
}