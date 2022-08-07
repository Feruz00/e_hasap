import {useEffect, useState, useRef} from 'react';
import axios from 'axios'
import config from '../../config'
import { List, Typography, Avatar, Button, Modal, Input, message } from 'antd';
import {UserOutlined, UserAddOutlined, KeyOutlined, EyeOutlined, EyeInvisibleOutlined} from '@ant-design/icons'
const error = () => {
    message.error('Something wrong went!');
};
const Users = ({user}) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [showPassword, setShowPassword] = useState(true);
    const [username, setUsername] = useState('')
    const [fullName, setFullName] = useState('')
    const [password, setPassword] = useState('')
    const [changeData, setChangeData]  = useState(false)
    const ref = useRef()
    
    const togglePassword = ()=>{
        setShowPassword(!showPassword);
    }
    const handleOk = async () => {
        try {
            await axios({
                method: "POST",
                url: `${config}/api/v1/users/register`,
                withCredentials: true,
                data:{
                    username,
                    fullName,
                    password
                }
            })
            setChangeData(!changeData)
        } catch (error) {
            ref.current.click()
        }
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    useEffect(() => {
        
        const getData = async ()=>{
            setLoading(true)
            try {
                const res = await axios({
                    method: 'GET',
                    url: `${config}/api/v1/users/all`,
                    withCredentials: true
                })    
                setData(res.data)
            } catch (error) {
                console.error(error)
            }
            setLoading(false)
            
        }
        getData()
    }, [changeData]);
    return (
        <>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={ ()=>setIsModalVisible(true) }> <UserAddOutlined /> Add New User </Button>
        </div>
        <Button type='primary' onClick={error} ref={ref} style={{display: 'none'}}>Bas</Button>
                    
        <List
            loading={loading}
            dataSource={data}
            itemLayout="horizontal"
            renderItem={ item=>(
                <List.Item
                    actions={[ <Typography.Link href={`/user/${item.username}`} > Edit </Typography.Link> ]}
                >
                    <List.Item.Meta

                        avatar={item.photo.length > 0 ? 
                            <Avatar src={ `${config}/${item.photo}`} />:
                            <Avatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} icon={<UserOutlined/>}/>
                        }
                        title={ <Typography.Title level={5}>{item.fullName}</Typography.Title> }
                    />
                        
                </List.Item>
            ) }
        >

        </List>
        <Modal title="Add New User?" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
            <Input 
                placeholder='Username' 
                minLength={4} 
                maxLength={30} 
                showCount 
                prefix={<UserOutlined />} 
                size="large" 
                autoComplete="off" 
                value={username}
                onChange={e=>setUsername(e.target.value)}
            />    
                <br />
                <br/>
            <Input 
                placeholder='Full Name' 
                minLength={10} 
                maxLength={50} 
                showCount 
                prefix={<UserOutlined />} 
                size="large" 
                autoComplete="off" 
                value={fullName}
                onChange={e=>setFullName(e.target.value)}
            />
            <br/>
            <br/>
            <Input 
                    onChange={e=>setPassword(e.target.value)}
                    value={password}
                    placeholder='Password' 
                    maxLength={30} 
                    prefix={<KeyOutlined />} 
                    autoComplete="false"
                    size="large" 
                    suffix={showPassword ? <EyeOutlined onClick={togglePassword} />: <EyeInvisibleOutlined  onClick={togglePassword} />} 
                    type={ showPassword ? 'password': 'text' }

            />
        </Modal>
        </>
    );
}

export default Users;
