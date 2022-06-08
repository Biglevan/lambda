const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const gd = require('./index')
const us = require('./shortener')

inquirer.prompt([
    {
        name: 'drop',
        message: 'Drag and drop your image to terminal:'
    }
]).then(answer => {
    const dir = path.dirname(answer.drop);
    const name = path.basename(answer.drop);
    const ext = path.extname(name);
       
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'change',
            message: `You\'re uploading file with the name: ${name}\nWould you like to change it?`
        }
    ]).then(answer2 => {
        if(answer2.change) {
            inquirer.prompt([
                {
                    name: 'rename',
                    message: 'Enter new file name (without extension): '
                }
            ]).then(answer3 => {
                const path = `${dir}/${answer3.rename}${ext}`
         
                fs.renameSync(`${answer.drop}`, path)
                gd.initialize(path, answer3.rename)
            })
        } else {
            const path = `${dir}/${name}${ext}`
            gd.initialize(path, name)
        }
    })
})

function shortener(url){
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'short',
            message: 'Would you like to shorten the url?'
        }
    ]).then(async answer => {
        if(answer.short) {
            const link = await us.shorten(url);
            console.log(`Your shorten link: ${link}`)
        } else {
            console.log(`Your link: ${url}`)
        }
    })
}

exports.shortener = shortener;
