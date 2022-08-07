import {useRef, useEffect, useState} from 'react';
import {Button, message, Table, Typography, Space} from 'antd'
import axios from 'axios';
import config from '../../config'
import calculateTime from '../../calculateTime';
const error = () => {
    message.error('Something wrong went!');
};
const columns = [
    {
        title: 'Full name',
        dataIndex: 'fullName',
        key: 'fullName'
    },
    {
        title: 'Phono number',
        dataIndex: 'number',
        key: 'number',
        render: text=>`+993 ${text}`
    },
    {
        title: 'Sent date',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: text=>calculateTime(text)
    }
]
const Habarlar = ({messages, setMessages}) => {
    const ref = useRef()
    const [loading, setLoading] = useState(true)
    useEffect( ()=>{
        document.title='Messages'
        setLoading(true)
        const getData = async ()=>{
            try {
                const res = await axios({
                    method: "GET",
                    url: `${config}/api/v1/otag/messages`,
                    withCredentials: true
                }) 
                setMessages(res.data)
            } catch (error) {
                console.error(error)
                ref.current.click()
            }
        }
        getData()
        setLoading(false)
        return async ()=>{
            try {
                await axios({
                    method: "PUT",
                    url: `${config}/api/v1/otag/messages`,
                    withCredentials: true
                }) 
                setMessages([])
            } catch (error) {
                console.error(error)
                ref.current.click()
            }
        }
    },[] )
    return (
        <>
            <Button type='primary' onClick={error} ref={ref} style={{display: 'none'}}>Bas</Button>        
            <Table loading={loading} dataSource={messages} columns={columns} pagination={false} />
        </>
    );
}

export default Habarlar;
