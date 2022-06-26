"use strict";

const hello = async () => {
    return {
        statusCode: 200,
        body: "Hello World"
    }
}

const firstPositive = async (event) => {
    const array = event.body.trim().split(/\s+/);
    const positive = array.findIndex(element => element > 0);

    return {
        statusCode: 200,
        body: `value:${array[positive]}\nindex:${positive}`
    }
}

const sumPositive = async (event) => {
    const array = event.body.trim().split(/\s+/);
    const sum = array.reduce((acc, curr) => acc + Math.max(curr, 0), 0);

    return {
        statusCode: 200,
        body: JSON.stringify(sum)
    }
}

const nResult = async (event) => {
    const n = Object.keys(event.queryStringParameters)[0];
    const array = event.queryStringParameters[n].trim().split(/\s+/)

    let sum = 0
    let mult = 1

    array.slice(0, n).forEach(value => {
        sum += +value
        mult *= value
    })

    return {
        statusCode: 200,
        body: `sum:${sum}\nmult:${mult}`
    }
}

const numDate = async () => {
    const day = (date => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24))(new Date());

    return {
        statusCode: 200,
        body: JSON.stringify(day)
    }
}

const userSort = async (event) => {
    const array = JSON.parse(event.body);

    const sorting = array.sort((a, b) => {
        let value = a.firstName.localeCompare(b.firstName);
        value = a.lastName.localeCompare(b.lastName);
        value = Date.parse(b.birthDate) - Date.parse(a.birthDate);

        return value;
    });
    return {
        statusCode: 200,
        body: JSON.stringify(sorting),
    }
}

module.exports = { hello, firstPositive, sumPositive, nResult, numDate, userSort }