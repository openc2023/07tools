# 07 Tools

STUDIO 7 的离线小工具集合：https://openc2023.github.io/07tools/

界面沿用主页 STUDIO 7 desk 的控制台样式和开场动画：`styles.css` 和 `app.js` 里的背景字符场、乱码解码、boot 部分都复制自 web-media/personal/desk/，`tools.css` 是本站的补充样式。

| 工具 | 路径 | 版本 |
| --- | --- | --- |
| Sprite Align | `sprite-align/` | v2.0 |

## 新增工具

1. 新建文件夹 `<slug>/`，把工具的单文件 HTML 放进去，命名为 `index.html`。
2. 在 `data.js` 的 `TOOLS` 数组里加一项：名称、版本、更新时间、标签，以及三语简介和功能列表。
3. 把 `index.html` 里引用资源的 `?v=` 版本号加一，避免浏览器读到旧缓存。
4. 在本 README 的表格里补一行。
