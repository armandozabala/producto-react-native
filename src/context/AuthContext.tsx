import React, { createContext, useEffect, useReducer } from "react";
import cafeApi from "../api/cafeApi";
import { LoginResponse, Usuario, LoginData, RegisterData } from '../interfaces/appInterfaces';
import { authReducer, AuthState } from './authReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: ( registerData: RegisterData ) => void;
    signIn: ( loginData: LoginData ) => void;
    logOut: () => void;
    removeError: () => void;

}

const authInitialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}


export const AuthContext = createContext({} as AuthContextProps);


export const AuthProvider = ({ children }: any) => {


    const [ state, dispatch ] = useReducer( authReducer, authInitialState);

    useEffect(() => {

        checkToken();

    },[])

    const checkToken = async () => {

        const token = await AsyncStorage.getItem('token');
        if(!token) return dispatch({ type: 'notAuthenticated'});

        const resp = await cafeApi.get('/auth')

        if( resp.status !== 200){
            return dispatch({ type: 'notAuthenticated'});
        }

        await AsyncStorage.setItem('token',resp.data.token);

        dispatch({ 
            type: 'signUp',
            payload:{
                token: resp.data.token,
                user: resp.data.usuario
            }
        })

    }

    const signUp = async ({ nombre, correo, password}: RegisterData ) => {

        try {
            const { data } = await cafeApi.post<LoginResponse>('/usuarios',{
                 correo,
                 password,
                 nombre
            });
            
            console.log(data)
            dispatch({ 
                type: 'signUp',
                payload:{
                    token: data.token,
                    user: data.usuario
                }
            })

            await AsyncStorage.setItem('token',data.token);

        } catch (error) {
            console.log(error.response.data.msg);
            dispatch({
                 type: 'addError',
                 payload: error.response.data.errors[0].msg || 'Revise la información'
            })
        }


    };
    
    const signIn = async ( { correo, password }: LoginData ) => { 
        try {
            const { data } = await cafeApi.post<LoginResponse>('/auth/login',{
                 correo,
                 password
            });
            
            console.log(data)
            dispatch({ 
                type: 'signUp',
                payload:{
                    token: data.token,
                    user: data.usuario
                }
            })

            await AsyncStorage.setItem('token',data.token);

        } catch (error) {
            console.log(error.response.data.msg);
            dispatch({
                 type: 'addError',
                 payload: error.response.data.msg || 'Informacion incorrecta'
            })
        }

    };
    
    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout'})
    };

    const removeError =  () => {
        dispatch({ type: 'removeError'});
    };


    return(
             <AuthContext.Provider value={{
                   ...state,
                   signIn,
                   signUp,
                   logOut,
                   removeError
               }}>
                  {children}
             </AuthContext.Provider>
        )
}


