# Branching and Releases

## Long-Running Branches

- `n.x`: Stable release branches where `n` is a major version of the package (e.g., `1.x` for version `^1.0.0`)
  - These branches will be periodically updated with minor and patch releases as we enhance the package
  - A release will be made upon each merge to the branch with the release being published to the npm package registry
- `main`: The latest version of the project, which may be unstable and will not be directly release
  - Upon successful release of a new major version, we will begin using the `main` branch for all dev efforts and create period PRs against the latest `n.x` branch with non-breaking updates
  

## Vulnerability Fixes and Dependency Audits

As we get dependabot alerts and/or issues reported by users, we will bump the version for our dev dependencies. When this happens, we will make a PR against each release branch (e.g., all `x.x` branches such as `1.x`, `2.x` etc.) and against `main`
