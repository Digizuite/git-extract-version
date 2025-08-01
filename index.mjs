import core from '@actions/core'

const branchVersionRegex = /^.*?\/(?<version>\d+\.\d+\.\d+)(?:\/(?:.*)+)?$/;
const versionTagRegex = /^v(?<version>\d+\.\d+\.\d+)$/;
const maxBranchNameLength = 32;

function getBranchInfoNumber(refName) {
    const name = refName
        .replaceAll(/[\/_]/g, '-')
        .replaceAll(/[^0-9A-Za-z-]/g, '');

    if (name.length > maxBranchNameLength) {
        return name.substring(0, maxBranchNameLength);
    }
    return name;
}

function extractVersionNumber() {
    const refName = process.env.GITHUB_REF_NAME;
    const runNumber = process.env.GITHUB_RUN_NUMBER;
    const result = branchVersionRegex.exec(refName) ?? versionTagRegex.exec(refName);
    const mainVersion = core.getInput('main_version');
    let version;

    if (result === null) {
        version = mainVersion;

        if (refName !== 'master') {
            core.info('Not on master branch, adding branch name to build name');
            version += "-" + getBranchInfoNumber(refName);
        }

        core.info(`Version number was not found in branch name, assuming latest. Got RefName: '${refName}'. Falling back to main version: '${version}'`);
    } else {
        version = result.groups.version;
        if (!refName.startsWith('release/')) {
            core.info('not on a strict release branch, adding more info to build number')
            version += "-" + getBranchInfoNumber(refName);
        }
        core.info(`Version was extracted from refname without issues: '${version}'`);
    }

    const fullVersionNumber = `${version}-${runNumber}`;
    core.setOutput('version', fullVersionNumber);
    core.setOutput('release_version', result?.groups?.version ?? mainVersion);
}

try {
    extractVersionNumber();
} catch (error) {
    core.setFailed(error.message);
}
