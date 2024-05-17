import axios from 'axios';
import { CgLayoutGrid } from 'react-icons/cg';
import { useDispatch } from 'react-redux';
import { addConversation, addMessage, setCurrentConversation, setCurrentUser, setListConversation, setListMessage, setLogin, setViewState } from '../../hooks/redux/reducer';
import { useEffect } from 'react';
import SubSideBar from '../../pages/dashboard/sideBar/SubSideBar';
import { checkExist } from '../../helpers/helperFunction';
import ConversationSkeleton from '../common/ConversationSkeleton';

export const BASE_URL = "http://ec2-54-255-220-169.ap-southeast-1.compute.amazonaws.com:8555";

export let userToken = JSON.parse(localStorage.getItem("userToken"));

//Login
export async function handleLogin(email, password, dispatch) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/auth/login",
            method: "post",
            data: {
                email: email,
                password: password
            }
        })
        dispatch(setCurrentUser(response.data.data.user))
        localStorage.setItem("userToken", JSON.stringify(response.data.data.token.access_token))
        dispatch(setLogin())
        dispatch(setCurrentUser(response.data.data.user))
        localStorage.setItem("userToken", JSON.stringify(response.data.data.token.access_token))
        userToken = JSON.parse(localStorage.getItem("userToken"));
        dispatch(setLogin())
        return response
    } catch (err) {
        return err;
    }

    getListConversation(dispatch)
}

//check login
export async function checkLogin(email, password) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/auth/login",
            method: "post",
            data: {
                email: email,
                password: password
            }
        })
        return response
    } catch (err) {
        return err
    }
}

//Register
export async function handleRegisterAPI(email, password, name, gender, dob) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/auth/register",
            method: "post",
            data: {
                email: email,
                password: password,
                name: name,
                gender: gender,
                dateOfBirth: dob
            }
        })
        return response
    } catch (err) {
        return err;
    }
}

//Add friend
export async function handleSearchFriendAPI(email) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/users/findByEmail/" + email,
            headers: { Authorization: `Bearer ${userToken}` },
            method: 'GET'
        })
        return response
    } catch (err) {
        return err
    }
}

//Search friend by ID
export async function handleSearchFriendID(ID) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/users/" + ID,
            headers: { Authorization: `Bearer ${userToken}` },
            method: 'GET'
        })
        return response
    } catch (err) {
        return err
    }
}


//Get friend list
export async function handleGetFriendList() {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/friends/",
            method: "GET",
            headers: { Authorization: `Bearer ${userToken}` },
            params: { type: 'private' }
        })
        return response
    } catch (err) {
        return err
    }
}

//Get group list
export async function handleGetGroupList() {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/conservations",
            method: 'GET',
            headers: { Authorization: `Bearer ${userToken}` },
            params: { type: 'group' }
        })
        return response
    } catch (err) {
        return err
    }
}

//Get friend requests
export async function handleGetFriendRequest() {
    try {
        const response = await axios({
            url: BASE_URL + '/api/v1/friends/requests',
            method: 'GET',
            headers: { Authorization: `Bearer ${userToken}` },
        })
        return response
    } catch (err) {
        return err
    }
}

//Send friend request
export async function handleSendFriendRequest(id) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/friends/request/" + id,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
        })
    } catch (err) {
        return err
    }
}

//Handle cancel friend request
export async function handleCancelFriendRequest(id) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/friends/cancel/${id}`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` }
        })
        console.log(response)
    } catch (err) {
        return err
    }
}

//Handle accept friend request
export async function handleAcceptFriendRequest(id) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/friends/accept/" + `${id}`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
        })
    } catch (err) {
        return err
    }
}

//Handle reject friend request
export async function handleRejectFriendRequest(id) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/friends/reject/" + `${id}`,
            method: 'post',
            headers: { Authorization: `Bearer ${userToken}` },
        })
    } catch (err) {
        return err
    }
}

//Remove friend
export async function handleRemoveFriend(id) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/friends/remove/" + `${id}`,
            method: 'post',
            headers: { Authorization: `Bearer ${userToken}` },
        })
    } catch (err) {
        return err
    }
}

