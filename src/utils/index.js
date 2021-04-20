const months = 'January,Feburary,March,April,May,June,July,August,September,October,November,December'.split(',')

const testLength = (param) => {
    return ('0').repeat(2-(String(param).length)) + param
}

const getZoneDate = (timeZone) => {
    const localDate= new Date()
    // getTimezoneOffset is in minute(convert to ms)
    const utcTime = localDate.getTime() + (localDate.getTimezoneOffset() * 60000)
    return new Date(utcTime + (timeZone * 1000))
}

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

export const cityDateTimeInfo = (timeZone,additionalInfo ) => {

    // format ===> 12.05 PM, Sun, April 11, 2021
    // new Date() format ===> Thu Apr 15 2021 12:50:12 GMT+0100 (West Africa Standard Time)
    
    const date = getZoneDate(timeZone)
    const dateSlice = date.toString().split(' ').slice(0,5)

    if(additionalInfo) {
        let month = months[date.getMonth()]
        month = month.length <= 6? month : dateSlice[1]

        return `${month} ${date.getDate()}`
    }

    let hour = parseInt(dateSlice[4].split(':')[0],10)
    let ampm = 'AM'
    if(hour >= 12) ampm ='PM'
    if(hour > 12) hour = hour - 12
    if(hour===0 && ampm==='AM') hour = 12
    hour= testLength(hour)
    let minute = date.getMinutes()
    minute = testLength(minute)


    return `${hour}:${minute} ${ampm}, ${dateSlice[0]}, ${dateSlice[1]} ${dateSlice[2]}, ${dateSlice[3]}`
}

