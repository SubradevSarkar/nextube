#!/usr/bin/env node

// index.js

import cp from "child_process";
import readline from "readline";
import ytdl from "ytdl-core";
import ffmpeg from "ffmpeg-static";
import chalk from "chalk";
// import agent from "./yt_proxy"

// Configuration and Constants
const progressbarInterval = 1000;
let progressbarHandle = null;

// Tracker to monitor progress
const tracker = {
  start: 0,
  audio: { downloaded: 0, total: Infinity },
  video: { downloaded: 0, total: Infinity },
  merged: { frame: 0, speed: "0x", fps: 0 },
};

const toMB = (i) => (i / 1024 / 1024).toFixed(2);

// Show progress function
const showProgress = () => {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(
    `Audio  | ${chalk.green(
      ((tracker.audio.downloaded / tracker.audio.total) * 100).toFixed(2)
    )}% processed (${chalk.green(
      toMB(tracker.audio.downloaded)
    )}MB of ${chalk.green(toMB(tracker.audio.total))}MB).\n`
  );
  process.stdout.write(
    `Video  | ${chalk.yellow(
      ((tracker.video.downloaded / tracker.video.total) * 100).toFixed(2)
    )}% processed (${chalk.yellow(
      toMB(tracker.video.downloaded)
    )}MB of ${chalk.yellow(toMB(tracker.video.total))}MB).\n`
  );
  process.stdout.write(
    `Merged | processing frame ${chalk.cyan(
      tracker.merged.frame
    )} (at ${chalk.cyan(tracker.merged.fps)} fps => ${chalk.cyan(
      tracker.merged.speed
    )}).\n`
  );
  process.stdout.write(
    `Running for: ${chalk.magenta(
      ((Date.now() - tracker.start) / 1000 / 60).toFixed(2)
    )} Minutes.\n`
  );
  readline.moveCursor(process.stdout, 0, -3);
};

// Function to start the ffmpeg process
const startFFmpeg = (audioStream, videoStream) => {
  const ffmpegProcess = cp.spawn(
    ffmpeg,
    [
      "-loglevel",
      "8",
      "-hide_banner",
      "-progress",
      "pipe:3",
      "-i",
      "pipe:4",
      "-i",
      "pipe:5",
      "-map",
      "0:a",
      "-map",
      "1:v",
      "-c:v",
      "copy",
      "out.mkv",
    ],
    {
      windowsHide: true,
      stdio: ["inherit", "inherit", "inherit", "pipe", "pipe", "pipe"],
    }
  );

  ffmpegProcess.on("close", () => {
    console.log(chalk.bold.green("Done"));
    process.stdout.write("\n\n\n\n");
    clearInterval(progressbarHandle);
  });

  ffmpegProcess.stdio[3].on("data", (chunk) => {
    if (!progressbarHandle) {
      progressbarHandle = setInterval(showProgress, progressbarInterval);
    }
    const lines = chunk.toString().trim().split("\n");
    const args = {};
    for (const l of lines) {
      const [key, value] = l.split("=");
      args[key.trim()] = value.trim();
    }
    tracker.merged = args;
  });

  ffmpegProcess.on("error", (err, stdout, stderr) => {
    console.error("ffmpeg stdout:", stdout);
    console.error("ffmpeg stderr:", stderr);
    throw err;
  });

  audioStream.pipe(ffmpegProcess.stdio[4]);
  videoStream.pipe(ffmpegProcess.stdio[5]);
};

// Main function to process video
const processVideo = (url) => {
  try {
    if (!ytdl.validateURL(url)) {
      console.error(chalk.red("Invalid URL"));
      process.exit(1);
    }

    tracker.start = Date.now();
    console.log(chalk.blue("Starting download..."));

    const audioStream = ytdl(url, {
      quality: "highestaudio",
      // requestOptions: { agent },
    }).on("progress", (_, downloaded, total) => {
      tracker.audio = { downloaded, total };
    });

    const videoStream = ytdl(url, {
      quality: "highestvideo",
      // requestOptions: { agent },
    }).on("progress", (_, downloaded, total) => {
      tracker.video = { downloaded, total };
    });

    startFFmpeg(audioStream, videoStream);
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
};

// Export the main function
processVideo("https://www.youtube.com/watch?v=_i7MAyvYJEM");
