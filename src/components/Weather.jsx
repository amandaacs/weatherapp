import './Weather.css';
import { Input, Alert,Card } from 'antd';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import {  useRef, useState } from 'react';




const Weather = () => {

    const inputRef = useRef();
    const [searchEmpty, setSearchEmpty] = useState(false);

    const [weatherData, setWeatherData] = useState(false);

    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    }

    const search = async (city) => {

        if (!city) {
            setSearchEmpty(true);
            return;
        }
        setSearchEmpty(false);
        console.log(`Searching for: ${city}`);
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok){
                setSearchEmpty(true);
                return;
            }
            console.log(data);
            const icon = allIcons[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });
        } catch (error) {
            setWeatherData(false);
            console.error(error);
        }
    }

    

  return (

    
    <div className='weather'>
        
        <div className="search-bar">
            <Input.Search ref={inputRef} className='search-input' onSearch={() => {
                const city = inputRef.current.input.value; 
                console.log(`Input value: ${city}`); 
                search(city);
            }} />
            <div className="alert-container">
                {searchEmpty && (
                    <Alert message="Cidade Inválida" type="warning" showIcon closable afterClose={() => setSearchEmpty(false)}/>
                )}
            </div>
        </div>
        {weatherData?<>
            <img src={weatherData.icon} alt="" className='weather-icon' />
        <p className='temperature'>{weatherData.temperature}<span className='degrees'>°C</span></p>
        <p className='location'>{weatherData.location}</p>
        <div className="weather-data">
            <div className="col">
                <img src={humidity_icon} alt="" />
                <div>
                    <p className='col-info'>{weatherData.humidity} %</p>
                    <span>Humidade</span>
                </div>
            </div>
            <div className="col">
                <img src={wind_icon} alt="" />
                <div>
                    <p  className='col-info'>{weatherData.windSpeed} km/h</p>
                    <span>Vel. do vento</span>
                </div>
            </div>
        </div>
        </>:<>
        <Card
            style={{
                width: 250,
                backgroundColor: 'transparent',
                color: '#fff',
                textAlign: 'center',
                fontWeight: 'bold'
            }}
        >
            <p>Insira o nome da cidade</p>
    
        </Card>
        </>}
        
    </div>

  )
}

export default Weather
