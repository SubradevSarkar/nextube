#!/usr/bin/env node

// index.js

import cp from "child_process";
import readline from "readline";
// import ytdl from "ytdl-core";
import ytdl from "@distube/ytdl-core";
import ffmpeg from "ffmpeg-static";
import chalk from "chalk";
// import agent from "./yt_proxy"
// import { agentForARandomIP } from "./utils/yt_ipRotate.js";

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
const startFFmpeg = (audioStream, videoStream, outputPath) => {
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
      // "/home/skdev/Downloads/out.mkv",
      `${outputPath}.mkv`,
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
const processVideo = (url, selected_quality, outputPath) => {
  try {
    tracker.start = Date.now();
    console.log(chalk.blue("Starting download..."));

    const audioStream = ytdl(url, {
      quality: "highestaudio",
      // agent: agentForARandomIP,
      // requestOptions: { agent },
    }).on("progress", (_, downloaded, total) => {
      tracker.audio = { downloaded, total };
    });

    const videoStream = ytdl(url, {
      quality: `${selected_quality}`,
      // agent: agentForARandomIP,
      // requestOptions: { agent },
    }).on("progress", (_, downloaded, total) => {
      tracker.video = { downloaded, total };
    });

    startFFmpeg(audioStream, videoStream, outputPath);
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
};

// Helper function to sanitize file names
function sanitizeTitle(title) {
  return title.replace(/[^a-zA-Z0-9]/g, "_");
}

const getInfo = async (url) => {
  if (!ytdl.validateURL(url)) {
    console.error(chalk.red("Invalid URL"));
    process.exit(1);
  }

  const info = await ytdl.getInfo(url);

  const title = info.videoDetails.title;

  const video_qualities = info.formats
    .filter(
      (format) => !format.audioBitrate && format.mimeType.includes("video")
    )
    .sort((a, b) => {
      const a_quality = Number(a.qualityLabel.split("p")[0]);
      const b_quality = Number(b.qualityLabel.split("p")[0]);

      return b_quality - a_quality;
    });

  // // omit the duplicates and select the optimized qualities
  const filteredData = Object.values(
    video_qualities.reduce((acc, item) => {
      if (!acc[item.qualityLabel]) {
        acc[item.qualityLabel] = item;
      } else {
        const existing = acc[item.qualityLabel];
        if (item.bitrate > existing.bitrate) {
          if (item.codecs === "vp9") {
            acc[item.qualityLabel] = item;
          } else if (existing.codecs !== "vp9") {
            acc[item.qualityLabel] = item;
          }
        } else if (existing.codecs !== "vp9" && item.codecs === "vp9") {
          acc[item.qualityLabel] = item;
        }
      }
      return acc;
    }, {})
  ).map((format) => {
    return {
      name: format.qualityLabel,
      value: format.itag,
      rate: format.bitrate,
      codac: format.codecs,
    };
  });

  return { title, video_qualities: filteredData };
};

import { welcome, askme, spinLoading } from "./utils/command.js";
import path from "path";

async function main() {
  await welcome();

  // input - url
  const url = await askme.youtubeUrl();
  // checkUrl
  await spinLoading("Video Loading ...");
  const { title, video_qualities } = await getInfo(url);

  // video quality options
  // input - options
  const [selected_quality] = await askme.videoQuality(video_qualities);

  // input - download path
  const basePath = await askme.downloadPath();

  // snitized title and prepare output path
  const outputPath = path.join(basePath, sanitizeTitle(title));

  processVideo(url, selected_quality, outputPath);
}

// Export the main function
// processVideo("https://www.youtube.com/watch?v=fMdkopYylvI");
main();
