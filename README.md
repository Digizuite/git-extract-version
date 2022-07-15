# Git Extract Version action

This action extracts the current version from the branch name/git tag. If a version name is not provided
it falls back to the given `main_version` number. 

## Outputs

|name| description                 |
|----|-----------------------------|
|version|The extracted version number|


## Example

```yaml
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    name: Build with a specific version number
    steps:
      - name: Extract version
        id: version
        uses: digizuite/git-extract-version
        with:
          main_version: '6.6.6' # Version to use if version cannot be extracted from branch name

      - name: Get the output version
        run: echo "The version is ${{ steps.version.outputs.version }}"
```
