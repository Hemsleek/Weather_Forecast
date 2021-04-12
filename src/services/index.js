const apiKey = process.env.REACT_APP_API_KEY 



export const fetchByCityName = (cityName) => {
  const response = fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`)
    .then(res => res.json())
  return response
}

export const fetchByCoord = (lat,lon) => {
    const response = fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    return response.then(res => res.json())
}

