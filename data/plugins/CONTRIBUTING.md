## How to contribute

If you wish to recommend a plugin or framework not included yet in the list:

1. create a `.json` file in [data/plugins/myplugin.json](data/plugins/myplugin.json) including plugins credentials as
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

2. (optional) (make sure that the repository fulfils the below criteria)
- criterion 1
- criterion 2

3. fork this repository and submit a merge request along the lines of:
```
PR: add myplugin

BODY: explain purpose of myplugin
```
