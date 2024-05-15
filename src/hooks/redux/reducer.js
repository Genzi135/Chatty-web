export const setViewState = (view) => ({
    type: "SET_VIEW_STATE",
    payload: view
})
export const setLogin = () => ({
    type: "SET_LOGIN",
})
export const setLogout = () => ({
    type: 'SET_LOG_OUT',
})
export const setCurrentUser = (user) => ({
    type: 'SET_CURRENT_USER',
    payload: user
})
export const setCurrentConversation = (conversation) => ({
    type: 'SET_CURRENT_CONVERSATION',
    payload: conversation
})
export const setListMessage = (messages) => ({
    type: 'SET_LIST_MESSAGE',
    payload: messages
})
export const setListConversation = (conversations) => ({
    type: 'SET_LIST_CONVERSATION',
    payload: conversations
})
export const setReplyMessage = (message) => ({
    type: 'SET_REPLY_MESSAGE',
    payload: message
})
export const setSelectedMessage = (message) => ({
    type: 'SET_SELECTED_MESSAGE',
    payload: message
})
export const setSelectedUser = (user) => ({
    type: 'SET_SELECTED_USER',
    payload: user
})
export const addConversation = (conversation) => ({
    type: 'ADD_CONVERSATION',
    payload: conversation
})
export const addMessage = (message) => ({
    type: 'ADD_MESSAGE',
    payload: message
})

const initialState = {
    view: {
        subSideBar: 'chat',
        box: 'chat'
    },
    login: false,
    currentUser: {},
    currentConversation: {},
    listConversation: [],
    listMessage: [],
    replyMessage: null,
    selectedMessage: {},
    selectedUser: {}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_VIEW_STATE':
            return {
                ...state,
                view: action.payload
            }
        case 'SET_LOGIN':
            return {
                ...state,
                login: true,
            }
        case 'SET_LOG_OUT':
            return {
                ...state,
                currentConversation: {},
                currentUser: {},
                login: false
            }
        case 'SET_CURRENT_USER':
            return {
                ...state,
                currentUser: action.payload
            }
        case 'SET_CURRENT_CONVERSATION':
            return {
                ...state,
                currentConversation: action.payload
            }
        case 'SET_LIST_MESSAGE':
            return {
                ...state,
                listMessage: action.payload
            }
        case 'SET_LIST_CONVERSATION':
            return {
                ...state,
                listConversation: action.payload
            }
        case 'SET_REPLY_MESSAGE':
            return {
                ...state,
                replyMessage: action.payload
            }
        case 'SET_SELECTED_MESSAGE':
            return {
                ...state,
                selectedMessage: action.payload
            }
        case 'SET_SELECTED_USER':
            return {
                ...state,
                selectedUser: action.payload
            }
        case 'ADD_CONVERSATION': {
            return {
                ...state,
                listConversation: [...state.listConversation, action.payload]
            }
        }
        case 'ADD_MESSAGE': {
            return {
                ...state,
                listMessage: [...state.listMessage, action.payload]
            }
        }
        default: return state;
    }
}

export default reducer;