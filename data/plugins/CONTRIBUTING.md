## How to contribute

If you wish to recommend a plugin or framework not included in the list yet:

1. create a `.json` file in `data/plugins/owner-repository.json` including plugins credentials as
```
{
  "name": "myplugin",
  "description": "an awesome neovim plugin",
  "link": "https://neovim.io/",
  "tags": [
    "awesomeness",
    "coolness",
    "lua"
  ],
  "examples": []
}
```
based off the [template](template.json) (please use existing tags when possible).

2. fork this repository and submit a merge request along the lines of:
```
PR: add myplugin

BODY: explain purpose of myplugin
```
