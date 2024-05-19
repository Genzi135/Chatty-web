import { useDispatch, useSelector } from "react-redux"
import Avatar from "../../../components/common/Avatar";
import icons from "../../../components/shared/icon";
import HeaderModal from "../../../components/common/HeaderModal";
import { getConversationById, getListConversation, handleAddMember, handleChangeGroupAvatar, handleChangeGroupName, handleDisbandGroup, handleGetFriendList, handleGetGroupList, handleLeaveGroup, handleRemoveFriend, handleRemoveMemeber, handleSearchFriendID, handleSendFile, handleSendFriendRequest, handleTransferGroupLeader, handleUpdateGroupAvatar } from "../../../components/shared/api";
import { useEffect, useState } from "react";
import FriendCard from "../../../components/common/FriendCard";
import { setCurrentConversation, setListConversation, setSelectedUser } from "../../../hooks/redux/reducer";
import ConversationSkeleton from "../../../components/common/ConversationSkeleton";
import { current } from "@reduxjs/toolkit";
import Chatty from "../../../components/common/Chatty";
import ConversationCard from "../../../components/common/ConversationCard";
import { formatDate } from "../../../helpers/formatDate";
import { toast } from "react-toastify";
import CustomButton from "../../../components/common/CustomButton";
import { useSocket } from "../../../hooks/context/socket";

