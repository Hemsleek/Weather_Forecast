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

export const cityDateTimeInfo = (timeStamp,timeZone ) => {

    // format ===> 12.05 PM, Sun, April 11, 2021
    // new Date() format ===> Thu Apr 15 2021 12:50:12 GMT+0100 (West Africa Standard Time)
    const testLength = (param) => {
        return ('0').repeat(2-(String(param).length)) + param
    }
    
    const date = new Date((timeStamp * 1000) + (timeZone * 1000))
    const dateSlice = date.toString().split(' ').slice(0,5)
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