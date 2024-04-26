import axios from 'axios';
import { CgLayoutGrid } from 'react-icons/cg';
import { useDispatch } from 'react-redux';
import { addConversation, setCurrentConversation, setCurrentUser, setListConversation, setListMessage, setLogin, setViewState } from '../../hooks/redux/reducer';
import { useEffect } from 'react';
import SubSideBar from '../../pages/dashboard/sideBar/SubSideBar';
import { checkExist } from '../../helpers/helperFunction';

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
    } catch (err) {
        console.log(err);
    }

    getListConversation(dispatch)
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
    } catch (err) {
        console.log(err);
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

        console.log(response)
    } catch (err) {
        console.log(err)
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
        console.log(err)
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
        console.log(response.data.data)
        return response
    } catch (err) {
        console.log(err)
    }
}

//Remove friend
export async function handleRemoveFriend(id) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/remove" + id,
            method: 'POST',
            headers: { Authorization: `Bearer ${userToken}` }
        })
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
    } catch (error) {
        console.log(error);
    }
}

export async function handleOpenConversation (id, dispatch, listConversation) {
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

        console.log(checkExist(listConversation, response.data.data._id))
        if (!checkExist(listConversation, response.data.data._id)) {
            dispatch(addConversation(response.data.data))
        }
        getListMessageByConversation(response.data.data._id, dispatch)

    } catch (error) {
        console.log(error)
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
        console.log(response);
        dispatch(setListMessage(response.data.data.reverse()))
    } catch (error) {
        console.log(error);
    }
}