//Get conversation by id
export async function getConversationById(conversationId) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/conservations/${conversationId}`,
            method: 'GET',
            headers: { Authorization: `Bearer: ${userToken}` }
        })
        return response.data.data
    } catch (err) {
        console.log(err)
    }
}

//Get list of conversation
export async function getListConversation(dispatch) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/conservations",
            method: 'GET',
            headers: { Authorization: `Bearer ${userToken}` },
        })
        dispatch(setListConversation(response.data.data))
        return response
    } catch (error) {
        return error;
    }
}

//Handle open conversation
export async function handleOpenConversation(id, dispatch, listConversation) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/conservations/open/" + `${id}`,
            method: 'post',
            headers: { Authorization: `Bearer ${userToken}` },
        })

        dispatch(setCurrentConversation(response.data.data))
        dispatch(setViewState({
            box: 'chat',
            subSideBar: 'chat'
        }))

        if (!checkExist(listConversation, response.data.data._id)) {
            dispatch(addConversation(response.data.data))
        }
        getListMessageByConversation(response.data.data._id, dispatch)

    } catch (error) {
        return error
    }
}

//Get list message
export async function getListMessageByConversation(id, dispatch) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/conservations/${id}/messages`,
            method: 'GET',
            headers: { Authorization: `Bearer ${userToken}` }
        })
        dispatch(setListMessage(response.data.data.reverse()))
    } catch (error) {
        return error;
    }
}

//Create group
export async function handleCreateGroup(id, member, groupName, groupImage) {
    const newList = member.map(e => e.userId);
    try {
        const response = await axios({
            url: BASE_URL + '/api/v1/conservations/createGroup',
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
            data: {
                name: groupName,
                members: newList
                //image: groupImage
            }
        })
    } catch (err) {
        return err
    }
}

//Profile avatar update
export async function handleUpdateAvatar(yourId, inputAva) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/users/updateAvatar",
            method: "put",
            type: "application/json",
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'multipart/form-data',
            },
            data: { avatar: inputAva },
        })
        return response
    } catch (err) {
        return err
    }
    // await fetch(BASE_URL + '/api/v1/users/updateAvatarV2', {
    //     method: 'PUT',
    //     type: 'application/json',
    //     headers: {
    //         Authorization: `Bearer ${userToken}`,
    //         'Content-Type': 'multipart/form-data'
    //     },
    //     data: { avatar: inputAva },
    // })
    //     .then(response => console.log(response))
    //     .catch(err => { return err })
}

//Group avatar update
export async function handleUpdateGroupAvatar(conversation, inputAva, yourId, userName) {
    // await fetch(BASE_URL + `/api/v1/conservations/${conversation._id}/changeImageV2`, {
    //     method: 'POST',
    //     type: "application/json",
    //     headers: {
    //         Authorization: `Bearer ${userToken}`,
    //         'Content-Type': 'multipart/form-data'
    //     },
    //     data: {
    //         conservationId: conversation._id,
    //         userId: yourId,
    //         image: inputAva,
    //         userName: userName
    //     }
    // })

    try {
        const repsonse = await axios({
            url: BASE_URL + `/api/v1/conservations/${conversation._id}/changeImageV2`,
            method: 'POST',
            type: 'application/json',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'multipart/form-data',
            },
            data: {
                conservationId: conversation._id,
                userId: yourId,
                image: inputAva,
                userName: userName
            }
        })
        console.log(repsonse)
    } catch (err) {
        return err
    }
}

//Add member
export async function handleAddMember(conversation, yourId, Ids, dispatch) {
    let newList = []
    if (Array.isArray(Ids)) {
        newList = Ids.map(e => e.userId);
    }
    else newList = [...newList, Ids._id]

    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/conservations/${conversation._id}/addMembers`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken}`
            },
            data: {
                conservationId: conversation._id,
                userId: yourId,
                members: newList

            }
        })
    } catch (err) {
        return err
    }
}

//Remove member
export async function handleRemoveMemeber(conversation, yourId, Ids) {
    const newList = Ids.map(e => e._id);
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/conservations/${conversation._id}/removeMembers`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
            data: {
                conversationId: conversation._id,
                userId: yourId,
                members: newList
            }
        })
    } catch (err) {
        return err
    }
}

//Disband group
export async function handleDisbandGroup(conversation, yourId) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/conservations/${conversation._id}/disband`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
            data: {
                conversationId: conversation._id,
                userId: yourId,
            }
        })
        return response
    } catch (err) {
        return err
    }
}

//Leave group
export async function handleLeaveGroup(conversation, yourId, name) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/conservations/${conversation._id}/leaveGroup`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
            data: {
                conversationId: conversation._id,
                userId: yourId,
                // userName: name
            }
        })
    } catch (err) {
        return err;
    }
}

//Change group name
export async function handleChangeGroupName(conversation, yourId, yourName, groupName) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/conservations/${conversation._id}/changeName`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
            data: {
                conversationId: conversation._id,
                userId: yourId,
                userName: yourName,
                name: groupName
            }
        })
        return response
    } catch (err) {
        return err
    }
}

