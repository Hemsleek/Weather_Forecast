import "./App.css";
import { useState, useEffect } from "react";
import {Line} from 'react-chartjs-2'
// import 'chartjs-plugin-labels'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { fetchCurrentWeather, fetchByCityName, fetchByCoord } from "./services";
import { cityDateTimeInfo, isObjEmpty, weatherForecastFilter,dateParser } from "./utils";
import Loader from "./components/Loader";


const MainSection = ({ currentWeather,handleCitySearch }) => {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    !isObjEmpty(currentWeather) && setSearchInput((_) => currentWeather.name);
  }, [currentWeather]);

  const weatherTemp =
    !isObjEmpty(currentWeather) && Math.round(currentWeather.main.temp);
    

  return (
    <section className="MainSection">
      <div className="searchBar">
        <span>Your City</span>
        <form onSubmit={handleCitySearch}>
        <input
          type="text"
          value={searchInput}
          name="searchInput"
          onChange={({ target }) => setSearchInput(target.value)}
          placeholder="Enter City Name"
        />
        </form>
      </div>
      {!isObjEmpty(currentWeather) ? (
        <div className="main">
          <span className="time">
            {cityDateTimeInfo(dateParser(currentWeather),currentWeather.timezone)}{" "}
          </span>

          <div className="weather-condition">
            <div className="cloud-info">
              <img
                src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                alt="cloud-icon"
              />
              <span>
                {weatherTemp}
                <sup className="farahient">
                  o<sub>F</sub>
                </sup>
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
      ) : (
        <Loader />
      )}
    </section>
  );
};

const AdditionalInfo = ({ weatherforecast,daysIndex,setDaysIndex }) => {

  const chartData = weatherforecast.length && {

    labels:weatherforecast.map((weather,index) =>{ 
      
      return index===0? `Today (${cityDateTimeInfo(dateParser(weather),weather.timezone, weather.dt)})`: cityDateTimeInfo(dateParser(weather),weather.timezone, weather.dt) 
    }),
    datasets:[
      {
        label: 'Temperature',
        fill:true,
        lineTension: 0.2,
        backgroundColor: '#EEF4FE',
        borderColor: '#5596F6',
        pointBackgroundColor:'#5596F6',
        pointRadius:weatherforecast.map((item, itemIndex) => itemIndex === daysIndex? 4 : 0),
        spanGaps:true,
        borderWidth: 1.5,
        data:weatherforecast.map(weather => Math.round(weather.main.temp))
        
      }
    ]

  }
  console.log(chartData);
  
  return (
    <>
      {weatherforecast.length ? (
        <section className="AdditionalInfo">
          <div className="chart-wrapper">
            
            <div className="chart"> 
              <Line 
                plugins={[ChartDataLabels]}
                height={ 100 }
                data={chartData}
                options={{
                  plugins:{
                    datalabels:{
                      color:'blue',
                      offset:100,
                      align:"left",
                      padding:{
                        bottom:300,
                      },
                      label:{}
                    }
                  },
                  layout:{
                    padding:{
                      left:4,
                      right:4
                    }
                  },
                  scales: {
                    xAxes: [
                      {
                        display: false,
                      },
                    ],
                    yAxes: [
                      {
                        display: false,
                        ticks:{
                          min: Math.min(...weatherforecast.map(weather => Math.round(weather.main.temp))) - 5
                        }
                      },
                    ],
                  },                 
               title:{
                    display:true,
                    text:'Temperature',
                    fontSize:20,
                    
                  },
                  legend:{
                    display:false
                  }
                }}
              />
            </div>
          </div>
          <div className="extra-info">
            {weatherforecast.map((day, dayIndex) => (
              <div
                key={`day-info-${dayIndex}`}
                className={`day-info ${dayIndex === daysIndex ? "active" : ""}`}
                onClick={() => setDaysIndex(dayIndex)}
              >
                <span>
                  {dayIndex===0? 'Today' : cityDateTimeInfo(dateParser(day),day.timezone, day.dt)}
                </span>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt="cloud-icon"
                />
                <span>Humidity</span>
                <span>{day.main.humidity}%</span>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <Loader additionalInfo />
      )}
    </>
  );
};

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [daysIndex, setDaysIndex] = useState(0);


  const weatherToDisplay = [];
  console.log(weatherData);
  weatherData.length > 1 &&
    weatherData.forEach((data, dataIndex) => {
      if (dataIndex === 0) weatherToDisplay.push(data);
      else {
        const forecastData = weatherData[1].list.filter((item) =>{

        if(weatherForecastFilter(item.dt_txt)) {
          item.timezone = weatherData[0].timezone
          return true
        }
        return false
      }
        );
        weatherToDisplay.push(...forecastData);
      }
    });
  console.log({ weatherToDisplay });

    const handleCitySearch = (e) => {
      e.preventDefault()
      const form = e.target
      const city = form.searchInput.value
      fetchCurrentWeather(city)
          .then((data) => {
            setWeatherData([data]);
          })
          .catch(console.log);

        fetchByCityName(city)
          .then((data) => {
            setWeatherData((prevWeather) => prevWeather.concat(data));
          })
          .catch(console.log)
          .finally(() => {setDaysIndex(0)})

      

    }

  useEffect(() => {
    if (navigator.geolocation) {
      const userLocation = window.navigator.geolocation;
      const successResponse = ({ coords: { latitude, longitude } }) => {
        fetchCurrentWeather(null, latitude, longitude)
          .then((data) => {
            setWeatherData((prevWeather) => [data]);
          })
          .catch(console.log);

        fetchByCoord(latitude, longitude)
          .then((data) => {
            setWeatherData((prevWeather) => prevWeather.concat(data));
          })
          .catch(console.log);
      };

      const errorResponse = (err) => {
        fetchCurrentWeather("london")
          .then((data) => {
            setWeatherData((prevWeather) => [data]);
          })
          .catch(console.log);

        fetchByCityName("london")
          .then((data) => {
            setWeatherData((prevWeather) => prevWeather.concat(data));
          })
          .catch(console.log);
      };

      userLocation.getCurrentPosition(successResponse, errorResponse,{ enableHighAccuracy: true});
    } else {
      fetchCurrentWeather("london")
        .then((data) => {
          setWeatherData((prevWeather) => [data]);
        })
        .catch(console.log);

      fetchByCityName("london")
        .then((data) => {
          setWeatherData((prevWeather) => prevWeather.concat(data));
        })
        .catch(console.log);
    }
  }, []);

  return (
    <div className="App">
      <div className="wrapper">
        <MainSection currentWeather={weatherToDisplay[daysIndex] || {}} handleCitySearch={handleCitySearch} />
        <AdditionalInfo weatherforecast={weatherToDisplay} daysIndex = {daysIndex} setDaysIndex = {setDaysIndex} />
      </div>
    </div>
  );
}

export default App;
