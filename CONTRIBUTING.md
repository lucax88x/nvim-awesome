# How to contribute

If you wish to recommend a plugin or framework not included in the list yet:

1. create a `.json` file in `src/nvim-awesome.app/data/plugins/owner-repository.json` including plugins credentials as the following example

```
{
  "name": "myplugin",
  "description": "an awesome neovim plugin",
  "link": "https://github.com/{owner}/{name}",
  "tags": [
    "awesomeness",
    "coolness"
  ],
  "examples": [
    { "label": "video", "link": "http://cool-video.mp4" },
    { "label": "image", "link": "http://awesome-photo.jpg" }
  ]
}
```

2. fork this repository and submit a merge request along the lines of:

```
PR: add myplugin

BODY: explain purpose of myplugin
```
