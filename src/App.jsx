import './App.css';

const MainSection = () => {
  return(
      <section className="MainSection">

        <div className="searchBar">
          <span>Your City</span>
          <input type="text" placeholder='Nigeria'/>
        </div>

        <span>12.05 PM, Sun, April 11, 2021 </span>

        <div className="weather-condition">

          <div className="cloud-info">
            <img src="./imgs/cloud.svg" alt="cloud-icon"/>
            <span>72 <sup>oF</sup> </span>
          </div>
          <span>Cloudy</span>
        </div>

        <div className="info">
          <div className="humidity">
            <span>Humidity</span>
            <span>45%</span>
          </div>
          <div className="wind-speed">
            <span>Wind Speed</span>
            <span>19.2 km/j</span>
          </div>
        </div>
      </section>
  )
}
const AdditionalInfo = () => {
  return(
    <section className="AdditionalInfo">
      <div className="chart-wrapper">
        <span>Temperature</span>
        <div className="chart"></div>
      </div>
      <div className="extra-info">
        {
          [1,2,3,4].map((day, dayIndex) => (<div key={`day-info-${dayIndex}`} className="day-info">
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
  return (
    <div className="App">
      loaded
    </div>
  );
}

export default App;
