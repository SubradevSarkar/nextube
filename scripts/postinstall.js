import fs from "fs";
import path from "path";
import { execSync } from "child_process";

import { pack_name } from "./brand.js";

// safe checkered

function getGlobalNpmPath() {
  try {
    const npmPrefix = path.resolve(execSync("npm root -g").toString().trim());
    return npmPrefix;
  } catch (error) {
    console.error("Error getting global npm path:", error);
    return null;
  }
}

function removeLocalFiles() {
  try {
    // Delete node_modules folder
    if (fs.existsSync("node_modules")) {
      fs.rmSync("node_modules", { recursive: true, force: true });
    }

    // Delete package-lock.json file
    if (fs.existsSync("package-lock.json")) {
      fs.rmSync("package-lock.json", { force: true });
    }
  } catch (error) {
    console.error("Error occurred while deleting files and folders:", error);
  }
}

function checkInstallation() {
  if (fs.existsSync("package.json")) {
    const pack = JSON.parse(fs.readFileSync("package.json"))?.dependencies;
    if (pack.hasOwnProperty(pack_name) && Object.keys(pack).length > 1) {
      execSync(`npm remove ${pack_name}`);
    } else {
      execSync(`npm remove ${pack_name}`);
      removeLocalFiles();
    }
  }
}

function isGlobalInstallation() {
  const globalPath = getGlobalNpmPath();
  if (!globalPath) return false;

  const global_installed_package_path = path.join(globalPath, pack_name);
  const isPathExist = fs.existsSync(global_installed_package_path);

  if (isPathExist) {
    const isFolderEmpty =
      fs.readdirSync(global_installed_package_path).length === 0;

    return !isFolderEmpty;
  }

  return isPathExist;
}

try {
  if (!isGlobalInstallation()) {
    console.error(`
    ==========================================
    ERROR: This package must be installed globally.
    ==========================================
    Please install the package using the following command:

    On Windows:
      =>  npm install -g ${pack_name}

    On Linux/UNIX:
      =>  sudo npm install -g ${pack_name}

    For more information, please visit our documentation.
    `);

    checkInstallation();

    process.exit(1);
  }
} catch (error) {
  process.exit(1);
}
