const months = 'January,Feburary,March,April,May,June,July,August,September,October,November,December'.split(',')

const testLength = (param) => {
    return ('0').repeat(2-(String(param).length)) + param
}

const getZoneDate = (date,timeZone) => {
    if(date) return new Date(date)
    const localDate= new Date()
    // getTimezoneOffset is in minute(convert to ms)
    const utcTime = localDate.getTime() + (localDate.getTimezoneOffset() * 60000)
    return new Date(utcTime + (timeZone * 1000))
}

export const dateParser = ({dt_txt}) => dt_txt? dt_txt.replace(' ','T') : null

export const weatherForecastFilter = (dateTxt) =>{
     const dataArray = dateTxt.split(' ')
     const date = parseInt(dataArray[0].split('-')[2],10)
     const currentDate = new Date().getDate()

    return date!==currentDate && dateTxt.includes('12:00:00')
}

export const isObjEmpty = (obj) => {
   if(Object.entries(obj).length) return false
   return true
}

export const cityDateTimeInfo = (date,timeZone,forecastTimestamp ) => {

    // format ===> 12.05 PM, Sun, April 11, 2021
    // new Date() format ===> Thu Apr 15 2021 12:50:12 GMT+0100 (West Africa Standard Time)
    
    const _date = getZoneDate(date,timeZone)
    const dateSlice = _date.toString().split(' ').slice(0,5)

    if(forecastTimestamp) {
        const forecastDate = new Date(forecastTimestamp * 1000)
        const forecastMonth = forecastDate.toString().split(' ')[1]

        let month = months[forecastDate.getMonth()]
        month = month.length <= 6? month : forecastMonth
        return `${month} ${forecastDate.getDate()}`
    }

    let hour = parseInt(dateSlice[4].split(':')[0],10)
    let ampm = 'AM'
    if(hour >= 12) ampm ='PM'
    if(hour > 12) hour = hour - 12
    if(hour===0 && ampm==='AM') hour = 12
    hour= testLength(hour)
    let minute = _date.getMinutes()
    minute = testLength(minute)


    return `${hour}:${minute} ${ampm}, ${dateSlice[0]}, ${dateSlice[1]} ${dateSlice[2]}, ${dateSlice[3]}`
}

