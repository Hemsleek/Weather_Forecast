const apiKey = process.env.REACT_APP_API_KEY 

export const fetchByCityName = () => {
  const response = fetch(`https://api.openweathermap.org/data/2.5/forecast?q=lagos&units=imperial&appid=${apiKey}`)
    .then(res => res.json())
  return response
}

export const fetchByCoord = (lat,lon) => {
    const response = fetch(`api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    return response.then(res => res.json())
}