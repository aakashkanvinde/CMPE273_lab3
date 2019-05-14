// FUNCTIONALITY STILL REMAINING 


import {FETCH_POST,NEW_POST,LOGIN_POST} from '../actions/actionTypes';

const intitialState = {
    items :[],
    userid : [],
    editProfile : {},
    user : {}
}

export default function(state = intitialState,action){
    switch(action.type){
    case FETCH_POST :
       console.log("in FETCH_POST");
       console.log(action.payload);

       return{
           ...state,
           data : action.payload.data,
           items: action.payload.data
          //redirect:true
          //  data : action.payload,
                            //  redirect: action.payload[0].finalstatus,
                            //  facultyfnd : action.payload[0].facultyfnd,
                            //  errorlogin: action.payload[0].finalstatus,
                            //  validity :  action.payload[0].pwdvalidity
       }
       case LOGIN_POST :
       console.log("in LOGIN_POST");
       console.log(action.payload);
       return{
           ...state,
            ...state.user,
            user: action.payload,
            // userId: action.payload[0].userId,
            // final: action.payload[0].finalstatus,
            // items: action.payload[0].pwdvalidity,
            // red : action.payload[0].finalstatus,
            // username : action.payload[0].username,  

       }
       case NEW_POST :
       console.log("in NEW_POST");
       console.log(action.payload);
       return{
           ...state,
           ...state.editProfile,
           editProfile: action.payload,
        }
    default:
      return state;   
    }
}