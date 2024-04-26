import { useDispatch, useSelector } from "react-redux"
import Dashboard from "../pages/dashboard"
import Authentication from "../pages/authentication"
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../components/shared/api";
import { setCurrentUser, setLogin, setLogout } from "../hooks/redux/reducer";
import { userToken } from "../components/shared/api";

export default function Layout() {
    const isLogin = useSelector((state) => state.login);
    const dispatch = useDispatch();

    const getData = async () => {
        if (!userToken) {
            dispatch(setLogout());
            return;
        }
        try {
            const respone = await axios({
                url: BASE_URL + "/api/v1/users/getMe",
                method: 'get',
                headers: { Authorization: `Bearer ${userToken}` },
            });
            dispatch(setCurrentUser(respone.data.data));
            dispatch(setLogin());
        } catch (error) {
            console.log(error);
            dispatch(setLogout());
        }
    }

    useEffect(() => {
        getData();
    }, [])
    return (
        <div>
            {isLogin ? (<Dashboard />) : (<Authentication />)}
        </div>
    )
}