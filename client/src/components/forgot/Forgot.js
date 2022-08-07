import {useState, useEffect, useRef} from 'react';
import {Button, Card, Input, Typography, message} from 'antd'
import { UserOutlined  } from '@ant-design/icons';
import axios from 'axios'
import config from '../../config';

// 64245584 kamila ysmatullayewa

const { TextArea } = Input;

const error = () => {
    message.error('Something wrong went! Try again!');
};
const success = () => {
    message.success('Successfully send message. Please wait answer admin!');
};
const Forgot = () => {
    const [fullName, setFullName] = useState('')
    const [number, setNumber] = useState('')
    const [description, setDescription] = useState('')

    const ref = useRef()
    const sucessref = useRef()
    


    const handleSubmit = async ()=>{
        try {
            
            await axios({
                method: "POST",
                url: `${config}/api/v1/users/message`,
                data: {
                    fullName,
                    number,
                    description
                },
                withCredentials: true
            })            

            sucessref.current.click()
        } catch (error) {
            ref.current.click()   
        }
    }

    useEffect( ()=>{
        document.title='Forgot password'
    },[] )
    return (
        <div className="site-card-border-less-wrapper">
            <Card title="Forgot Password?" bordered={false} style={{ width: 600 }}>
                <Typography.Title level={5}> Send message admin: </Typography.Title>
                <br />
                
                <Input 
                    onChange={e=>setFullName(e.target.value)}
                    value={fullName}
                    placeholder='Full Name' maxLength={50} showCount prefix={<UserOutlined />} size="large" autoComplete={false} />
                <br />
                <br/>
                <Input addonBefore="+993" size='large' maxLength={8} onChange={ e=>{
                    const {value} = e.target;
                    let ok = true;
                    for(let i=0;i<value.length;i++){
                        if( !(value[i] >='0' && value[i]<='9') ) ok = false
                    }
                    if(ok)setNumber(value)
                } } 
                    value={number}
                />
                <br />
                <br />
                
                <Typography.Text> Add description: </Typography.Text>
                <TextArea maxLength={3000} showCount onChange={e=>setDescription(e.target.value)} rows={4} />
                <br/>
                <br/>
                <div style={{display:'flex', alignItems:'center', width: '100%', justifyContent: 'space-between' }}>
                    <Typography.Link href='/login'> Login </Typography.Link>
                    <Button 
                        type='primary' 
                        size='large'
                        style={{cursor: 'pointer'}} 
                        // disabled={username.length === 0 || password.length === 0}    
                        onClick={handleSubmit}
                    >Submit</Button>
                    <Button type='primary' onClick={error} ref={ref} style={{display: 'none'}}>Bas</Button>
                    <Button type='primary' onClick={success} ref={sucessref} style={{display: 'none'}}>Bas</Button>
                    
                </div>
            </Card>
        </div>
        
    );
}

export default Forgot;
