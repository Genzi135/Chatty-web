import axios from 'axios';
import { CgLayoutGrid } from 'react-icons/cg';
import { useDispatch } from 'react-redux';
import { setCurrentUser, setLogin } from '../../hooks/redux/reducer';

export const BASE_URL = "http://ec2-54-255-220-169.ap-southeast-1.compute.amazonaws.com:8555";

export const userToken = JSON.parse(localStorage.getItem("userToken"));