import cp from "child_process";
import readline from "readline";
import ytdl from "@distube/ytdl-core";
import ffmpeg from "ffmpeg-static";
import chalk from "chalk";

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

// Function to show overall progress ------- 2
const showProgress = () => {
  // Calculate overall progress percentage
  const totalDownloaded = tracker.audio.downloaded + tracker.video.downloaded;
  const totalSize = tracker.audio.total + tracker.video.total;
  const downloadCompleted = tracker.merged.progress === "end";

  let overallPercentage = ((totalDownloaded / totalSize) * 100).toFixed(2);

  if (downloadCompleted) {
    overallPercentage = 100.0;
  }

  // Create progress bar
  const progressBar = createProgressBar(overallPercentage, 50, chalk.green);

  // Calculate elapsed time in minutes
  const elapsedMinutes = ((Date.now() - tracker.start) / 1000 / 60).toFixed(2);

  // Clear the previous line
  readline.cursorTo(process.stdout, 0);
  readline.clearScreenDown(process.stdout);

  // Write the progress information
  process.stdout.write(
    `${downloadCompleted ? "Completed" : "Downloading"} | [ ${toMB(
      totalDownloaded
    )} MB ] ${progressBar} ${chalk.green(overallPercentage)}%\n`
  );
  process.stdout.write(
    `Total Time: ${chalk.magenta(elapsedMinutes)} Minutes\n`
  );

  // Move cursor back to the top to overwrite the previous progress
  readline.moveCursor(process.stdout, 0, -2);
};

// Function to create a progress bar
const createProgressBar = (percentage, barLength, color) => {
  const filledLength = Math.round(barLength * (percentage / 100));
  const bar =
    color("█").repeat(filledLength) + " ".repeat(barLength - filledLength);
  return bar;
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
      `${outputPath}.mkv`,
    ],
    {
      windowsHide: true,
      stdio: ["inherit", "inherit", "inherit", "pipe", "pipe", "pipe"],
    }
  );

  ffmpegProcess.on("close", () => {
    showProgress();
    process.stdout.write("\n\n\n\n");
    clearInterval(progressbarHandle);
    console.log(
      chalk.bgGreenBright(chalk.blue("    🎉  Download Completed      "))
    );
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
      (format) => !format?.audioBitrate && format?.mimeType?.includes("video")
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

// Main function to process video
const processVideo = async (url, selected_quality, outputPath) => {
  try {
    tracker.start = Date.now();
    console.log(chalk.blue("Starting download..."));

    const audioStream = await ytdl(url, {
      quality: "highestaudio",
      // agent: agentForARandomIP,
      // requestOptions: { agent },
    }).on("progress", (_, downloaded, total) => {
      tracker.audio = { downloaded, total };
    });

    const videoStream = await ytdl(url, {
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

export { getInfo, sanitizeTitle, processVideo };
