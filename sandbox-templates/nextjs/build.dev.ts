import { Template, defaultBuildLogger } from "e2b";
import template from "./template";

async function main() {
  await Template.build(template, {
    alias: "vibe-v2-test-2",
    onBuildLogs: defaultBuildLogger(),
    apiKey: "e2b_588fe06c06a8239a2e8625ac9e1943e30b3e7f95",
  });
}

main().catch(console.error);
