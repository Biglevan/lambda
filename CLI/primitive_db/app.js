const inquirer = require('inquirer');
const rl = require('readline')
const fs = require('fs');

(function cli() {
    inquirer.prompt([
        {
            name: 'name',
            message: 'Enter the user\'s name. To cancel press ENTER:'
        }
    ]).then(answer => { 
        if (answer.name == "") {
            inquirer.prompt([
                {   
                    type: 'confirm',
                    name: 'search',
                    message: 'Would you like to search users in DB:'
                }
            ]).then(answers => {
                answers.search && read();
            })
        } else {
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'gender',
                    message: 'Choose your Gender.',
                    choices: ['male', 'female']
                },
                {
                    name: 'age',
                    message: 'Enter your age:'
                }
            ]).then(answers => {
                const data = {...answer, ...answers}
                write(JSON.stringify(data)) && cli();
            })
        }
    })
})()

function write(answers) {
    fs.appendFileSync('data.txt', answers += '\n')
    return true
}

function read() {
    let exist = false
    inquirer.prompt([
        {
            name: 'name',
            message: 'Enter the user\'s name you want to find in DB:'
        }
    ]).then(answer => {
        rl.createInterface({
            input: fs.createReadStream('data.txt')
        }).on('line', line => {
            if (JSON.parse(line).name == answer.name) exist = line
        }).on('close', () => {
            exist && console.log(JSON.parse(exist));
            !exist && console.log('User was not found');
        })
    })
}