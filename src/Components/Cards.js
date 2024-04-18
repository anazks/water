import React, { useEffect, useState } from 'react'
import './cards.css'
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { GiWindsock } from "react-icons/gi";
import {dataRef} from '../firebase'
import { GiLevelEndFlag } from "react-icons/gi";
import Axios from '../Axios'
function Cards() {
  const [temp,setTemp] =useState('')
  const [hum,setHum] = useState('')
  const [lvl,setLvl] = useState('')

  useEffect(() => {
          dataRef.ref().child('test').on('value',(data)=>{
          const getData = Object.values(data.val())
          console.log(getData,"---------")
          setTemp(getData[0])
          setHum(getData[1])
          setLvl(getData[2])
        })
        Axios.get('/comments').then((response)=>{
            console.log(response)
        })
  }, [])
  
  return (
    <div className='cards'>
        <div className='card'>
            <WiHumidity style={{fontSize:"30px"}} />
            <h2>{temp}</h2>
        </div>
        <div className='card'> 
            <FaTemperatureHigh style={{fontSize:"30px"}}/>
            <h2>{hum}</h2>
        </div>
        <div className='card'>
          <GiLevelEndFlag  style={{fontSize:"30px"}}/>
            <h2>{lvl}</h2>
        </div>
    </div>
  )
}

export default Cards