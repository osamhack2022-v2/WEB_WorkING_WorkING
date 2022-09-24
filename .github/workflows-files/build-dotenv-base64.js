/* eslint-disable @typescript-eslint/no-var-requires */

// meiliNG Continous Deployment Setup Utility
// dotenv to base64
//  -> Modified for osamhack2022
//
// Copyright (c) Alex4386, Distributed under MIT License

const path = require('path');
const fs = require('fs');

const envFilePath = ".env";

const envFileCheck = fs.existsSync(envFilePath);
if (!envFileCheck) { 
  console.error(`${`Error: .env file was not found!`}`);
  process.exit(1);
}

const result = fs.readFileSync(envFilePath);
const base64 = result.toString("base64");

console.log(base64);
process.exit(0);
