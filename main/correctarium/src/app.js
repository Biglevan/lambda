export const db = {
    mimetype: ['none', 'doc', 'docx', 'rtf', 'other'],
    language: {
        rus: { per: '0.05', min: '50', speed: '1333' },
        ukr: { per: '0.05', min: '50', speed: '1333' },
        en: { per: '0.12', min: '120', speed: '333' }
    }
}

export function procedure(char, lang, type) {
    const data = db.language[lang];
    let price = data.per * char
    const time = Math.max((char / data.speed).toFixed(2), 1)  

    if (type == 'other') {
        price *= 1.2
    }
    price = Math.max(price, data.min) 
    
    return { price, time }
} 

export function deadlineDate(hrs, date) {
    const d = date;
    const openHr = 10;
    const openMin = 0;
    const closeHr = 19;
    const closeMin = 0;
    const workHrs = closeHr - openHr;
    const weekHrs = workHrs * 5;
    const weeks = Math.floor(hrs / weekHrs) * 7;
    const days = Math.floor(hrs % weekHrs / workHrs);

    if (d.getHours() * 60 + d.getMinutes() < openHr * 60 + openMin || !(d.getDay() % 6)) {
        d.setHours(openHr, openMin, 0);

    } else if (d.getHours() >= closeHr && d.getMinutes() >= closeMin) {
        d.setHours(openHr, openMin, 0);
        d.setDate(d.getDate() + 1);
    }
    const day = (d) => d.getDay() || 7;
    const weekend = (d, time) => day(d) > 5 && d.setDate(d.getDate() + time);

    weekend(date, 8 - day(date));
    d.setDate(d.getDate() + weeks + days);
    weekend(date, 2);

    let hours = hrs % workHrs * 60;
    const remHrs = workHrs * 60 - (60 * (d.getHours() - openHr)) - (d.getMinutes() - openMin);

    if (hours > remHrs) {
        hours -= remHrs;
        d.setHours(openHr, openMin, 0);
        d.setDate(d.getDate() + 1);
        weekend(date, 2);   
    }
    d.setMinutes(d.getMinutes() + hours);

    const deadline = Math.floor(d.getTime() / 1000);
    const deadline_date = d.toLocaleString('en-GB');

    return { deadline, deadline_date }
}