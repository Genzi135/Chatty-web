import axios from 'axios';
import { CgLayoutGrid } from 'react-icons/cg';
import { useDispatch } from 'react-redux';
import { setCurrentUser, setListConversation, setLogin } from '../../hooks/redux/reducer';
import { useEffect } from 'react';

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
            userToken = JSON.parse(localStorage.getItem("userToken"));
            dispatch(setLogin())
    } catch (err) {
        console.log(err);
    }

    getListConversation(dispatch)
}

//Register
export async function handleRegisterAPI (email, password, name, gender, dob) {
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
export async function handleSearchFriendAPI (email) {
    try {
        const response = await axios({
            url: BASE_URL + "/api/v1/users/findByEmail/" + email,
            headers: { Authorization: `Bearer ${userToken}` },
            method: 'GET'
        })
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
        return response
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
            params: { type: 'private' }
        })
        dispatch(setListConversation(response.data.data))
    } catch (error) {
        console.log(error);
    }
}
