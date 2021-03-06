const githubClientID = process.env.GITHUB_CLIENT_ID || "YOUR_GITHUB_CLIENT_ID";
const githubPrivateRepoAccessClientID =
  process.env.GITHUB_PRIVATE_REPO_ACCESS_CLIENT_ID ||
  "YOUR_GITHUB_PRIVATE_REPO_ACCESS_CLIENT_ID";
const rcApiDomain =
  process.env.RC_API_DOMAIN || "YOUR_SELF_HOSTED_RC_API_DOMAIN";
const githubApiDomain =
  process.env.GITHUB_API_DOMAIN || "https://api.github.com";
const rc4gitDomain =
  process.env.RC4GIT_DOMAIN || "YOUR_SELF_HOSTED_RC4GIT_CLIENT"

export {
  githubClientID,
  githubPrivateRepoAccessClientID,
  rcApiDomain,
  githubApiDomain,
  rc4gitDomain
};
