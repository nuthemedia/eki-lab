import { execFileSync } from "node:child_process";

const repository = "nuthemedia/eki-lab";

function fail(message) {
  console.error(`[production-deploy-guard] ${message}`);
  process.exit(1);
}

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

async function verifyVercelBuild() {
  if (process.env.VERCEL_ENV !== "production") {
    console.log("[production-deploy-guard] Preview build allowed.");
    return;
  }

  const deploymentSha =
    process.env.AWAI_DEPLOY_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA;
  if (!deploymentSha) {
    fail("Production build has no verified commit SHA.");
  }

  let response;
  try {
    response = await fetch(
      `https://api.github.com/repos/${repository}/commits/main`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "awai-commons-production-deploy-guard",
        },
      },
    );
  } catch (error) {
    fail(`Could not reach GitHub main (${String(error)}).`);
  }

  if (!response.ok) {
    fail(`Could not verify GitHub main (${response.status}).`);
  }

  const { sha: mainSha } = await response.json();
  if (deploymentSha !== mainSha) {
    fail(
      `Refusing stale production source: deployment ${deploymentSha}, main ${mainSha}.`,
    );
  }

  console.log(`[production-deploy-guard] Verified GitHub main ${mainSha}.`);
}

function verifyLocalCheckout() {
  if (git("status", "--porcelain")) {
    fail("Working tree is not clean.");
  }

  execFileSync("git", ["fetch", "origin", "main"], { stdio: "inherit" });
  const headSha = git("rev-parse", "HEAD");
  const mainSha = git("rev-parse", "origin/main");

  if (headSha !== mainSha) {
    fail(`HEAD ${headSha} does not match origin/main ${mainSha}.`);
  }

  console.log(`[production-deploy-guard] Local checkout verified at ${mainSha}.`);
  return mainSha;
}

if (process.env.VERCEL === "1") {
  await verifyVercelBuild();
} else {
  const mainSha = verifyLocalCheckout();

  if (process.argv.includes("--deploy")) {
    execFileSync(
      "npx",
      [
        "--yes",
        "vercel@56.1.0",
        "deploy",
        "--prod",
        "--yes",
        "--build-env",
        `AWAI_DEPLOY_COMMIT_SHA=${mainSha}`,
      ],
      { stdio: "inherit" },
    );
  }
}
