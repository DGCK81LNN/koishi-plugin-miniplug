# koishi-plugin-miniplug

[![koishi-plugin-miniplug](https://img.shields.io/npm/v/koishi-plugin-miniplug?label=koishi-plugin-miniplug&style=flat-square)](https://www.npmjs.com/package/koishi-plugin-miniplug) [![koishi-plugin-codemirror](https://img.shields.io/npm/v/koishi-plugin-codemirror?label=koishi-plugin-codemirror&style=flat-square)](https://www.npmjs.com/package/koishi-plugin-codemirror)

在 Koishi 控制台中编写简单 JavaScript 插件

![](images/screenshot.png)

## 用法

安装 [`koishi-plugin-codemirror`](plugins/codemirror/) 和 `koishi-plugin-miniplug`。添加并启用控制台插件 `codemirror` 后，就可以添加任意数量的 `miniplug` 插件，然后通过其 `code` 配置项编写自定义插件了。
