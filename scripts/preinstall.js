// import path from "path";
// const __dirname = path.resolve();
// import { execSync } from "child_process";

const isGlobal = process.argv.includes("-g");

console.log(888, com);

function checkGlobalInstallation() {
  if (!isGlobal) {
    console.error(`
    ==========================================
    ERROR: This package must be installed globally.
    ==========================================
    Please install the package using the following command:
    
    =>  npm install -g @devpm/mirada +++++++++
    
    For more information, please visit our documentation.
    `);
    process.exit(1);
  }
}

try {
  checkGlobalInstallation();
} catch (error) {
  console.error(`
  ==========================================
  ERROR: An unexpected error occurred during installation.
  ==========================================
  Error Details: ${error.message}
  Please try installing the package globally using the following command:
  
  =>  npm install -g @devpm/mirada ------

  If the issue persists, please report it to our support team.
  `);
  process.exit(1);
}
