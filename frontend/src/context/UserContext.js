import React, { useState, useEffect, createContext } from 'react';
import { Redirect } from 'react-router-dom';
import SesionService from '../services/SesionService';

const UserStateContext = createContext();
const UserDispatchContext = createContext();

function userReducer(state, action) {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return { ...state, isAuthenticated: true ,idRol:action.idRol};
        case "SIGN_OUT_SUCCESS":
            return { ...state, isAuthenticated: false,idRol:action.idRol };
        case "LOGIN_ERROR":
            return { ...state, isAuthenticated: false,idRol:action.idRol };
        default: {
            throw new Error(`Unhandled action type: ${action.type}`);
        }
    }
}
function UserProvider({ children }) {
    var [state, dispatch] = React.useReducer(userReducer, {
        isAuthenticated: false,
        idRol: JSON.parse(localStorage.getItem("user"))?.idRol || 0
    });

    return (
        <UserStateContext.Provider value={state}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserStateContext.Provider>
    );
}

function useUserState() {
    var context = React.useContext(UserStateContext);
    if (context === undefined) {
        throw new Error("useUserState must be used within a UserProvider");
    }
    return context;
}

function useUserDispatch() {
    var context = React.useContext(UserDispatchContext);
    if (context === undefined) {
        throw new Error("useUserDispatch must be used within a UserProvider");
    }
    return context;
}
function signOut(dispatch, history) {
    localStorage.removeItem("id_token");
    dispatch({ type: "SIGN_OUT_SUCCESS" });
    // history.push("/login");
  }
  
//   function get_Name(setName){
//     // var a= localStorage.getItem('id_token');
//     // console.log(a);
//     setName(nombre_completo);
//   }
// export const UserProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(undefined);

//     useEffect(() => {
//         const checkLoggedIn = async () => {
//             let cuser = SesionService.isAuthenticated();
//             if (cuser === null) {
//                 localStorage.setItem('user', '');
//                 cuser = '';
//             }
//             setCurrentUser(cuser);
//         };

//         checkLoggedIn();
//     }, []);

//     return (
//         <UserContext.Provider value={[currentUser, setCurrentUser]}>
//             {currentUser?.token ? children : <Redirect to="/login" />}
//         </UserContext.Provider>
//     );
// };

export { UserProvider, useUserState, useUserDispatch ,signOut};