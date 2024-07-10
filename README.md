<p align="center">
   <img alt="MIRADA Logo" src="https://firebasestorage.googleapis.com/v0/b/sk-global-d834d.appspot.com/o/logo%2Fmorada_icon.png?alt=media&token=784e25e4-977d-497e-aafe-6579011c4f75">
</p>

## Description

**MIRADA** is a versatile and user-friendly tool designed to download and merge audio and video streams from YouTube seamlessly. By leveraging the capabilities of `ytdl-core` and `ffmpeg`, MIRADA ensures high-quality outputs with minimal effort. MIRADA is available as a

- [Google Chrome extension](#chrome-extension) for easy access
- [command-line interface (CLI)](#cli) for advanced users.

## Motto

**"Streamlined Streaming, Simplified."**

## Problem Statement

### The Problem

Downloading and combining audio and video streams from YouTube can be technically complex and time-consuming. Users often need to use multiple tools and run intricate commands, which can be daunting, especially for those who are not technically inclined.

### Our Solution

MIRADA simplifies the entire process by providing a single, easy-to-use solution that automates the downloading and merging of audio and video streams. With MIRADA, you can enjoy high-quality content without the hassle of dealing with multiple tools and complicated procedures.

## Features

- **Google Chrome Extension:** Easily download and merge YouTube streams directly from your browser.
- **Command-Line Interface (CLI):** Advanced users can leverage the CLI for more control and flexibility.
- **High-Quality Output:** Ensures the best quality for both audio and video streams.
- **User-Friendly:** Designed with simplicity in mind, making it accessible for all users.

## Installation

### Chrome Extension

1. Download the MIRADA extension from the [Chrome Web Store](#).
2. Install the extension in your Google Chrome browser.
3. Start downloading and merging YouTube streams with a single click!

### CLI

1. Clone this repository:
   ```sh
   https://github.com/SubradevSarkar/mirada.git
   ```
1. Install the dependencies:
   ```sh
   cd mirada
   npm install
   ```
1. Run the tool:
   ```sh
   node index.js <YouTube-URL>
   ```

## Usage

### Chrome Extension

1. Navigate to a YouTube video.
1. Click on the MIRADA extension icon.
1. Select the audio and video quality.
1. Click "**Download**".

### CLI

1. Open your terminal.

1. Run the following command:

   ```sh
   node index.js <YouTube-URL>
   ```

1. Replace `<YouTube-URL>` with the YouTube video URL you want to download and merge.

1. The merged file will be saved as out.mkv

## Contributing

We welcome contributions! Please read our contributing guidelines for more details.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
