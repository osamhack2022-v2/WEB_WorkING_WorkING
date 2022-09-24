/* eslint-disable @typescript-eslint/no-var-requires */

// meiliNG Continous Deployment Setup Utility
//  -> Modified for osamhack2022
//
// base64 to dotenv
//
// upstream file @ https://github.com/meili-NG/meiliNG/blob/main/.github/workflows-files/get-dotenv-from-base64.js
// Copyright (c) Alex4386, Distributed under MIT License

const path = require('path');
const fs = require('fs');

const projectRoot = path.join(__dirname, "..", "..");
let envFilePath = path.join(projectRoot, ".env");

const targetEnvFilePath = process.argv[2];
if (targetEnvFilePath && targetEnvFilePath.endsWith('.env')) {
    envFilePath = targetEnvFilePath;
}

const base64 = process.env.ENV_BASE64;
if (!base64) {
  console.error('base64 value missing')
  process.exit(1);
}

const result = Buffer.from(base64, 'base64');
fs.writeFileSync(envFilePath, result);

console.log(`Exported .env file to: ${envFilePath}`
)


process.exit(0);