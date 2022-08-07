import {useState, useRef, useEffect} from 'react';
import {useParams} from 'react-router-dom'
import {Button, Avatar, Typography, message, Card, Input, Space} from 'antd'
import axios from 'axios'
import config from '../../config'
import {UserOutlined,LoadingOutlined,KeyOutlined, EyeOutlined, EyeInvisibleOutlined} from '@ant-design/icons'

const error = () => {
    message.error('Something wrong went. Try again!');
};

const success = () => {
    message.success('Successfully updated password!');
};


const Settings = () => {
    const {username} = useParams()
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true);
    const ref = useRef()
    const person = useRef()
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(true);
    
    const togglePassword = ()=>{
        setShowPassword(!showPassword);
    }
    
    const handleSubmit = async ()=>{
        try {
            await axios({
                method: "POST",
                url: `${config}/api/v1/users/forgot_confirm`,
                data:{
                    username,
                    newPassword: password
                }
            })

            person.current.click()
        } catch (error) {
            ref.current.click()
        }
    }

    useEffect(() => {

        const getData = async ()=>{
            setLoading(true)
            
            try {
                
                const res = await axios({
                    method: "GET",
                    url: `${config}/api/v1/users/tap/${username}`
                })
                setData(res.data)
            } catch (error) {
                ref.current.click()
            }
            
            setLoading(false)

        }
        getData()
    }, [username]);
    
    return (
        <div className='site-card'>
            <Button ref={ref} onClick={error}  style={{display: 'none'}}/>
            <Button ref={person} onClick={success}  style={{display: 'none'}}/>
            
            {
                loading ? <LoadingOutlined style={{ fontSize: '3rem' }} /> : 
                <Card style={{ width: '90%', height: '90%' }} title={ <Typography.Title level={5}> { data.fullName } </Typography.Title> } >
                    <Space direction='hozizontal'>
                        {
                            data.photo.length > 0 ?
                            <Avatar src={`${config}/${data.photo}`} size="large" />:
                            <Avatar icon={<UserOutlined />} size="large" />
                        }
                        <p> {data.username} </p>
                    </Space>
                    <br/>
                    <br/>
                    <Input 
                        onChange={e=>setPassword(e.target.value)}
                        value={password}
                        placeholder='Set Password' 
                        maxLength={30} 
                        prefix={<KeyOutlined />} 
                        autoComplete="false"
                        size="large" 
                        suffix={showPassword ? <EyeOutlined onClick={togglePassword} />: <EyeInvisibleOutlined  onClick={togglePassword} />} 
                        type={ showPassword ? 'password': 'text' }
                    />
                    <br/>
                    <br/>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between'  }}>
                        <Typography.Link href='/'> Go Back </Typography.Link>
                        <Button type='primary' onClick={handleSubmit} disabled={ password.length < 5 } > Change Password </Button>
                    </div>
                </Card>
            }

        </div>
        
    );
}

export default Settings;
