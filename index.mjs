import core from '@actions/core'

const branchVersionRegex = /^.*?\/(?<version>\d+\.\d+\.\d+)(?:\/(?:.*)+)?$/;
const versionTagRegex = /^v(?<version>\d+\.\d+\.\d+)$/;

function extractVersionNumber() {
    const refName = process.env.GITHUB_REF_NAME;
    const result = branchVersionRegex.exec(refName) ?? versionTagRegex.exec(refName);
    let version;
    if (result === null) {
        version = core.getInput('main_version');
        core.info(`Version number was not found in branch name, assuming latest. Got RefName: '${refName}'. Falling back to main version: '${version}'`);
    } else {
        version = result.groups.version;
        core.info(`Version was extracted from refname without issues: '${version}'`);
    }
    return version;
}

try {

    const version = extractVersionNumber();

    core.setOutput('version', version);

} catch(error) {
    core.setFailed(error.message);
}
