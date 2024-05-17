import { useSelector } from "react-redux"
import icons from "../../../components/shared/icon";
import { handleGetFriendList, handleGetFriendRequest, handleGetGroupList } from "../../../components/shared/api";
import { useEffect, useState } from "react";
import ConversationCard from "../../../components/common/ConversationCard";
import FriendCard from "../../../components/common/FriendCard";
import GroupCard from "../../../components/common/GroupCard";
import RequestReceiveCard from "../../../components/common/RequestReceiveCard";
import ModalConfirm from "../../../components/common/ModalConfirm";
import { useSocket } from "../../../hooks/context/socket";

export default function Contact() {
    const viewState = useSelector(state => state.view)
    const [friendDataSource, setFriendDataSource] = useState([]);
    const [groupDataSource, setGroupDataSource] = useState([]);
    const [requestReceiveList, setRequestReceiveList] = useState([]);
    const [isRefresh, setIsRefresh] = useState(false);

    const {socket} = useSocket()

    useEffect(() => {
        console.log(isRefresh)
        if (isRefresh) {
            handleGetFriendList()
                .then((dataSource) => setFriendDataSource(dataSource.data.data))
            setIsRefresh(false)
        }
    }, [isRefresh])

    useEffect(() => {
        handleGetFriendList()
            .then((dataSource) => setFriendDataSource(dataSource.data.data))
        handleGetGroupList()
            .then((dataSource) => setGroupDataSource(dataSource.data.data))
        handleGetFriendRequest()
            .then((dataSource) => setRequestReceiveList(dataSource.data.data))
    }, [])

    useEffect(() => {

    }, [friendDataSource, groupDataSource, requestReceiveList])

    useEffect(() => {
        const handleRequest = (data) => {
            handleGetFriendRequest()
                .then((dataSource) => setRequestReceiveList(dataSource.data.data))
        }

        const handleReject = (data) => {
            handleGetFriendRequest()
                .then((dataSource) => setRequestReceiveList(dataSource.data.data))
        }

        const handleAccept = (data) => {
            handleGetFriendRequest()
                .then((dataSource) => setRequestReceiveList(dataSource.data.data))
            handleGetFriendList()
                .then((dataSource) => setFriendDataSource(dataSource.data.data))
        }

        const handleCancel = (data) => {
            handleGetFriendRequest()
                .then((dataSource) => setRequestReceiveList(dataSource.data.data))
        }

        socket.on('friend:request', handleRequest)
        socket.on('friend:reject', handleReject)
        socket.on('friend:accept', handleAccept)
        socket.on('friend:cancel', handleCancel)

        return () => {
            socket.off('friend:request', handleRequest)
            socket.off('friend:reject', handleReject)
            socket.off('friend:accept', handleAccept)
            socket.off('friend:cancel', handleCancel)
        }
    }, [socket])

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            {viewState.box === 'contact' && <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center bg-pink-300 p-5 gap-2">
                    {icons.listFriend}
                    <label className="font-semibold text-xl">Friend list</label>
                </div>
                <div className="h-full w-full p-2">
                    <div className="bg-gray-100 h-full w-full p-2 flex flex-col">
                        {friendDataSource.map((e) => (<FriendCard props={e} isRefresh={setIsRefresh} optionButton={'ChatRemove'} key={e._id} dataSource={setFriendDataSource} />))}
                    </div>
                </div>
            </div>}
            {viewState.box === 'group' && <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center bg-pink-300 p-5 gap-2">
                    {icons.listGroup}
                    <label className="font-semibold text-xl">Group list</label>
                </div>
                <div className="h-full w-full p-2">
                    <div className="bg-gray-100 h-full w-full p-2 flex flex-col">
                        {groupDataSource.map((e) => (<GroupCard props={e} key={e._id} />))}
                    </div>
                </div>
            </div>}
            {viewState.box === 'request' && <div className="flex flex-col gap-2">
                <div className="flex justify-start items-center bg-pink-300 p-5 gap-2">
                    {icons.listRequest}
                    <label className="font-semibold text-xl">Request list</label>
                </div>
                <div className="h-full w-full p-2">
                    <div className="bg-gray-100 h-full w-full p-2 flex flex-col">
                        <div className="w-full h-auto flex flex-col">
                            <label className="text-lg font-semibold bg-pink-300 p-2 rounded-lg">Requests recieved</label>
                            <div className="h-auto w-full p-2">
                                <div className="bg-gray-100 h-full w-full p-2 flex flex-col">
                                    {requestReceiveList.map((e) => (<RequestReceiveCard props={e} key={e._id} dataSource={setRequestReceiveList}/>))}
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-auto flex flex-col ">
                            <label className="text-lg font-semibold bg-pink-300 p-2 rounded-lg">Requests sent</label>
                            <div className="h-auto w-full p-2">

                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}