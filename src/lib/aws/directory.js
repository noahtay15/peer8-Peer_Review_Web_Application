import * as fs from 'fs';

const buffer = fs.readFileSync('./directory.json');


export const directory = JSON.parse(buffer.toString());
