import "./App.css";
import { useState, useEffect } from "react";
import { fetchCurrentWeather, fetchByCityName, fetchByCoord } from "./services";
import { cityDateTimeInfo, isObjEmpty, weatherForecastFilter } from "./utils";
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
            {cityDateTimeInfo(currentWeather.timezone)}{" "}
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

  return (
    <>
      {weatherforecast.length ? (
        <section className="AdditionalInfo">
          <div className="chart-wrapper">
            <span>Temperature</span>
            <div className="chart"> chart</div>
          </div>
          <div className="extra-info">
            {weatherforecast.map((day, dayIndex) => (
              <div
                key={`day-info-${dayIndex}`}
                className={`day-info ${dayIndex === daysIndex ? "active" : ""}`}
                onClick={() => setDaysIndex(dayIndex)}
              >
                <span>
                  {dayIndex===0? 'Today' : cityDateTimeInfo(day.timezone, day.dt)}
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
        <MainSection currentWeather={weatherToDisplay[0] || {}} handleCitySearch={handleCitySearch} />
        <AdditionalInfo weatherforecast={weatherToDisplay} daysIndex = {daysIndex} setDaysIndex = {setDaysIndex} />
      </div>
    </div>
  );
}

export default App;
