import React, { useEffect, useState } from 'react';
import './cards.css';
import './level.css'
import { FaTemperatureHigh } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { GiWindsock } from "react-icons/gi";
import { dataRef } from '../firebase';
import { TiWeatherCloudy } from "react-icons/ti";
import { GiLevelEndFlag } from "react-icons/gi";
import Axios from '../Axios';
import Level from './Level';
function Cards() {
  const [temp, setTemp] = useState('');
  const [hum, setHum] = useState('');
  const [lvl, setLvl] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [prediction, setPrediction] = useState({});
  const [wind, setWind] = useState(null);
  const [rainfall, setRainfall] = useState(null); // New state for rainfall prediction
  const API_KEY = '076465d2e663be277c6d13a3991ca3b6';
  const [showP,setP] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      dataRef.ref().child('test').on('value', (data) => {
        const getData = Object.values(data.val());
        console.log(getData, "---------");
        setTemp(getData[0]);
        setHum(getData[1]);
        setLvl(getData[2]);
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
            Axios.get(`/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&APPID=${API_KEY}`).then((response)=>{
              console.log(response, "cloud data")
              setPrediction(response.data.main);
              setWind(response.data.wind);
            });

            Axios.get(`/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&exclude=current,minutely,hourly&appid=${API_KEY}`)
              .then((response2)=>{
                console.log(response2,"response2")
              })
              .catch(error => {
                console.error('Error fetching rainfall data:', error);
              });
          },
          error => {
            console.error('Error getting location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by your browser');
      }
    };

    fetchData();
  }, []);
  const showPrediction  = ()=>{
    console.log(showP,"before")
    setP(true)
    console.log(showP,"after")

  }

  return (
    <>
      <div className='cards'>
        <div className='card'>
          <WiHumidity style={{fontSize:"100px"}} />
          <h2>{temp}</h2>
        </div>
        <div className='card'> 
          <FaTemperatureHigh style={{fontSize:"100px"}}/>
          <h2>{hum} %</h2>
        </div>
        <div className='card'>
          <GiLevelEndFlag  style={{fontSize:"100px"}}/>
          <h2>{lvl}</h2>
        </div>
        
      </div>
     <div className='Buttons'>
          <button className='PrdtBtn' onClick={showPrediction}>Predict</button>
     </div>
   
      <h1 className='PREDICTION_HEADING'>PREDICTION RESULT</h1>
              {
                showP ?
                <div className='Prediction'>

                <>
                  <div className='pressure'> <h4 style={{color:'black'}}><span> Max Temparature</span>:<b>{prediction.temp_max}</b></h4> </div>
                  <div className='pressure'> <h4 style={{color:'black'}}><span> Min Temparature</span>:<b>{prediction.temp_min}</b></h4> </div>
                  <div className='pressure'> <h4 style={{color:'black'}}><span>Pressure</span>:<b>{prediction.pressure}</b></h4> </div>
      
                 
                  {
                    wind ?
                    <>
                    <div className='pressure'> <h4 style={{color:'black'}}><span>Wind speed</span>:<b>{wind.speed} kh/h </b> </h4> </div>
                    <div className='pressure'> <h4 style={{color:'black'}}><span>Degree</span>:<b>{wind.deg}</b></h4> </div>
                    <div className='pressure'> <h4 style={{color:'black'}}><span>Clear Sky</span>:<b>{prediction.feels_like}% <span></span></b></h4> </div>
      
                    </>
                    : ""
                  } 
                
      
      
                 
                </>
              </div> : ''
              }
    </>
  );
}

export default Cards;
