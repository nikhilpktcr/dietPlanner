import fs from "fs";
import path from "path";
import chalk from "chalk";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

// Emulate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reportPath = path.resolve(process.cwd(), "eslint-report.json");

// Step 1: Run ESLint and generate report
try {
  console.log(chalk.blue("🔍 Running ESLint..."));
  execSync("npx eslint . --ext .ts,.js --format json -o eslint-report.json", {
    stdio: "inherit",
  });
} catch (err) {
  console.error(chalk.red("❌ ESLint execution failed."));
  process.exit(1);
}

// Step 2: Read and display the report
if (!fs.existsSync(reportPath)) {
  console.error(chalk.red("❌ ESLint report not found."));
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));

let totalErrors = 0;
let totalWarnings = 0;
let passedFiles = 0;

console.log(chalk.bold("\nTest Suites: ESLint Report\n"));

report.forEach((file) => {
  const fileName = path.relative(process.cwd(), file.filePath);
  const errors = file.errorCount;
  const warnings = file.warningCount;

  totalErrors += errors;
  totalWarnings += warnings;

  if (errors === 0 && warnings === 0) {
    passedFiles++;
    console.log(chalk.green(`✓ ${fileName}`));
  } else {
    console.log(chalk.red(`✖ ${fileName}`));
    file.messages.forEach((msg) => {
      const severity =
        msg.severity === 2 ? chalk.red("error") : chalk.yellow("warning");
      console.log(
        `  ${chalk.gray(msg.ruleId || "unknown")} - ${severity}: ${msg.message}`
      );
    });
  }
});

console.log("\n" + chalk.bold("Summary:"));
console.log(chalk.green(`  Passed files: ${passedFiles}/${report.length}`));
console.log(chalk.red(`  Total Errors: ${totalErrors}`));
console.log(chalk.yellow(`  Total Warnings: ${totalWarnings}\n`));

if (totalErrors === 0) {
  console.log(chalk.green.bold("✔ All files passed linting!\n"));
} else {
  console.log(chalk.red.bold("✖ Linting issues detected.\n"));
}