export default function ConversationDrawer() {
    const currentConversation = useSelector(state => state.currentConversation)
    const currentUser = useSelector(state => state.currentUser);
    const listConversation = useSelector(state => state.listConversation);
    const [dataSource, setDataSource] = useState([])
    const [isRefresh, setRefresh] = useState(false);
    const [addMemberList, setAddMemberList] = useState([])
    const [selectedList, setSelectedAddList] = useState([])
    const [removeList, setRemoveList] = useState([])
    const [groupList, setGroupList] = useState([])
    const [groupSelect, setGroupSelect] = useState([])
    const [userSelected, setUserSelected] = useState(null);
    const [dataUserSelected, setDataUserSelected] = useState(null)
    const [newLeaderSelected, setNewLeaderSelected] = useState(null);
    const [disableConfirm, setDisableConfirm] = useState(true);
    const [isShowChangeName, setShowChangeName] = useState(false);
    const [newName, setNewName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [displayAvatar, setDisplayAvatar] = useState(null);
    const [memberList, setMemberList] = useState([])

    const [search, setSearch] = useState('')
    const [isFriend, setIsFriend] = useState(false)

    const { socket } = useSocket()

    const setInputSearch = (e) => {
        setSearch(e.target.value)
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setDisplayAvatar(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (currentConversation.type == 'group') {
            setIsFriend(true)
            return
        }
        else if (Object.keys(currentConversation) == 0) {
            return
        }
        handleGetFriendList()
            .then((response) => {
                let found = false;
                response.data.data.map(friend => {
                    if (friend.userId === currentConversation.members[1]._id) {
                        found = true
                        return
                    }
                })
                if (found) {
                    setIsFriend(true)
                }
                else
                    setIsFriend(false)
            })
    }, [currentConversation])

    const onNewNameChange = (e) => { setNewName(e.target.value) };

    const handleChangeGroupNamed = () => {
        handleChangeGroupName(currentConversation, currentUser.name, currentUser._id, newName).then((response) => {
            setShowChangeName(false);
            getConversationById(currentConversation._id)
                .then((response) => {
                    dispatch(setCurrentConversation(response))
                    const newList = listConversation.map((e) => {
                        if (e._id === response._id) {
                            return response
                        }
                        return e
                    })
                    dispatch(setListConversation(newList))
                })
        })
    }

    useEffect(() => { userSelected && handleSearchFriendID(userSelected._id).then((response) => { setDataUserSelected(response.data.data) }) }, [userSelected])

    const dispatch = useDispatch()

    useEffect(() => {
        if (currentConversation.type == 'group') {
            setIsFriend(true)
            return
        }
        else if (Object.keys(currentConversation) == 0) {
            return
        }
        handleGetFriendList()
            .then((response) => {
                let found = false;
                let Ids = currentConversation.members.map(e => e._id)
                if (response.data.data.some(friend => Ids.includes(friend.userId))) {
                    setIsFriend(true);
                } else {
                    setIsFriend(false);
                }
            })
    }, [currentConversation])

    useEffect(() => {
        setMemberList(currentConversation.members)
    }, [currentConversation])

    const onSelectedClick = (e) => {
        if (selectedList.includes(e)) return
        setSelectedAddList([...selectedList, e]);
    }

    const onRemoveSelectedClick = (e) => {
        if (removeList.includes(e)) return
        setRemoveList([...removeList, e]);
    }

    const onGroupSelectedClick = (e) => {
        if (groupSelect.includes(e)) return
        setGroupSelect([...groupSelect, e]);
    }

    const removeFromSelected = (e) => {
        const removeItem = e;
        const newSelectedList = selectedList.filter(el => el !== e);
        setSelectedAddList(newSelectedList);
    }

    const removeFromRemove = (e) => {
        const removeItem = e;
        const newSelectedList = removeList.filter(el => el !== e);
        setRemoveList(newSelectedList);
    }

    const removeFromGroup = (e) => {
        const removeItem = e;
        const newSelectedList = groupList.filter(el => el !== e);
        setGroupSelect(newSelectedList);
    }

    const check = () => {

        const currentUserID = currentUser._id;

        const differentObjects = [];

        dataSource.forEach(friend => {
            if (friend.userId !== currentUserID && !currentConversation.members.some(member => member._id === friend.userId)) {
                differentObjects.push(friend);
            }
        });

        // Lọc ra các đối tượng khác nhau từ currentConversation.members
        // currentConversation.members.forEach(member => {
        //     if (member._id !== currentUserID && !dataSource.some(friend => friend.userId === member._id)) {
        //         differentObjects.push(member);
        //     }
        // });

        setAddMemberList(differentObjects)
    };

    function handleAddGroup() {
        groupSelect.map(group => {
            handleAddMember(group, currentUser._id, currentConversation.members[1])
        })
        setGroupSelect([])
    }

    useEffect(() => { check() }, [dataSource, currentConversation.members])

    // console.log(currentConversation)

    useEffect(() => {
        handleGetFriendList().then(response => setDataSource(response.data.data))
    }, [])

    const confirmDisbandGroup = () => {
        handleDisbandGroup(currentConversation, currentUser._id)
            .then((response) => {
                dispatch(setCurrentConversation({}))
                getListConversation(dispatch)
            })
            .catch((err) => console.log(err))
    }

    function handleChangeLeaderAndLeave() {
        handleTransferGroupLeader(currentConversation, newLeaderSelected._id, currentUser._id)
            .then(() => {
                handleLeaveGroup(currentConversation, currentUser._id)
                    .then(() => {
                        document.getElementById("leaveGroup").close()
                        dispatch(setCurrentConversation({}))
                        getListConversation(dispatch)
                    })
            })
    }

    const confirmLeaveGroup = () => {
        if (currentConversation.leaders.map(leader =>
            leader._id === currentUser._id
        )) {
            const newList = currentConversation.leaders.flatMap(leader => {
                return currentConversation.members.filter(member =>
                    member._id !== leader._id
                );
            });
            handleTransferGroupLeader(currentConversation, newList[0]._id, currentUser._id)
                .then(() => {
                    handleLeaveGroup(currentConversation, currentUser._id)
                        .then(() => {
                            document.getElementById("leaveGroup").close()
                            dispatch(setCurrentConversation({}))
                            getListConversation(dispatch)
                        })
                })
                .catch(err => console.log(err))
        }
        else {
            handleLeaveGroup(currentConversation, currentUser._id)
                .then(() => {
                    document.getElementById("leaveGroup").close()

                    dispatch(setCurrentConversation({}))
                    getListConversation(dispatch)
                })
                .catch(err => console.log(err))
        }
    }

    const openModal = (memberId) => {
        document.getElementById('changeLeader').showModal()
        document.getElementById("transferLeaderConfirm").addEventListener("click", () => {
            handleTransferGroupLeader(currentConversation, memberId, currentUser._id)
            document.getElementById('changeLeader').close()
        })
    }

    const openAddMemberModal = () => {
        document.getElementById("addToGroup").showModal()
    }

    const addMember = () => {
        handleAddMember(currentConversation, currentUser._id, selectedList)
            .then((response) => {
                console.log(response);
            })
        document.getElementById("addToGroup").close()
        setSelectedAddList([])
    }

    const openRemoveMemberModal = () => {
        document.getElementById("removeFromGroup").showModal()
    }

    const confirmRemove = () => {
        handleRemoveMemeber(currentConversation, currentUser._id, removeList)
            .then(() => {
                getConversationById(currentConversation._id)
                    .then(response => {
                        const newList = listConversation.map((e) => {
                            if (e._id === response._id) {
                                return { ...e, members: response.members }
                            }
                            return e
                        })
                        dispatch(setListConversation(newList))
                        dispatch(setCurrentConversation(response))
                    })
            })
        document.getElementById("removeFromGroup").close()
        setRemoveList([])
    }

    function searchGroup() {
        if (search == "") {
            handleGetGroupList()
                .then(response => {
                    let newList = []
                    response.data.data.map(group => {
                        let found = false
                        group.members.map(member => {
                            if (member._id === currentConversation.members[1]._id) {
                                found = true
                            }
                        })
                        if (!found) newList = [...newList, group]
                    })
                    setGroupList(newList)
                })
        }
        let found = []
        groupList.map(group => {
            if (group.name.includes(search))
                found.push(group)
        })
        setGroupList(found)
        setSearch("")
        document.getElementById('searchGroup').value = ""
    }

    function searchFriend() {
        if (search === '') {
            check()
            return
        }
        let found = []
        addMemberList.map(member => {
            if (member.name.includes(search))
                found.push(member)
        })
        setAddMemberList(found)
        setSearch("")
        document.getElementById("searchFriend").value = ""
    }

    function searchMember() {
        let found = []
        currentConversation.members.map(member => {
            if (member.name.includes(search))
                found.push(member)
        })
        setMemberList(found)
        setSearch("")
        document.getElementById("searchMember").value = ""
    }

    function removeFriend() {
        if (currentConversation.type == 'private') {
            let Ids = currentConversation.members.map(member => member._id)
            console.log(currentConversation.members, currentUser._id)
            Ids.map(Id => {
                if (Id != currentUser._id) {
                    console.log(Id)
                    handleRemoveFriend(Id)
                }
            })
        }
    }

    useEffect(() => {
        const handleAccept = (data) => {
            if (currentConversation.type === 'private') {
                let Ids = currentConversation.members.map(e => e._id)
                if (Ids.includes(data.userInfo._id)) {
                    setIsFriend(true)
                }
            }
        }

        const handleRemove = (data) => {
            if (currentConversation.type === 'private') {
                console.log(data, currentConversation.members)
                let Ids = currentConversation.members.map(e => e._id)
                // console.log(data)
                console.log(Ids, data)
                if (Ids.includes(data.userId)) {
                    setIsFriend(false)
                }
            }
        }

        socket.on('friend:accept', handleAccept)
        socket.on('friend:remove', handleRemove)

        return () => {
            socket.off('friend:accept', handleAccept)
            socket.off('friend:remove', handleRemove)
        }
    }, [socket])

    function sendFriendRequest() {
        currentConversation.members.map(member => {
            if (member._id != currentUser._id) {
                handleSendFriendRequest(member._id)
            }
        })
    }

    return (
        <div className="w-[400px]">
            {currentConversation && currentConversation.type === "private" && <div className="w-full h-full flex flex-col justify-between items-center pt-10">
                <div className="flex flex-col justify-center items-center">
                    <Avatar link={currentConversation.image} />
                    <label>{currentConversation.name}</label>
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <label className="tooltip p-1 hover:bg-gray-300 rounded-md cursor-pointer" data-tip="View profile" onClick={() => { setUserSelected(currentConversation.members.find((e) => currentConversation.name === e.name)); document.getElementById('userProfile').showModal() }}>{icons.viewProfile}</label>
                        {isFriend && <label className="tooltip p-1 hover:bg-gray-300 rounded-md cursor-pointer" data-tip="Add to group"
                            onClick={() => document.getElementById("addFriendToGroup").showModal()}>{icons.addToGroup}</label>}
                        {/* {isFriend && <label className="tooltip text-red-500 p-1 hover:bg-red-200 rounded-md cursor-pointer" data-tip="Remove friend"
                            onClick={() => document.getElementById("removeFriend").showModal()}>{icons.removeFriend}</label>} */}
                        {!isFriend && <label className="tooltip p-1 hover:bg-gray-200 rounded-md cursor-pointer" data-tip="Add friend"

                            onClick={() => { sendFriendRequest() }}>{icons.addFriend}</label>}
                    </div>
                </div>
                <div>
                    <Chatty />
                </div>
            </div>}


            <dialog id="addFriendToGroup" className="modal">
                <div className="w-96 flex flex-col justify-between bg-white p-5 rounded-lg">
                    <HeaderModal name={"Add friend to Group"} />
                    <div className="w-full h-auto flex justify-between items-center gap-2">
                        <div className="w-full h-11 bg-pink-100 input input-bordered flex items-center gap-5">
                            <input type="text" className="grow" id='searchGroup' placeholder="Search" onChange={(setInputSearch)} />
                        </div>
                        <button className="btn btn-secondary" value={search} onClick={() => { searchGroup() }}>Search</button>
                    </div>
                    <div>
                        {
                            groupSelect && groupSelect.length > 0 && <div className='w-full h-auto max-h-[20] flex justify-start items-center gap-2 p-2 whitespace-nowrap text-ellipsis overflow-x-auto overflow-y-hidden'>
                                {
                                    groupSelect.map((e) => (<div key={e._id} className="w-auto h-12 p-2 text-nowrap flex gap-2 justify-between rounded-lg border-pink-500 border-2 text-secondary">
                                        {e.name}
                                        <div onClick={() => removeFromGroup(e)} className="hover:bg-pink-300 flex justify-center items-center p-1 rounded-full">{icons.xClose}</div>
                                    </div>))
                                }
                            </div>
                        }
                    </div>
                    <div>
                        {groupList && groupList.length > 0 ? groupList
                            .map(friend => <div key={friend._id} onClick={() => onGroupSelectedClick(friend)}><ConversationCard props={friend} /></div>)
                            : <div>This friend is a member of your every group</div>
                        }
                    </div>
                    <div className="flex justify-end items-center gap-2 mt-5">
                        <form method="dialog"><button className="btn btn-outline" onClick={() => setGroupSelect([])}>Cancel</button></form>
                        <button className="btn btn-secondary" onClick={() => { handleAddGroup(); document.getElementById("addFriendToGroup").close() }}>Confirm</button>
                    </div>
                </div>
            </dialog>
            <dialog id="removeFriend" className="modal">
                <div className="w-96 flex flex-col justify-between bg-white p-5 rounded-lg">
                    <HeaderModal name={"Warning"} />
                    <div><label>{"Do you want to remove this friend?"}</label></div>
                    <div className="flex justify-end items-center gap-2 mt-5">
                        <form method="dialog"><button className="btn btn-outline" onClick={() => { document.getElementById("removeFriend").close() }}>Cancel</button></form>
                        <button className="btn btn-secondary" onClick={() => { removeFriend() }}>Confirm</button>
                    </div>
                </div>
            </dialog>

            {
                currentConversation && currentConversation.type === "group" && <div className="w-full h-full flex flex-col justify-between items-center pt-10">
                    <div className="flex flex-col justify-center items-center">
                        <div onClick={() => document.getElementById("changeAvatarGroup").showModal()}>
                            <Avatar link={currentConversation.image} />
                        </div>
                        {isShowChangeName ? <div className="flex justify-center items-center p-2 gap-1">
                            <input type="text" placeholder="New name" className="input input-secondary h-8 w-32" onChange={onNewNameChange} />
                            <button className="btn btn-success btn-sm" disabled={newName !== '' ? false : true} onClick={() => handleChangeGroupNamed()}>{icons.vCheck}</button>
                            <button className="btn btn-error btn-sm" onClick={() => setShowChangeName(false)}>{icons.xCancel}</button>
                        </div> : <div className="flex justify-center items-center gap-2 mt-1">
                            <label>{currentConversation.name}</label>
                            <label className="hover:bg-gray-300 p-2 rounded-full" onClick={() => setShowChangeName(true)}>{icons.pencilSquare}</label>
                        </div>}
                        <div className="mt-4 flex justify-center items-center gap-2">
                            <label className="tooltip p-1 hover:bg-gray-300 rounded-md cursor-pointer" data-tip="Add to group"
                                onClick={() => { openAddMemberModal() }}>{icons.addFriend}</label>

                            {currentConversation && currentConversation.leaders.map((e) => (
                                currentUser._id === e._id && (<div key={e._id} className="flex justify-center items-center gap-2">
                                    <label className="tooltip p-1 hover:bg-gray-300 rounded-md cursor-pointer" data-tip="Remove from group"
                                        onClick={() => { openRemoveMemberModal() }}>{icons.removeFriend}</label>
                                    <label className="tooltip text-red-500 p-1 hover:bg-red-200 rounded-md cursor-pointer" data-tip="Disband group"
                                        onClick={() => { document.getElementById("disbandGroup").showModal() }}>{icons.trash}</label>
                                </div>)
                            ))}

                        </div>
                    </div>
                    <div className="overflow-auto max-h-[90%] h-full scroll-smooth text-ellipsis flex-nowrap">
                        {currentConversation && currentConversation.members && currentConversation.members.map((props) => (
                            <div key={props._id} >
                                <div className="p-2 w-auto">
                                    {currentConversation && currentConversation.leaders.map((e) => (
                                        e._id === props._id && (<div key={e._id} className="flex justify-start items-center gap-2">
                                            <label className="text-yellow-500">{icons.leaderStar}</label>
                                            <label className="text-black">Leader</label>
                                        </div>)
                                    ))}
                                    <div className={`flex justify-start items-center p-4 bg-white rounded-lg shadow-sm gap-3 w-full hover:bg-pink-100`}>
                                        <div className="avatar">
                                            <div className="avatar w-12 h-12 rounded-full bg-black">
                                                <img src={props.avatar} alt="avatar" />
                                            </div>
                                        </div>
                                        <div className="flex justify-between w-full">
                                            <div className="flex flex-col justify-around w-full gap-2">
                                                <label className="text-black text-base font-semibold text-ellipsis whitespace-nowrap overflow-hidden w-32">
                                                    {props.name ? props.name : ""}
                                                </label>
                                            </div>
                                        </div>
                                        <div>
                                            <button className="btn btn-sm btn-outline btn-secondary tooltip tooltip-left" data-tip="View profile" onClick={() => { setUserSelected(props); document.getElementById('userProfile').showModal() }}>
                                                {icons.viewProfile}
                                            </button>
                                        </div>
                                        {currentConversation && currentConversation.leaders && currentConversation.leaders.map((e) => (
                                            e._id === currentUser._id && (<div key={e._id}>
                                                <button className="btn btn-sm btn-outline btn-secondary tooltip tooltip-left" data-tip="Change leader"
                                                    onClick={() => { openModal(props._id) }}>{icons.changeLeader}</button>
                                            </div>)
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center items-center p-2 w-full">
                        <button className="btn btn-outline btn-error text-red-500 btn-wide tooltip flex justify-center items-center"
                            data-tip="Leave group"
                            onClick={() => { document.getElementById("leaveGroup").showModal() }}>
                            {icons.leaveGroup}
                        </button>
                    </div>
                </div>
            }


            <dialog id="addToGroup" className="modal">
                <div className="w-96 flex flex-col justify-between bg-white p-5 rounded-lg">
                    <HeaderModal name={"Add to group"} />
                    <div className="w-full h-auto flex justify-between items-center gap-2">
                        <div className="w-full h-11 bg-pink-100 input input-bordered flex items-center gap-5">
                            <input type="text" className="grow" id='searchFriend' placeholder="Search" onChange={(setInputSearch)} />
                        </div>
                        <button className="btn btn-secondary" onClick={() => { searchFriend() }}>Search</button>
                    </div>
                    <div className="w-full h-auto">
                        {
                            selectedList && selectedList.length > 0 && <div className='w-full h-auto max-h-[20] flex justify-start items-center gap-2 p-2 whitespace-nowrap text-ellipsis overflow-x-auto overflow-y-hidden'>
                                {
                                    selectedList.map((e) => (<div key={e._id} className="w-auto h-12 p-2 text-nowrap flex gap-2 justify-between rounded-lg border-pink-500 border-2 text-secondary">
                                        {e.name}
                                        <div onClick={() => removeFromSelected(e)} className="hover:bg-pink-300 flex justify-center items-center p-1 rounded-full">{icons.xClose}</div>
                                    </div>))
                                }
                            </div>
                        }
                    </div>
                    <div>
                        {addMemberList && addMemberList.length > 0 ? addMemberList
                            .map(friend => <div key={friend._id} onClick={() => onSelectedClick(friend)}><FriendCard props={friend} /></div>)
                            : <div>All of your friends are members of this group</div>
                        }
                    </div>
                    <div className="flex justify-end items-center gap-2 mt-5">
                        <form method="dialog"><button className="btn btn-outline">Cancel</button></form>
                        <button className="btn btn-secondary" onClick={() => addMember()}>Confirm</button>
                    </div>
                </div>
            </dialog>
            <dialog id="removeFromGroup" className="modal">
                <div className="w-96 flex flex-col justify-between bg-white p-5 rounded-lg">
                    <HeaderModal name={"Remove from group"} />
                    <div className="w-full h-auto flex justify-between items-center gap-2">
                        <div className="w-full h-11 bg-pink-100 input input-bordered flex items-center gap-5">
                            <input type="text" className="grow" id='searchMember' placeholder="Search" onChange={(setInputSearch)} />
                        </div>
                        <button className="btn btn-secondary" onClick={() => { searchMember() }}>Search</button>
                    </div>
                    <div className="w-full h-auto">
                        {
                            removeList && removeList.length > 0 && <div className='w-full h-auto max-h-[20] flex justify-start items-center gap-2 p-2 whitespace-nowrap text-ellipsis overflow-x-auto overflow-y-hidden'>
                                {
                                    removeList.map((e) => (<div key={e._id} className="w-auto h-12 p-2 text-nowrap flex gap-2 justify-between rounded-lg border-pink-500 border-2 text-secondary">
                                        {e.name}
                                        <div onClick={() => removeFromRemove(e)} className="hover:bg-pink-300 flex justify-center items-center p-1 rounded-full">{icons.xClose}</div>
                                    </div>))
                                }
                            </div>
                        }
                    </div>
                    <div></div>
                    <div>{memberList && memberList.map(e => e._id != currentUser._id ? (<div key={e._id} onClick={() => onRemoveSelectedClick(e)}><FriendCard props={e} /></div>) : <div></div>)}</div>

                    <div className="flex justify-end items-center gap-2 mt-5">
                        <form method="dialog"><button className="btn btn-outline">Cancel</button></form>
                        <button className="btn btn-secondary" id="confirmRemoveMember" onClick={() => confirmRemove()}>Confirm</button>
                    </div>
                </div>
            </dialog>
            <dialog id="leaveGroup" className="modal">
                <div className="w-96 flex flex-col justify-between bg-white p-5 rounded-lg">
                    <HeaderModal name={"Warning"} />
                    <div><label>{"Do you want to leave this group?"}</label></div>
                    {newLeaderSelected && <div className="flex justify-start items-center gap-2">
                        <label className="text-secondary font-semibold">Selected: </label>
                        <div className="w-auto h-12 p-2 text-nowrap flex gap-2 justify-between rounded-lg border-pink-500 border-2 text-secondary">
                            {newLeaderSelected.name}
                            <div onClick={() => { setNewLeaderSelected(null); setDisableConfirm(true) }} className="hover:bg-pink-300 flex justify-center items-center p-1 rounded-full">{icons.xClose}</div>
                        </div>
                    </div>}
                    {currentConversation.leaders.map((e) => {
                        if (e._id === currentUser._id) {
                            return (
                                <div key={e._id} className="overflow-auto max-h-[90%] h-full scroll-smooth text-ellipsis flex-nowrap">
                                    <div><label>{"You are leader!"}</label></div>
                                    <div><label>{"Please choose sone one become a new leader"}</label></div>
                                    {currentConversation && currentConversation.members && currentConversation.members.map((props) => {
                                        if (props._id !== currentUser._id) {
                                            return (
                                                <div key={props._id} onClick={() => { setNewLeaderSelected(props); setDisableConfirm(false) }}>
                                                    <div className="p-2 w-auto">
                                                        <div className={`flex justify-start items-center p-4 bg-white rounded-lg shadow-sm gap-3 w-full hover:bg-pink-100`}>
                                                            <div className="avatar">
                                                                <div className="avatar w-12 h-12 rounded-full bg-black">
                                                                    <img src={props.avatar} alt="avatar" />
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between w-full">
                                                                <div className="flex flex-col justify-around w-full gap-2">
                                                                    <label className="text-black text-base font-semibold text-ellipsis whitespace-nowrap overflow-hidden w-32">
                                                                        {props.name ? props.name : ""}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <button className="btn btn-sm btn-outline btn-secondary tooltip tooltip-left" data-tip="View profile" onClick={() => { setUserSelected(props); document.getElementById('userProfile').showModal() }}>
                                                                    {icons.viewProfile}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })}
                                    <div className="flex justify-end items-center gap-2 mt-5">
                                        <form method="dialog"><button className="btn btn-outline">Cancel</button></form>
                                        <button disabled={disableConfirm} className={`${disableConfirm ? "disabled btn" : "btn btn-secondary "}`} onClick={() => { handleChangeLeaderAndLeave() }}>Confirm</button>
                                    </div>
                                </div>
                            )
                        }
                    })}
                    {currentConversation.leaders.map((e) => {
                        if (e._id !== currentUser._id) {
                            return (<div className="flex justify-end items-center gap-2 mt-5">
                                <form method="dialog"><button className="btn btn-outline">Cancel</button></form>
                                <button className="btn btn-secondary" onClick={() => { confirmLeaveGroup() }}>Confirm</button>
                            </div>)
                        }
                    })}
                </div>
            </dialog>
            <dialog id="disbandGroup" className="modal">
                <div className="w-96 flex flex-col justify-between bg-white p-5 rounded-lg">
                    <HeaderModal name={"Warning"} />
                    <div><label>{"Do you want to disband this group?"}</label></div>
                    <div className="flex justify-end items-center gap-2 mt-5">
                        <form method="dialog"><button className="btn btn-outline">Cancel</button></form>
                        <button className="btn btn-secondary" onClick={() => confirmDisbandGroup()}>Confirm</button>
                    </div>
                </div>
            </dialog>
            <dialog id="changeLeader" className="modal">
                <div className="w-96 flex flex-col justify-between bg-white p-5 rounded-lg">
                    <HeaderModal name={"Warning"} />
                    <div><label>{"Do you want to change leader role?"}</label></div>
                    <div className="flex justify-end items-center gap-2 mt-5">
                        <form method="dialog"><button className="btn btn-outline">Cancel</button></form>
                        <button className="btn btn-secondary" id="transferLeaderConfirm">Confirm</button>
                    </div>
                </div>
            </dialog>
            <dialog id="userProfile" className="modal">
                {dataUserSelected && <div className="flex flex-col w-96 bg-white rounded-lg p-5">
                    <HeaderModal name={"Profile"} />
                    <div className="relative w-full h-40 mb-5">
                        <div className="w-full h-36">
                            <img src={dataUserSelected.background} alt="bg-img" />
                        </div>
                        <div className="flex flex-row justify-center items-center w-full">
                            <div className="avatar absolute bottom-0 left-3 flex justify-center items-center "
                            >
                                <div className="avatar rounded-full w-16 bg-black ">
                                    <img src={dataUserSelected.avatar} alt="avatar" />
                                </div>
                            </div>
                            <div className="flex justify-center items-center gap-1 p-1 text-xl">
                                <label>{dataUserSelected.name}</label>

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
                                <label>{dataUserSelected.gender}</label>
                                <label>{formatDate(dataUserSelected.dateOfBirth)}</label>
                                <label>{dataUserSelected.email}</label>
                            </div>
                        </div>
                    </div>
                </div>}
            </dialog>
            <dialog id="changeAvatarGroup" className="modal">
                <div className="bg-white p-5 rounded-lg">
                    <HeaderModal name={'Change group avatar'} />
                    <div className="flex flex-col gap-2">
                        <input
                            type="file"
                            className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
                            accept="image/png, image/gif, image/jpeg"
                            onChange={(e) => { handleFileChange(e) }}
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
                        <button className="btn btn-outline" onClick={() => { setAvatar(null); setDisplayAvatar(null); document.getElementById('changeAvatarGroup').close() }}>Cancel</button>
                        <button className="btn btn-secondary" onClick={() => { handleUpdateGroupAvatar(currentConversation, avatar, currentUser._id, currentUser.name); getConversationById(currentConversation._id).then(response => dispatch(response)); document.getElementById('changeAvatarGroup').close() }}>Confirm</button>
                    </div>
                </div>
            </dialog>
        </div >
    )
}