//Transfer group leader
export async function handleTransferGroupLeader(conversation, id, yourId) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/conservations/${conversation._id}/transfer/${id}`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
            data: {
                conversationId: conversation._id,
                userId: yourId,
                newLeaderId: id,
            }
        })
    } catch (err) {
        return err
    }
}

//Send message
export async function handleSendMessage(listConversation, currentConversation, inputMessage, dispatch) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/conservations/" + `${currentConversation._id}/messages/sendText`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
            data: {
                content: inputMessage
            }
        });
        dispatch(addMessage(response.data.data))
        const newList = listConversation.map((e) => {
            if (e._id === currentConversation._id) {
                return { ...e, lastMessage: { content: inputMessage } }
            }
            return e
        })
        dispatch(setListConversation(newList))
        return response.data.data
    } catch (err) {
        return err
    }
}

//Send files
export async function handleSendFile(listConversation, currentConversation, formData, dispatch) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/conservations/" + `${currentConversation._id}/messages/sendFiles`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
            data: formData
        });
        dispatch(addMessage(response.data.data))
        const newList = listConversation.map((e) => {
            if (e._id === currentConversation._id) {
                return { ...e, lastMessage: response.data.data }
            }
            return e;
        })
        console.log(newList);
        console.log(response.data.data);

        dispatch(setListConversation(newList))
        return response.data.data
    } catch (err) {
        return err
    }
}

//Reply message
export async function handleReplyMessage(conversation, message, inputMessage, dispatch) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/conservations/${conversation._id}/messages/replyText/${message._id}`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
            data: {
                content: inputMessage
            }
        });
        dispatch(addMessage(response.data.data))
        return response.data.data
    } catch (err) {
        return err
    }
}

//Forawrd message
export async function handleForwardMessage(conversation, message, dispatch) {
    try {
        if (message.attachments.length !== 0) {
            const response = await axios({
                url: BASE_URL + `/api/v1/conservations/${conversation._id}/forwardFiles`,
                method: 'POST',
                headers: { Authorization: `Bearer: ${userToken}` },
                data: {
                    files: message.attachments
                }
            })
            return response.data.data
        } else {
            const response = await axios({
                url: BASE_URL + `/api/v1/conservations/${conversation._id}/messages/sendText`,
                method: 'POST',
                headers: { Authorization: `Bearer: ${userToken}` },
                data: {
                    content: message.content
                }
            })
            return response.data.data
        }

    } catch (err) {
        return err
    }
}

//Delete message
export async function handleDeleteMessage(id) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/messages/${id}`,
            method: 'DELETE',
            headers: { Authorization: `Bearer ${userToken}` }
        })
        //return response.data.data
    } catch (err) {
        return err
    }
}

//Update profile
export async function handleUpdateProfile(name, gender, dateOfBirth) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/users/updateMe`,
            method: 'PUT',
            headers: { Authorization: `Bearer ${userToken}` },
            data: {
                name: name,
                gender: gender,
                dateOfBirth: dateOfBirth
            }
        })
        return response
    } catch (err) {
        return err
    }
}

//Get infomation
export async function handleGetMe() {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/users/getMe`,
            method: 'GET',
            headers: { Authorization: `Bearer ${userToken}` }
        })
        return response
    } catch (err) {
        return err
    }
}

//Handle change password
export async function handleChangePassword(old, newPassword) {
    try {
        const response = await axios({
            url: BASE_URL + `/api/v1/auth/changePassword`,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` },
            data: {
                oldPassword: old,
                newPassword: newPassword
            }
        })
        return response
    } catch (err) {
        return err
    }
}

//Handle send OTP
export async function handleSendOTP(email) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/users/forgetPassword",
            method: 'post',
            data: { email: email }
        })
        return response
    } catch (err) {
        return err
    }
}

//Handle check OTP
export async function handleCheckOTP(email, OTP) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/users/verifyForgetPasswordOTP",
            method: 'post',
            data: {
                email: email,
                otp: OTP
            }
        })
        return response
    } catch (err) {
        return err
    }
}

//Handle reset password
export async function handleResetPassword(email, password) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/users/resetPassword",
            method: 'post',
            data: {
                email: email,
                password: password
            }
        })
        return response
    } catch (err) {
        return err
    }
}