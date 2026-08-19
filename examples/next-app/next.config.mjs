/** @type {import('next').NextConfig} */
export default {
  // Don't scatter generated AGENTS.md / CLAUDE.md through the example.
  agentRules: false,
  // align/ lives outside this app's directory; without this Next refuses to
  // compile the TypeScript it finds there.
  experimental: { externalDir: true },
};
