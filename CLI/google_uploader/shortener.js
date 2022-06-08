const axios = require('axios');

const headers = {
    "Content-Type": "application/json",
    "apikey": "87eb78f1e3ed4e47a3b854fadea7dea2"
}

async function shorten(url) {
    const endpoint = "https://api.rebrandly.com/v1/links";
    const linkRequest = {
        destination: url,
        domain: { fullName: "rebrand.ly" }
    }
    const apiCall = {
        method: 'post',
        url: endpoint,
        data: linkRequest,
        headers: headers
    }
    const apiResponse = await axios(apiCall);
    const link = apiResponse.data;
    return link.shortUrl;
}

exports.shorten = shorten;