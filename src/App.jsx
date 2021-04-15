import './App.css';
import { useState, useEffect } from 'react'
import { currentWeather, fetchByCityName, fetchByCoord } from './services';
import { cityDateTimeInfo, isObjEmpty, weatherForecastFilter } from './utils';
import Loader from './components/Loader';

const MainSection = ({currentWeather}) => {
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    !isObjEmpty(currentWeather) &&
      setSearchInput((_) => currentWeather.name)
    
    
  }, [currentWeather])
  const weatherTemp = !isObjEmpty(currentWeather) && Math.round(currentWeather.main.temp)

  return(
      <section className="MainSection">

        <div className="searchBar">
          <span>Your City</span>
          <input 
            type="text" value={searchInput} 
            onChange ={({target}) =>setSearchInput(target.value)}
            placeholder='Enter City Name'
          />

        </div>
        {
          !isObjEmpty(currentWeather)?
            <div className="main">
        
            <span className="time">{cityDateTimeInfo(currentWeather.dt,currentWeather.timezone)} </span>

            <div className="weather-condition">

              <div className="cloud-info">
                <img src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`} alt="cloud-icon"/>
                <span>
                  {weatherTemp}<sup className='farahient'>o<sub>F</sub></sup> 
                </span>
              </div>
              <span>{currentWeather.weather[0].description}</span>
            </div>

          <div className="info">
            <div className="humidity info-item">
              <span>Humidity</span>
              <span>{currentWeather.main.humidity}%</span>
            </div>
            <div className="wind-speed info-item">
              <span>Wind Speed</span>
              <span>{currentWeather.wind.speed} km/j</span>
            </div>
          </div>
        </div>
          :
            <Loader />
        }
      </section>
  )
}

const AdditionalInfo = () => {

  const [daysIndex, setDaysIndex] = useState(0)

  return(
  <section className="AdditionalInfo">
      <div className="chart-wrapper">
        <span>Temperature</span>
        <div className="chart"> chart</div>
      </div>
      <div className="extra-info">
        {
          [1,2,3,4].map((day, dayIndex) => (<div key={`day-info-${dayIndex}`} className={`day-info ${dayIndex===daysIndex? 'active' : ''}`} onClick={() => setDaysIndex(dayIndex)}>
              <span>April 12</span>
              <img src="./imgs/cloud.svg" alt="cloud-icon"/>
              <span>Humidity</span>
              <span>30%</span>
          </div>))
        }
      </div>
    </section>
  )
}

function App() {

  const [weatherData, setWeatherData] = useState([])
  const weatherToDisplay=[]
  console.log(weatherData)
   weatherData.length===2 && 
    weatherData.forEach((data,  dataIndex) => {
      if(dataIndex===0) weatherToDisplay.push(data)
      else{
        const forecastData = weatherData[1].list.filter(item => 
          weatherForecastFilter(item.dt_txt)
        )
        weatherToDisplay.push(...forecastData)

      }
    })
  console.log({weatherToDisplay})


  useEffect(() => {

    if(navigator.geolocation){
      const userLocation = window.navigator.geolocation
      const successResponse = ({coords: {latitude, longitude}}) =>{
          currentWeather(null,latitude, longitude)
            .then(data =>{setWeatherData(prevWeather => prevWeather.concat(data))} ).catch(console.log)
          fetchByCoord(latitude,longitude).then(data =>{setWeatherData(prevWeather => prevWeather.concat(data))}).catch(console.log)
      }
      const errorResponse = (err) =>{
        currentWeather('london').then(data =>{setWeatherData(prevWeather => prevWeather.concat(data))}).catch(console.log)
        fetchByCityName('london').then(data =>{setWeatherData(prevWeather => prevWeather.concat(data))}).catch(console.log)
      }

      userLocation.getCurrentPosition(successResponse , errorResponse)
    }
    else{
      currentWeather('london').then(data =>{setWeatherData(prevWeather => prevWeather.concat(data))}).catch(console.log)
      fetchByCityName('london').then(data =>{setWeatherData(prevWeather => prevWeather.concat(data))}).catch(console.log)
    }

  }, [])

  return (
    <div className="App">
      <div className="wrapper">
        <MainSection currentWeather ={weatherToDisplay[0] || { }} />
        <AdditionalInfo weatherforecast ={weatherToDisplay}/>
      </div>
    </div>
  );
} 

export default App;
