#!/usr/bin/env node

import { welcome, askme, spinLoading } from "./utils/command.js";
import { getInfo, sanitizeTitle, processVideo } from "./src/nextube.js";
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
  const selected_quality = await askme.videoQuality(video_qualities);

  // input - download path
  const basePath = await askme.downloadPath();

  // snitized title and prepare output path
  const outputPath = path.join(basePath, sanitizeTitle(title));

  await processVideo(url, selected_quality, outputPath);
}

main();
