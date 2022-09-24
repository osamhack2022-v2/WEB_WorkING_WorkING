/* eslint-disable @typescript-eslint/no-var-requires */

// meiliNG Continous Deployment Setup Utility
// base64 to certificate
//  -> Literally re-using my code @ osamhack2022
//
// Copyright (c) Alex4386, Distributed under MIT License

const fs = require('fs');
const os = require('os');

let keyFilePath = process.env.KEY_PATH;
keyFilePath = keyFilePath.replace(/^~/g, os.homedir());

if (!fs.existsSync(keyFilePath)) {
  fs.mkdirSync(keyFilePath, {recursive: true});
  fs.rmdirSync(keyFilePath);  
}

const base64 = process.env.KEY_BASE64;
if (!base64) {
  console.error(`Error: base64 value missing!`);
  process.exit(1);
}

const result = Buffer.from(base64, 'base64');

fs.writeFileSync(keyFilePath, result);
console.log(`Exported to: ${keyFilePath}`)

// setup permissions to make ssh to use this key file
fs.chmodSync(keyFilePath, '0700');

process.exit(0);
