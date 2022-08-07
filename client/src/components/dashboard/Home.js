import { Card, Space, Avatar, Menu , Typography, Tag, Button, message, Badge} from 'antd';
import {useRef, useEffect, useState} from 'react';
import {UserOutlined, CalendarOutlined,BarChartOutlined, SettingOutlined,MessageOutlined} from '@ant-design/icons'
import {Auth} from '../../context'
import config from '../../config'
import axios from 'axios'
import Users from '../users/Users';
import Me from '../settings/Me';
import Active from '../active/Active';
import Results from '../results/Results';
import Habarlar from '../messages/message';
const error = () => {
    message.error('Something wrong went!');
};
const Home = () => {
    const {user} = Auth()
    const ref = useRef()
    const [current, setCurrent] = useState( user.role === 'admin' ? 'users': 'active');
    const [messages, setMessages] = useState([]);
    const logout = async ()=>{
        try {
            
            await axios({
                method: "GET",
                url: `${config}/api/v1/users/logout`,
                withCredentials: true
            })
            window.location.reload();
        } catch (error) {
            ref.current.click()    
        }

    }
    useEffect( ()=>{
        document.title='Home'
        const getData = async ()=>{
            try {
                const res = await axios({
                    method: "GET",
                    url: `${config}/api/v1/otag/messages`,
                    withCredentials: true
                }) 
                setMessages(res.data);
                console.log(res.data)
            } catch (error) {
                console.error(error)
                ref.current.click()
            }
        }
        if(user.role === 'admin')getData()
    },[] )
    return (
        <div className='site-card'>
            <Button type='primary' onClick={error} ref={ref} style={{display: 'none'}}>Bas</Button>        
            <Card title={ 
                <Space direction='horizontal'>
                    {user.photo.length > 0 ? 
                        <Avatar src={ `${config}/${user.photo}`} />:
                        <Avatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} icon={<UserOutlined/>}/>
                    }
                    <Typography.Title level={5}> {user.fullName} <Tag color={user.role === 'admin'? '#108ee9': '#87d068'}> {user.role} </Tag> </Typography.Title>
                </Space>
            }
            style={{width: '90%', height: '100%'}}
            extra={ <Button onClick={logout} type='link'>Logout</Button> }
            >
                <Menu mode='horizontal' selectedKeys={[current]} onClick={ e=>setCurrent(e.key) }>
                    { user.role === 'admin' && <Menu.Item key="users" icon={<UserOutlined />}>
                        Users
                    </Menu.Item> }
                    <Menu.Item key="active" icon={<BarChartOutlined />}>
                        Active
                    </Menu.Item>
                    <Menu.Item key="results" icon={<CalendarOutlined />}>
                        Results
                    </Menu.Item>

                    <Menu.Item key="settings" icon={<SettingOutlined />}>
                        Settings
                    </Menu.Item>    
                    {
                        user.role === 'admin' && <Menu.Item key="messages" icon={<MessageOutlined />}>
                            <Badge  count={messages.length} style={{ backgroundColor: '#2db7f5' }}>
                                <Typography.Paragraph style={{ marginTop: '.5rem' }}> Messages </Typography.Paragraph>
                            </Badge>
                            
                        </Menu.Item>   
                    }
                    
                </Menu>
                <br/>

                {
                    current === 'users' && <Users user={user} />
                }
                {
                    current === 'settings' && <Me user={user} />
                }
                {
                    current === 'active' && <Active />
                }
                {
                    current === 'results' && <Results />
                }
                {
                    current === 'messages' && <Habarlar messages={messages} setMessages={setMessages} />
                }
            </Card>
        </div>
    );
}

export default Home;
