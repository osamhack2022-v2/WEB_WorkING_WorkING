/* eslint-disable @typescript-eslint/no-var-requires */

const dotenv = require("dotenv");
const path = require("path");
const os = require("os");

dotenv.config({ path: path.join(__dirname, ".env") });

let keyFile = process.env.DEPLOY_KEY_PATH || undefined;
if (keyFile) keyFile = keyFile.replace(/^~/g, os.homedir());

let keyOption = "";
if (keyOption) keyOption += '-i "' + keyFile + '"';

// TODO: current pm2 deployment logic deploys both frontend and backend on each dir
const installPath = "/var/workING/backend";

const sshOptions = [
  process.env.DEPLOY_BYPASS_KEY_CHECK ? "StrictHostKeyChecking=no" : undefined,
  process.env.DEPLOY_SUPPRESS_SSH_LOG ? "LogLevel=QUIET" : undefined,
].filter((n) => n !== undefined);

module.exports = {
  apps: [
    {
      name: "working-be",
      cwd: "./WEB(BE)/",
      script: "yarn",
      args: ["start"],
      env: {
        // You should configure it here.
        NODE_ENV: "production",

        ...process.env,
      },
    },
  ],

  deploy: {
    production: {
      user: process.env.DEPLOY_USER,
      host: process.env.DEPLOY_HOST,
      ref: "origin/main",
      repo: process.env.GITHUB_TOKEN
        ? "https://" +
          process.env.GITHUB_TOKEN +
          ":" +
          process.env.GITHUB_TOKEN +
          "@github.com/osamhack2022/WEB_WorkING_WorkING"
        : "git@github.com:osamhack2022/WEB_WorkING_WorkING.git",
      path: installPath,
      key: keyFile,
      "pre-deploy-local": `scp -Cr${
        sshOptions.length > 0
          ? " " +
            sshOptions
              .filter((n) => n && n.trim() !== "")
              .map((n) => "-o " + n + "")
              .join(" ")
          : ""
      } ./.env ${process.env.DEPLOY_USER}@${
        process.env.DEPLOY_HOST
      }:${installPath}/current`,
      "post-deploy": `cd WEB(BE) && yarn && yarn generate && yarn build && pm2 startOrRestart ecosystem.config.js`,
      ssh_options: sshOptions,
    },
  },
};
