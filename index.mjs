import core from '@actions/core'

const branchVersionRegex = /^(?:.*?)\/(?<version>\d+\.\d+\.\d+)(?:\/(?:.*)+)?$/;
const versionTagRegex = /^v(?<version>\d+\.\d+\.\d+)$/;
try {

    const refName = process.env.GITHUB_REF_NAME;
    const result = branchVersionRegex.exec(refName) ?? versionTagRegex.exec(refName);
    if(result === null) {
        core.info(`Version number was not found in branch name, assuming latest. Got RefName: '${refName}'`)
        core.setOutput('version', core.getInput('main_version'))
    } else {
        const version = result.groups.version;
        core.info(`Version was extracted from refname without issues: '${version}'`);
        core.setOutput('version', version);
    }

} catch(error) {
    core.setFailed(error.message);
}
