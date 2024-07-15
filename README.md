<div align="center" style="text-align:center">
   <img alt="NEXTUBE Logo" src="https://firebasestorage.googleapis.com/v0/b/sk-global-d834d.appspot.com/o/logo%2Fnextube_logo.png?alt=media&token=a61e510a-ef9c-4126-a908-160443fd3fc8">
   
   <div> <b> Simplify Streaming, Amplify Quality</b></div><br>
</div>

**NEXTUBE** is a versatile and user-friendly tool designed to download and merge audio and video streams from YouTube seamlessly. By leveraging the capabilities of `ytdl-core` and `ffmpeg`, NEXTUBE ensures high-quality outputs with minimal effort. NEXTUBE is available as a

- [command-line interface (CLI)](#cli) for advanced users.
- [Google Chrome extension](#chrome-extension) for easy access [ ** under development **]

## Problem Statement

### The Problem

Downloading and combining audio and video streams from YouTube can be technically complex and time-consuming. Users often need to use multiple tools and run intricate commands, which can be daunting, especially for those who are not technically inclined.

### Our Solution

NEXTUBE simplifies the entire process by providing a single, easy-to-use solution that automates the downloading and merging of audio and video streams. With NEXTUBE, you can enjoy high-quality content without the hassle of dealing with multiple tools and complicated procedures.

## Features

- **Google Chrome Extension:** Easily download and merge YouTube streams directly from your browser.
- **Command-Line Interface (CLI):** Advanced users can leverage the CLI for more control and flexibility.
- **High-Quality Output:** Ensures the best quality for both audio and video streams.
- **User-Friendly:** Designed with simplicity in mind, making it accessible for all users.

## Installation

### Chrome Extension

(** under development **)

1. Download the NEXTUBE extension from the [Chrome Web Store](#).
2. Install the extension in your Google Chrome browser.
3. Start downloading and merging YouTube streams with a single click!

### CLI

> prerequisites to run **NEXTUBE** on your system command-line <br>
> Install Node.js version 18(LTS) or higher

### windows <br>

Download the [Windows Installer](https://nodejs.org/en) directly from the [nodejs.org](https://nodejs.org/en) web site.

### Linux/Unix <br>

Choose your platform and Installing Node.js via [Package Managers](https://nodejs.org/en/download/package-manager/all)

### installation

> NEXTUBE must be installed as **_Global_**, otherwise will not work properly

1. Install NEXTUBE from NPM :

   ```sh
   #windows
   npm install -g @devpm/nextube

   #Linux/Unix
   sudo npm install -g @devpm/nextube
   ```

1. use NEXTUBE from terminal:
   ```sh
   nextube
   ```

### un-installation

1. Run the command:

   ```sh
   #windows
   npm uninstall -g @devpm/nextube

   #Linux/Unix
   sudo npm uninstall -g @devpm/nextube
   ```

## Usage

### Chrome Extension

(** under development **)

1. Navigate to a YouTube video.
1. Click on the NEXTUBE extension icon.
1. Select the audio and video quality.
1. Click "**Download**".

### CLI

1. Open your terminal.

1. Run the following command:

   ```sh
   nextube
   ```

1. follow the instructions once it runs.

   - provide the **_Youtude video link_**
   - Choose video **_quality_**
   - provide the **_Download location_**
     - default Download location ( **home_directory/Downloads**)

- ### preview
<div align="center" style="text-align:center">
   <img alt="NEXTUBE Logo" width="600" src="https://firebasestorage.googleapis.com/v0/b/sk-global-d834d.appspot.com/o/images%2Fnex-1.png?alt=media&token=07521bb7-b53d-4361-a84a-905d700da048">
   <br>
   <img alt="NEXTUBE Logo" width="600" src="https://firebasestorage.googleapis.com/v0/b/sk-global-d834d.appspot.com/o/images%2Fnex-2.png?alt=media&token=2cde3a34-f024-47b9-a9ce-39e8252bf872">
   <br>
   <img alt="NEXTUBE Logo" width="600" src="https://firebasestorage.googleapis.com/v0/b/sk-global-d834d.appspot.com/o/images%2Fnex-3.png?alt=media&token=b5538a5e-d9f2-4eba-8e71-c21dd94331f3">
   <br>
   <img alt="NEXTUBE Logo" width="600" src="https://firebasestorage.googleapis.com/v0/b/sk-global-d834d.appspot.com/o/images%2Fnex-4.png?alt=media&token=048d19f1-d63d-45cd-996d-cf934e060d4c">

</div>

## Issue

- If you encounter issues with downloading, such as delays in **_starting the download_** or **_failed downloads_**, please try changing the **download location**. This adjustment might help resolve the problem.

## Contributing

We welcome contributions! Please read our contributing guidelines for more details.

## License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
