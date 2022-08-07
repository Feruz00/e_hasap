import React, {  useContext,useEffect,useMemo,useState} from 'react';

import axios from 'axios';

import {LoadingOutlined} from '@ant-design/icons'
import config from './config';

const AuthContext = React.createContext();

export const Auth = ()=>useContext(AuthContext);

export const AuthProvider = ({children})=>{

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
       
    
    useEffect( ()=>{
        const getData = async ()=>{
            const ENDPOINT = config+"/api/v1/users/auth";
            await axios({
                url: ENDPOINT,
                method: "GET",
                withCredentials: true
            }).then(res=>{
                if(res.data.isAuth === false) setUser(null);
                else setUser(res.data);
            }).catch(err=>{
                console.log(err);
            });
            setLoading(false);
        }
        getData();
    },[]);

    const providerValue = useMemo( ()=>({user,setUser}), [user,setUser] );    
    
    return (
    <AuthContext.Provider value={providerValue}>
        {
            loading ?
            <div className="site-card-border-less-wrapper">
                <LoadingOutlined style={{ fontSize: '2rem' , marginTop: '5rem'}}/>
            </div>:
            children
        }
    </AuthContext.Provider>
    );
}
