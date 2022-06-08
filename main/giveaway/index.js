import { promises as fs } from 'fs';
import * as path from 'path';

console.time()

const data = await readDirectory('./data/');

async function readDirectory(directory) {
    const fileNames = await fs.readdir(directory);

    const filePromises = fileNames.map(async file => {
        const filePath = path.join(directory, file);

        const fileData = await fs.readFile(filePath, 'utf8');

        return fileData.split('\n');
    });
    return Promise.all(filePromises);
}

function fileIntersection(files) {
    const count = {};
    const dupFree = data.map(element => [...new Set(element)]);

    dupFree.flat().forEach(value => {
        count[value] = (count[value] || 0) + 1
    });
    return console.log(Object.values(count)
        .filter(val => val >= files)
        .length);
}

fileIntersection(1)
fileIntersection(20)
fileIntersection(10)

console.timeEnd()
