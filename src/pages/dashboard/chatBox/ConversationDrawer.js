import { useDispatch, useSelector } from "react-redux"
import Avatar from "../../../components/common/Avatar";
import icons from "../../../components/shared/icon";
import HeaderModal from "../../../components/common/HeaderModal";
import { getConversationById, getListConversation, handleAddMember, handleDisbandGroup, handleGetFriendList, handleLeaveGroup, handleRemoveMemeber, handleTransferGroupLeader } from "../../../components/shared/api";
import { useEffect, useState } from "react";
import FriendCard from "../../../components/common/FriendCard";
import { setCurrentConversation } from "../../../hooks/redux/reducer";
import ConversationSkeleton from "../../../components/common/ConversationSkeleton";
import { current } from "@reduxjs/toolkit";

export default function ConversationDrawer() {
    const currentConversation = useSelector(state => state.currentConversation)
    const currentUser = useSelector(state => state.currentUser);
    const [dataSource, setDataSource] = useState([])
    const [isRefresh, setRefresh] = useState(false);
    const [addMemberList, setAddMemberList] = useState([])
    const [selectedList, setSelectedAddList] = useState([])
    const [removeList, setRemoveList] = useState([])

    const dispatch = useDispatch()

    const onSelectedClick = (e) => {
        if (selectedList.includes(e)) return
        setSelectedAddList([...selectedList, e]);
    }

    const onRemoveSelectedClick = (e) => {
        if (removeList.includes(e)) return
        setRemoveList([...removeList, e]);
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

    const check = () => {
        console.log(dataSource);
        console.log(currentConversation.members);

        const currentUserID = currentUser._id; // Giả sử bạn có một biến currentUser chứa thông tin của người dùng hiện tại

        const differentObjects = [];

        // Lọc ra các đối tượng khác nhau từ dataSource
        dataSource.forEach(friend => {
            if (friend.userId !== currentUserID && !currentConversation.members.some(member => member._id === friend.userId)) {
                differentObjects.push(friend);
            }
        });

        // Lọc ra các đối tượng khác nhau từ currentConversation.members
        currentConversation.members.forEach(member => {
            if (member._id !== currentUserID && !dataSource.some(friend => friend.userId === member._id)) {
                differentObjects.push(member);
            }
        });

        setAddMemberList(differentObjects)
    };




    useEffect(() => { check() }, [dataSource])

    // console.log(currentConversation)

    useEffect(() => {
        handleGetFriendList().then(response => setDataSource(response.data.data))
        console.log(dataSource)

    }, [])

    function IsMember(userId, conversationId) {
        getConversationById(conversationId)
            .then((response) => {
                const memberList = response.data.data.members
                if (Array.isArray(memberList)) {
                    memberList.map(member => {
                        if (member._id == userId) {
                            return (<div></div>);
                        }
                        return (<FriendCard props={userId} />)
                    })
                }
            }
            )
    }

    const confirmDisbandGroup = () => {
        handleDisbandGroup(currentConversation, currentUser._id)
            .then((response) => {
                console.log(response)
                dispatch(setCurrentConversation({}))
                getListConversation(dispatch)
            })
            .catch((err) => console.log(err))
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
            .then(() => {
                getConversationById(currentConversation._id)
                    .then(response => dispatch(setCurrentConversation(response.data.data)))
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
                    .then(response => dispatch(setCurrentConversation(response.data.data)))
            })
        document.getElementById("removeFromGroup").close()
        setRemoveList([])
    }

    return (
        <div className="w-[400px]">
            {currentConversation && currentConversation.type === "private" && <div className="w-full h-full flex flex-col justify-between items-center pt-10">
                <div className="flex flex-col justify-center items-center">
                    <Avatar link={currentConversation.image} />
                    <label>{currentConversation.name}</label>
                    <div className="mt-4 flex justify-center items-center gap-2">
                        <label className="tooltip p-1 hover:bg-gray-300 rounded-md cursor-pointer" data-tip="Add to group"
                            onClick={() => document.getElementById("addFriendToGroup").showModal()}>{icons.addFriend}</label>
                        <label className="tooltip text-red-500 p-1 hover:bg-red-200 rounded-md cursor-pointer" data-tip="Remove friend"
                            onClick={() => document.getElementById("removeFriend").showModal()}>{icons.removeFriend}</label>
                    </div>
                </div>
            </div>}


            <dialog id="addFriendToGroup" className="modal">
                <div className="w-96 flex flex-col justify-between bg-white p-5 rounded-lg">
                    <HeaderModal name={"Add friend to Group"} />
                    <div><label>{"Add a friend to group"}</label></div>
                    <div className="flex justify-end items-center gap-2 mt-5">
                        <form method="dialog"><button className="btn btn-outline">Cancel</button></form>
                        <button className="btn btn-secondary">Confirm</button>
                    </div>
                </div>
            </dialog>
            <dialog id="removeFriend" className="modal">
                <div className="w-96 flex flex-col justify-between bg-white p-5 rounded-lg">
                    <HeaderModal name={"Warning"} />
                    <div><label>{"Do you want to remove this friend?"}</label></div>
                    <div className="flex justify-end items-center gap-2 mt-5">
                        <form method="dialog"><button className="btn btn-outline">Cancel</button></form>
                        <button className="btn btn-secondary">Confirm</button>
                    </div>
                </div>
            </dialog>












            {currentConversation && currentConversation.type === "group" && <div className="w-full h-full flex flex-col justify-between items-center pt-10">
                <div className="flex flex-col justify-center items-center">
                    <Avatar link={currentConversation.image} />
                    <label>{currentConversation.name}</label>
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
                <div>
                    {currentConversation && currentConversation.members && currentConversation.members.map((props) => (
                        <div key={props._id}>
                            <div className="p-2 w-auto">
                                {currentConversation && currentConversation.leaders.map((e) => (
                                    e._id === props._id && (<div className="flex justify-start items-center gap-2">
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
                                            <label className="text-black text-base font-semibold text-ellipsis whitespace-nowrap overflow-hidden w-48">
                                                {props.name ? props.name : ""}
                                            </label>
                                        </div>
                                    </div>
                                    {currentConversation && currentConversation.leaders && currentConversation.leaders.map((e) => (
                                        e._id === currentUser._id && (<div>
                                            <button className="btn btn-outline btn-secondary tooltip tooltip-left" data-tip="Change leader"
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
            </div>}


            <dialog id="addToGroup" className="modal">
                <div className="w-96 flex flex-col justify-between bg-white p-5 rounded-lg">
                    <HeaderModal name={"Add to group"} />
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
                        {addMemberList && addMemberList.length > 0 && addMemberList
                            .map(friend => <div key={friend._id} onClick={() => onSelectedClick(friend)}><FriendCard props={friend} /></div>)

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
                    <div>{currentConversation && currentConversation.members.map(e => e._id != currentUser._id ? (<div key={e._id} onClick={() => onRemoveSelectedClick(e)}><FriendCard props={e} /></div>) : <div></div>)}</div>

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
                    <div className="flex justify-end items-center gap-2 mt-5">
                        <form method="dialog"><button className="btn btn-outline">Cancel</button></form>
                        <button className="btn btn-secondary" onClick={() => { confirmLeaveGroup() }}>Confirm</button>
                    </div>
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
        </div>
    )
}