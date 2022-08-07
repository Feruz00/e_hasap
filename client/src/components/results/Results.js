import {useState, useRef, useEffect} from 'react';
import moment from 'moment'
import {Calendar, Input, Typography, message, Button, Divider, Avatar, Table} from 'antd'
import {UserOutlined} from '@ant-design/icons'
import calculateTime from '../../calculateTime';
import axios from 'axios'
import config from '../../config'
const error = () => {
    message.error('Something wrong went!');
};
const Results = () => {
    const [start, setStart] = useState(moment(Date.now()))
    const [finish, setFinish] = useState(moment(Date.now()))
    const [user, setUser] = useState('')
    const [name, setName] = useState('')
    
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])
    const ref = useRef()
    const handleChange1 = e =>{
        setStart(e);
    }
    const handleChange2 = e =>{
        setFinish(e);
    }
    
    useEffect(() => {
        setLoading(true)
        let cancel;
        const getData = async ()=>{
            cancel && cancel()
            const CancelToken = axios.CancelToken;
            try {
                const form = new FormData()
                
                const nw1 = await moment(start).toDate()
                const nw2 = await moment(finish).toDate()
                form.append('start', nw1)
                form.append('finish', nw2)
                form.append('name', name)
                
                const res = await axios({
                    method: "POST",
                    url: `${config}/api/v1/otag/all`,
                    data:{
                        start: nw1,
                        finish: nw2,
                        name
                    },
                    withCredentials: true,
                    cancelToken: new CancelToken(canceler => {
                        cancel = canceler;
                    })
                })
                setData(res.data)
                console.log(res.data)
            } catch (error) {
                console.error(error)
                ref.current.click()
            }
        }   
        getData();
        setLoading(false)
    }, [start, finish, user, name]);

    return (
        <div style={{width:'100%', paddingLeft: '2rem'}}>
        
        <Button style={{display: 'none'}} ref={ref} onClick={error} />
            <div style={{width:'100%', display:'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                <div>
                    <Typography.Title level={5}> Select starting date: {' '} </Typography.Title>
                    <div className="site-calendar-demo-card">
                        <Calendar fullscreen={false} onChange={handleChange1} value={start} />
                    </div>
                </div>
                <div>
                    <Typography.Title level={5}> Select finish date: {' '} </Typography.Title>
                    <div className="site-calendar-demo-card">
                        <Calendar fullscreen={false} onChange={handleChange2} value={finish} />
                    </div>
                </div>
                
            </div>
            <br/>
            <div style={{width:'100%', display:'flex', flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                <div style={{width: '50%', marginLeft: '1rem'}} >
                    <Typography.Title level={5}>What search you?</Typography.Title>
                    <Input placeholder='Write' value={name} onChange={e=>setName(e.target.value)} />

                </div>
                
            </div>
            <Divider />
            <Table
                loading={loading}
                dataSource={data}
            >
                <Table.ColumnGroup title="Approved">
                    <Table.Column title="Photo" dataIndex="bellik" key="feruz"  render={text=>
                    
                    (
                           text.photo.length > 0 ? <Avatar src={ `${config}/${text.photo}`} />:
                        <Avatar style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} icon={<UserOutlined/>}/>
                    )
                    }

                    />
                    <Table.Column title="Name" dataIndex="bellik" key="fullName" render={text=>(
                        <Typography.Title level={5}>{ text.fullName }</Typography.Title>
                    )} />
                </Table.ColumnGroup>
               
                <Table.Column title="Starting time" dataIndex="start" key="start" render={text=>calculateTime(text)} />
                <Table.Column title="End time" dataIndex="finish" key="finish" render={text=>calculateTime(text)} />
                <Table.Column title="Information user" dataIndex="name" key="name" />
                <Table.Column title="Type of user" dataIndex="dereje" key="dereje" />
                <Table.Column title="Description" dataIndex="description" key="description" />
                <Table.Column title="Which computer use" dataIndex="compNumber" key="compNumber" />
                
                
            </Table>
            
        </div>
    );
}

export default Results;
