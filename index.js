// index.js

const cp = require("child_process");
const readline = require("readline");
const ytdl = require("ytdl-core");
const ffmpeg = require("ffmpeg-static");
// const agent = require("./yt_proxy");

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
    `Audio  | ${(
      (tracker.audio.downloaded / tracker.audio.total) *
      100
    ).toFixed(2)}% processed (${toMB(tracker.audio.downloaded)}MB of ${toMB(
      tracker.audio.total
    )}MB).\n`
  );
  process.stdout.write(
    `Video  | ${(
      (tracker.video.downloaded / tracker.video.total) *
      100
    ).toFixed(2)}% processed (${toMB(tracker.video.downloaded)}MB of ${toMB(
      tracker.video.total
    )}MB).\n`
  );
  process.stdout.write(
    `Merged | processing frame ${tracker.merged.frame} (at ${tracker.merged.fps} fps => ${tracker.merged.speed}).\n`
  );
  process.stdout.write(
    `Running for: ${((Date.now() - tracker.start) / 1000 / 60).toFixed(
      2
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
    console.log("done");
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
  tracker.start = Date.now();

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
};

// Export the main function
processVideo("https://www.youtube.com/watch?v=_i7MAyvYJEM");
