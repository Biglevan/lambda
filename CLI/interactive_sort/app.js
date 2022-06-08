const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

const list = [ "1. Words by name (from A to Z).",
                "2. Show digits from the smallest.",
                "3. Show digits from the biggest.",
                "4. Words by quantity of letters.",
                "5. Only unique words."]

function sorting(action, input) {
    const digit = /^\d+(\.\d+)?$/
    const word = /^[a-zA-Z]*$/
    const both = new RegExp(`(${digit.source}|${word.source})`);
    const filter = (regex) => input.filter(str => regex.test(str));
    const actions = {
        1: filter(word).sort(Intl.Collator('en').compare),
        2: filter(digit).sort((a, b) => a - b),
        3: filter(digit).sort((a, b) => b - a),
        4: filter(word).sort((a, b) => a.length - b.length),
        5: [...new Set(filter(word))],
        6: [...new Set(filter(both))]
    }
    console.log(actions[action])
}

const exit = (input) => input === 'exit' && process.exit(1);
    
function cli() {
    rl.question("Enter words or digits deviding them in spaces: ", (input) =>{
        exit(input);
        if (!input) {
            cli();
        } else {
            console.log(`How would you like to sort values:\n${list.join("\n")}`);
            operation(input.match(/\S+/g));
        }   
    })
}

function operation(input) {
    rl.question('Select (1-6) and press ENTER: ', (number) => {
        if (number.match(/^[1-6]{1,1}$/)) {
            sorting(number, input);
        } else {
            exit(number);
            operation();
        }
        cli();
    })
}

cli()