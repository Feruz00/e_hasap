import {useState, useRef} from 'react';
import {Button, Divider, Input, Typography, message, Image, InputNumber} from 'antd'
import axios from 'axios'
import config from '../../config'
import {useDropzone} from 'react-dropzone'
import {UserOutlined, KeyOutlined, EyeOutlined, EyeInvisibleOutlined , PlusOutlined} from '@ant-design/icons'
const error = () => {
    message.error('Invalid data!');
};
const error_upload = () => {
    message.error('Something wrong went. Try again!');
};

const success_person = () => {
    message.success('Successfully updated personal information!');
};

const success_password = () => {
    message.success('Successfully updated passwords');
};
const success_number = () => {
    message.success('Successfully updated number of computers');
};
const success_upload = () => {
    message.success('Successfully uploaded your photo.');
};

const Me = ({user}) => {
    const [showPassword, setShowPassword] = useState(true);
    const [showPassword2, setShowPassword2] = useState(true);
    
    const [username, setUsername] = useState(user.username)
    const [fullName, setFullName] = useState(user.fullName)
    const [password, setPassword] = useState('')
    const [passwordcon, setPasswordcon] = useState('')
    
    const [compNum, setCompNum] = useState('');

    const ref = useRef()
    const person = useRef()
    const pass = useRef()
    const surat = useRef()
    const errsurat = useRef()
    const numbercomp = useRef()

    const togglePassword = ()=>{
        setShowPassword(!showPassword);
    }
    const togglePassword2 = ()=>{
        setShowPassword2(!showPassword2);
    }
    const handleSubmit = async()=>{
        try {
            await axios({
                method: 'POST',
                url: `${config}/api/v1/users/update`,
                withCredentials: true,
                data:{
                    username,
                    fullName
                }
            })
            person.current.click()
        } catch (error) {
            ref.current.click()
        }
    }
    const handlePassword = async()=>{
        try {
            await axios({
                method: 'PATCH',
                url: `${config}/api/v1/users/change`,
                withCredentials: true,
                data:{
                    oldPassword: password, 
                    newPassword: passwordcon
                }
            })
            pass.current.click()
        } catch (error) {
            ref.current.click()
        }
    }

    const [file, setFile] = useState(null)
    const {
        getRootProps, 
        getInputProps,
    } = useDropzone({
        accept:'image/*', 
        multiple: false,
        onDrop: acceptedFiles => {
            setFile(acceptedFiles.map(prev => Object.assign(prev, {
              preview: URL.createObjectURL(prev)
            })));
        }
    });

    async function handleUpload(){
        
        const form = new FormData();
        form.append('file', file[0]);
        try {
            await axios({
                method: "POST",
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                url:config+'/api/v1/users/picture' ,
                data: form,
                withCredentials:true
            })
            surat.current.click()
            
            window.location.reload();
        } catch (error) {
            errsurat.current.click()
        }
    }
    const handleSan = async ()=>{
        try {
            await axios({
                method: "POST",
                url: `${config}/api/v1/users/comp`,
                withCredentials: true,
                data:{
                    comp: compNum
                }
            })
            numbercomp.current.click()
        } catch (error) {
            console.error(error)
            errsurat.current.click()
        }
    }
    return (
        <>

            <Button type='primary' onClick={error} ref={ref} style={{display: 'none'}}>Bas</Button>
            <Button type='primary' onClick={error_upload} ref={errsurat} style={{display: 'none'}}>Bas</Button>
            <Button type='primary' onClick={success_person} ref={person} style={{display: 'none'}}>Bas</Button>
            <Button type='primary' onClick={success_password} ref={pass} style={{display: 'none'}}>Bas</Button>
            <Button type='primary' onClick={success_upload} ref={surat} style={{display: 'none'}}>Bas</Button>
            <Button type='primary' onClick={success_number} ref={numbercomp} style={{display: 'none'}}>Bas</Button>
            
            {
                user.role === 'admin' && <div style={{ display: 'flex', flexDirection: 'row', width:'60%', alignItems: 'center' }}>
                <Typography.Title level={5}> Number of computers: </Typography.Title>
                <InputNumber size='large' min={5} max={100} defaultValue={6} onChange={e=>setCompNum(e)} style={{marginLeft: '1rem'}} />
                <Button style={{ marginLeft: '3rem' }} type="primary" onClick={handleSan}>Change numbers</Button>
            </div>
            }
            

            <Divider />    
            <div style={{width:'60%', paddingLeft: '2rem'}} >
            <Typography.Title level={5}> Change Personal Information </Typography.Title>
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

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type='primary' disabled={ username.length === 0 || fullName.length === 0 }
                        onClick={ handleSubmit }
                    >Change</Button>
                </div>    

            </div>
            <Divider />
            <div style={{width:'60%', paddingLeft: '2rem'}} >
                <Typography.Title level={5}> Update your password </Typography.Title>
                <Input 
                    onChange={e=>setPassword(e.target.value)}
                    value={password}
                    placeholder='Old Password' 
                    maxLength={30} 
                    prefix={<KeyOutlined />} 
                    autoComplete="false"
                    size="large" 
                    suffix={showPassword ? <EyeOutlined onClick={togglePassword} />: <EyeInvisibleOutlined  onClick={togglePassword} />} 
                    type={ showPassword ? 'password': 'text' }
                />
                <br/>
                <br/>
                <Input 
                    onChange={e=>setPasswordcon(e.target.value)}
                    value={passwordcon}
                    placeholder='New Password' 
                    maxLength={30} 
                    prefix={<KeyOutlined />} 
                    autoComplete="false"
                    size="large" 
                    suffix={showPassword2 ? <EyeOutlined onClick={togglePassword2} />: <EyeInvisibleOutlined  onClick={togglePassword2} />} 
                    type={ showPassword2 ? 'password': 'text' }
                />
                <br/>
                <br/>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type='primary' disabled={ password.length < 5 || passwordcon.length <5  }
                        onClick={ handlePassword }
                    >Change Password</Button>
                </div>   
            </div>
            <Divider />
            <div style={{width:'60%', paddingLeft: '2rem'}}>
                <Typography.Title level={5}> Upload your photo </Typography.Title>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }} >
                <div {...getRootProps({className:'dropzone'})}>
                    <input {...getInputProps()} />
                    <PlusOutlined style={{ fontSize: '3rem' , color: 'lightgray' }} />
                </div>
                {file && <Image src={file[0].preview} alt="Picture" preview={true} style={{ width: '10rem', height: '10rem' }} />}
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type='primary' disabled={ !file  }
                        onClick={ handleUpload }
                    >Upload Picture</Button>
                </div>   
            </div>
            

        </>
    );
}

export default Me;
