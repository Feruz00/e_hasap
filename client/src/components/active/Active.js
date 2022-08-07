import {useEffect, useRef, useState, useMemo} from 'react';

import {Button, List, Typography, Modal,Input, Select, message, Table} from 'antd'
import calculateTime from '../../calculateTime';
import axios from 'axios';
import config from '../../config'
const error = () => {
    message.error('Something wrong went!');
};
const success = () => {
    message.success('Success');
};
const Active = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    const [comNumber, setComNumber] = useState(10);

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [compNumber, setCompNumber] = useState(0)
    const [dereje, setDereje] = useState('')
    const ref  = useRef()
    const person = useRef()

    const [change, setChange] = useState(false)

    const comps = useMemo(()=>{
        let arr = []
        for (let index = 1; index <= comNumber; index++){
            if( data.filter( i=>i.compNumber === index ).length  === 0 ) arr.push(index)
        }

        return arr
    }, [data])

    useEffect( ()=>{
        setLoading(true);
        const getData = async ()=>{
            try {
                const res = await axios({
                    method: "GET",
                    url: `${config}/api/v1/otag`,
                    withCredentials: true
                })
                setData(res.data)
            } catch (error) {
                
            ref.current.click()
            }
        }
        const getNum = async ()=>{
            try {
                const res = await axios({
                    method: "GET",
                    url: `${config}/api/v1/otag/laptop`,
                    withCredentials: true
                })
                setComNumber(res.data)
            } catch (error) {
                
                ref.current.click()
            }
        }
        
        getData()
        getNum()
        setLoading(false);
        setName('')
        setDescription('')
        setDereje('')

    },[change] )

    async function handleOk() {
        
        try {

            await axios({
                method: "POST",
                url: `${config}/api/v1/otag`,
                data:{
                    name,
                    description,
                    compNumber,
                    dereje
                },
                withCredentials: true
            })
            person.current.click()
            setChange(!change)
        } catch (error) {
            ref.current.click()
        }

        setIsModalVisible(false);
        
    }

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleCyk = async (_id)=>{
        try{
            await axios({
                method: "PUT",
                url: `${config}/api/v1/otag/upd`,
                data:{
                    id:_id
                },
               withCredentials: true
            })
        
            person.current.click()
            setChange(!change)
        
        }
        catch (error) {
            ref.current.click()
        }

    }
    return (
        <div style={{width:'90%', paddingLeft: '2rem'}}>
            <Button style={{display: 'none'}} ref={ref} onClick={error} />
            <Button style={{display: 'none'}} ref={person} onClick={success} />
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Button type='primary' onClick={()=>setIsModalVisible(true)}> Add New </Button>
            </div>
            <br/>
            
            <Table
                loading={loading}
                dataSource={data}
                pagination={false}
            >
                <Table.Column title="Starting time" dataIndex="start" key="start" render={ text=>calculateTime(text) } />
                <Table.Column title="Full name" dataIndex="name" key="name" />
                <Table.Column title="Degree" dataIndex="dereje" key="dereje" />
                <Table.Column title="Description" dataIndex="description" key="description" />
                <Table.Column title="Which computer" dataIndex="compNumber" key="compNumber" />
                <Table.Column title="Go out" key="go_ouy" render={ (item)=>(<Typography.Link onClick={()=>handleCyk(item._id)}> Cykdymy? </Typography.Link>) } />
            </Table>


{/*             
            <List
                loading={loading}
                header={<Typography.Title level={5}> Active page </Typography.Title>}
                bordered
                dataSource={data}
                renderItem={item=>(
                    <List.Item>
                        <Typography.Text> {calculateTime(item.start)} </Typography.Text>
                        <Typography.Text> {item.name} </Typography.Text>
                        <Typography.Text> {item.dereje} </Typography.Text>
                        
                        <Typography.Text> {item.description} </Typography.Text>
                        <Typography.Text> Computer: {item.compNumber}</Typography.Text>
                        <Typography.Link onClick={()=>handleCyk(item._id)}> Cykdymy? </Typography.Link>
                        
                    </List.Item>
                )}
            >

            </List> */}
            <Modal title="Add New" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Input 
                    maxLength={50}
                    showCount
                    placeholder='Full Name'
                    value={name}
                    onChange={ (e)=>setName(e.target.value) }
                />
                <br/>
                <br/>

                <Input 
                    maxLength={30}
                    showCount
                    placeholder='Degree'
                    value={dereje}
                    onChange={ (e)=>setDereje(e.target.value) }
                />
                <br/>
                <br/>
                    <Typography.Text> Select Computer: </Typography.Text>
                    <Select onChange={e=>setCompNumber(e)} defaultValue={ comps.length > 0 ? comps[0]: 'You cannot select computer' }>
                        {
                            comps.map( i=>{
                                return <Select.Option key={i} value={i}>{i} </Select.Option>
                            } )
                        }
                    </Select>
                <br/>
                <br/>
                
                <Input.TextArea rows={5} placeholder="Add description" value={description} onChange={e=>setDescription(e.target.value)} >

                </Input.TextArea>
            </Modal>
        </div>
    );
}

export default Active;
