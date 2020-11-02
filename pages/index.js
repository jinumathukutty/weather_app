import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Form, Input, Button, Checkbox ,Typography,Card,Alert} from 'antd';
import Select from "react-select";
import React, { useState, useEffect } from "react";
import data from './api/data.json';
import constants from '../constants'
const { Title } = Typography;
const { Option } = Select;
let Dashboard=[];
const api_key = '2ab64c19dde9401081d80622200111';
const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 40,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 50,
  },
};

export default function Home() {

  const [country, setCountry] = useState(null);
  const [city, setCity] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [dashboardDetails,setDashboardDetails] = useState([])
  const handleCountryChange = (obj) => {
    setCountry(obj);
    setCityList(obj.cities);
    setCity(null);
  };
console.log(dashboardDetails)
  const onFinish = async (values) => {
    let res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${values.country.region}`);
    let token = await res.json();
    token.link = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${values.country.region}`;
 
    let index = dashboardDetails.findIndex(x => x.location.country==values.country.region)
    if (index === -1){
      setDashboardDetails(oldArray => [...oldArray, token]);
    }
}

const handleCityChange = (obj) => {
  setCity(obj);
};
const handleRemove = (id) => {
  const newList = dashboardDetails.filter((item) => item.location.country !== id);
  setDashboardDetails(newList);
};
  return (
    <>
    <Title>Sample Weather App</Title>
    <div className={styles.container}>
      
    <Form {...layout} name="control-ref" onFinish={onFinish}>
        
        <Form.Item
          name="country"
          label="Country"
          rules={[
            {
              required: true,
            },
          ]} 
        >
          <Select
          placeholder="Select Country"
          value={country}
          options={data}
          onChange={handleCountryChange}
          getOptionLabel={x => x.region}
          getOptionValue={x => x.country_code}
        />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          
        </Form.Item>
      </Form>
    </div>
      {dashboardDetails.length?
      dashboardDetails.map(item  =>{
        return (<Card title={item.location.country} extra={<a href={item.link} target="_blank">Details</a>} style={{ width: 300 }}>
                <p>{item.location.localtime}</p>
                <p>{item.location.region}</p>
                <p>{item.location.tz_id}</p>
                <Button danger onClick={() => handleRemove(item.location.country)}>Delete</Button>

            </Card>)    
      }):null}
    </>
  )
}
