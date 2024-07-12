import fs from "fs";
import os from "os";
import path from "path";
// const __dirname = path.resolve();
import { execSync } from "child_process";

const pack_name = "@devpm/mirada";

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
  const platform = os.platform();

  if (platform === "win32") {
    // Delete node_modules folder
    if (fs.existsSync("node_modules")) {
      execSync("rmdir /s /q node_modules", { stdio: "inherit" });
    }

    // Delete package.json file
    // execSync("del package.json", { stdio: "inherit" });

    // Delete package-lock.json file
    if (fs.existsSync("package-lock.json")) {
      execSync("del package-lock.json", { stdio: "inherit" });
    }
  } else {
    // Delete node_modules folder
    if (fs.existsSync("node_modules")) {
      execSync("rm -rf node_modules", { stdio: "inherit" });
    }
    // Delete package.json file
    // execSync("rm package.json", { stdio: "inherit" });

    // Delete package-lock.json file
    if (fs.existsSync("package-lock.json")) {
      execSync("rm package-lock.json", { stdio: "inherit" });
    }
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

if (!isGlobalInstallation()) {
  console.error(`
    ==========================================
    ERROR: This package must be installed globally.
    ==========================================
    Please install the package using the following command:

    =>  npm install -g ${pack_name} 

    For more information, please visit our documentation.
    `);

  checkInstallation();

  process.exit(1);
}
