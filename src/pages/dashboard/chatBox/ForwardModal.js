import HeaderModal from '../../../components/common/HeaderModal'
import CustomButton from '../../../components/common/CustomButton'
import FriendCard from '../../../components/common/FriendCard'
import ConversationSkeleton from '../../../components/common/ConversationSkeleton'
import { getListConversation, handleForwardMessage, handleGetFriendList } from '../../../components/shared/api'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ConversationCard from '../../../components/common/ConversationCard'
import Button from '../../../components/common/Button'
import { useSocket } from '../../../hooks/context/socket'
import { setListConversation } from '../../../hooks/redux/reducer'
import ConversationForwardCard from '../../../components/common/ConversationForward'
import { SelectedCard } from '../../../components/common/SelectedCard'
export default function ForwardModal({ onClose }) {
    const [dataSource, setDataSource] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [search, setSearch] = useState('');
    const selectedMessage = useSelector((state) => state.selectedMessage)
    const conversationList = useSelector((state) => state.listConversation)
    const currentConversation = useSelector((state) => state.currentConversation)

    const [option, setOption] = useState('');

    const { socket } = useSocket()
    const dispatch = useDispatch()

    const setInputSearch = (e) => {
        setSearch(e.target.value)
    }

    const removeSelected = (e) => {

    }

    useEffect(() => {
        setSelectedList([])
        setDataSource(conversationList)
    }, [])

    const onSelectedClick = (e) => {
        setSelectedList([...selectedList, e]);
        setDataSource(dataSource.filter(el => el !== e))
    }

    useEffect(() => {
        if (option === 'cancel') {
            setOption('')
            setDataSource(conversationList)
            onClose('ForwardModal');
        } else if (option === 'confirm') {
            forwardMessage()
            setDataSource(conversationList)
            setOption('')
            onClose('ForwardModal');
        }
    }, [option])

    function forwardMessage() {
        selectedList.map((e) => {
            var newList = conversationList.map(conversation => {
                console.log(conversation._id === e._id)
                if (conversation._id === e._id) {
                    if (conversation._id === currentConversation._id) {
                        return { ...conversation, lastMessage: selectedMessage, isReadMessage: true };
                    }
                    return { ...conversation, lastMessage: selectedMessage, isReadMessage: false };
                }
                return conversation;
            });
            dispatch(setListConversation(newList))

            handleForwardMessage(e, selectedMessage, dispatch)
                .then(response => {
                    console.log(response)
                    socket.emit("message:send", {
                        ...response,
                        conversation: e,
                    })
                })
        })
    }

    return (
        <div className='w-[400px] h-auto flex flex-col bg-white p-5'>
            <HeaderModal name={"Forward message"} />
            <div className="w-full h-auto flex justify-between items-center gap-2">
                <div className="w-full h-11 bg-pink-100 input input-bordered flex items-center gap-5">
                    <input type="text" className="grow" placeholder="Search" onChange={(setInputSearch)} />
                </div>
                <CustomButton name={'Search'} onClick={() => { }} />
            </div>
            {
                selectedList && selectedList.length > 0 && <div className='w-full h-auto flex justify-start items-center gap-2'>
                    {
                        selectedList.map((e) => (<SelectedCard props={e} removeFromSelected={removeSelected} />))
                    }
                </div>
            }
            {dataSource ? dataSource.map((e, index) => (<div key={index} onClick={() => onSelectedClick(e)}>
                <ConversationForwardCard props={e} />
            </div>))
                : <ConversationSkeleton />
            }
            <div className='flex justify-end items-center'><Button value={setOption} /></div>
        </div>
    )
}