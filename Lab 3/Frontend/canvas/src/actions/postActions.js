import {FETCH_POST,NEW_POST,LOGIN_POST} from './actionTypes';
import axios from 'axios';
import Cookies from 'js-cookie';


export const fetchPost = values => dispatch => {
    console.log("Inside DISPATCH FUNCTION");
    const response = axios.post('http://localhost:3001/signup',values).then(response => {
        console.log("Status code: ",response);
        if(response.status === 200){
            console.log("Inside fetchPost : Success in signup");
            dispatch({
                type: FETCH_POST,
                payload: response.data,
            });
        }else{
            console.log("Inside fetchPost : ERROR in signup");
        }
    });
}

export const loginPost = values => dispatch =>{
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    console.log("in login data POST");
    axios.post('http://localhost:3001/login',values)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){ 
 
                console.log("Inside loginPost : success in login");
                console.log(values);
                Cookies.set('userId',response.data.userId);
                Cookies.set('role',response.data.role);
                console.log("Congrats on Login");
              dispatch( {
                type: LOGIN_POST,
                // payload: response.data
                payload: values
              });
            }else{
                console.log("Inside loginPost : ERROR in login");
            }
        });
   }

   export const userProfile = values => dispatch =>{
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post('http://localhost:3001/userprofile/edit',values)
        .then(response => {
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                
            console.log("Inside userProfile : success in updating profile");
            console.log(values);
  
            dispatch( {
                type: NEW_POST,
                payload: values
              });
        }else{
            console.log("Inside userProfile : ERROR in updating profile");
        }
        });
   }

