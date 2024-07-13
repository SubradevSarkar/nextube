import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { input } from "@inquirer/prompts";
import select, { Separator } from "@inquirer/select";
import { createSpinner } from "nanospinner";
import os from "os";
import fs from "fs";
import path from "path";
import { brand_name } from "../scripts/brand.js";

let sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

export async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(
    `${brand_name.toUpperCase()} Ultimate download manager\n `
  );

  await sleep();
  rainbowTitle.stop();

  console.log(
    `
            ${chalk.bgBlue("HOW TO Download")} 

    ${chalk.bgGreenBright(
      chalk.blackBright(" 1 ")
    )} Enter the YouTube video URL.

    ${chalk.bgGreenBright(chalk.blackBright(" 2 "))} Choose video quality.

    ${chalk.bgGreenBright(
      chalk.blackBright(" 3 ")
    )} Enter the download folder path.
   
            AND That's it!...
    `
  );
}

export const askme = {
  youtubeUrl: async () => {
    const answer = await input({
      message: "Enter YOUTUBE video URL",
      required: true,
      default: () => {
        return "www.youtube.com";
      },
    });

    // console.log(chalk.bgBlueBright(answer));

    return answer;
  },

  videoQuality: async (options) => {
    const answer = await select({
      message: "Select video ",
      choices: options,
      loop: false,
      pageSize: 20,
      required: true,
      // sample -----------------------
      // choices: [
      //   { name: "npm", value: "npm" },
      //   { name: "yarn", value: "yarn" },
      //   new Separator(),
      //   { name: "pnpm", value: "pnpm", disabled: true },
      //   {
      //     name: "pnpm",
      //     value: "pnpm",
      //     disabled: "(pnpm is not available)",
      //   },
      // ],
    });

    // console.log(chalk.bgBlueBright(answer));
    return answer;
  },
  downloadPath: async () => {
    const answer = await input({
      message: "Enter the download folder path",
      default: () => {
        return `${getDefaultDownloadLocation()}`;
      },
    });

    return path.join(answer);
  },
};

export async function spinLoading(message) {
  const spinner = createSpinner(`${message}`);

  const start = async () => {
    spinner.start();
    await sleep();
  };
  return start;
}

function getDefaultDownloadLocation() {
  const homeDir = os.homedir();
  const downloadPath = path.join(homeDir, "Downloads");

  if (!fs.existsSync(downloadPath)) {
    // If it doesn't exist, create the folder
    fs.mkdirSync(downloadPath, { recursive: true });
    console.log(`Created folder: ${downloadPath}`);
  }

  return downloadPath;
}

// // testing purpose only ------------------
// await welcome();
// await askme();
