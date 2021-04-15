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