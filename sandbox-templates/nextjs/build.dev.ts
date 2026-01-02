import { Template, defaultBuildLogger } from "e2b";
import template from "./template";

async function main() {
  await Template.build(template, {
    alias: "vibe-v2-test-2",
    onBuildLogs: defaultBuildLogger(),
    apiKey: process.env.E2B_API_KEY,
  });
}

main().catch(console.error);
