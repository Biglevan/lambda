const json = require('./dates.json'); 

const optimized = Object.values(json.reduce((obj, c) => {
    const dates = { startDate: c.startDate, endDate: c.endDate }
    
    if(Object.keys(obj).includes(c.user.name)) {
        obj[c.user.name].weekendDates.push(dates);
    } else {
        obj[c.user.name] = { userId: c.user._id,  name: c.user.name, weekendDates: [dates] }
    }
    return obj;
}, {}));

console.log(optimized)