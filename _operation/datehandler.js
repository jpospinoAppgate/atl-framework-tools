module.exports.dateHandler = (startDate, stopDate) => {
    let dateArray = new Array();
    let currentDate = startDate;
    
    stopDate = new Date(stopDate.valueOf());
    stopDate.setDate(stopDate.getDate() + 1)
    
    while (new Date(currentDate.valueOf()) <= new Date(stopDate.valueOf())) {
        let date = new Date(currentDate.valueOf());
        
        if (!(date.getDay() == 6 || date.getDay() == 0))
            dateArray.push(new Date(currentDate));

        date.setDate(date.getDate() + 1);
        currentDate = date;
    }
    return dateArray;
}