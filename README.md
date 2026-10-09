# DualSubs 本地设置

同一份 PreferencePanes `home.html` 原样部署到 `/settings/index.html`。源码 `settings` 目录只提供固定路径的 `home.json` 和 `assets`，不维护项目首页 HTML、启动脚本、品牌 CSS 或 Bridge。JSON 定义品牌、分组、面板、图标与官网／组织／论坛入口。

官网入口声明 `target: "internal"`，在保留标题与返回的框架中显示；GitHub 组织和官方论坛声明 `target: "_blank"`，请求新窗口或标签，保留设置页。`_self` 可用于整页跳转，省略时保持原宿主行为。网页无法保证启动指定外部浏览器。

首页内置程序、默认 CSS 与网页标题栏、返回、菜单、确认框和 Toast。固定读取 `./home.json` 后探测 `./theme.css`、`./bridge.mjs`；两者 HEAD 返回 404 时使用默认功能，不请求适配模块或客户端 SDK，不通过 UA 启用原生接入。返回 200 才加载，其它状态或加载失败明确报错。网格／列表、四／六／八列与居中版本由共用框架提供。

```sh
pnpm settings:build
pnpm settings:check
pnpm build
pnpm settings:test
pnpm settings:preview
```

构建默认使用 PreferencePanes `v1.3.0` Release 的 `home.html`，与 Universal 模板中的模块页、脚本和存储 API 保持同版。验收未发布模板时，先构建 PreferencePanes，并为上述命令指定同一份本地文件：

```sh
export PREFERENCE_PANES_HOME=/Users/clyne/GitHub/NSNanoCat/PreferencePanes/dist/home.html
```

构建只复制 JSON 和 JSON 引用的本地图片。预览标记、部署时间与提交号追加到生成 JSON 的 `footer`；预览与部署 HTML 与框架字节一致，不替换输入属性或标题。测试位于 `tests`，构建与预览沿用 `scripts`。

先构建同级 Universal 与 NSNanoCat/PreferencePanes，再打开预览命令输出的 HTTP 地址。`file://` 无法提供模块页与 API。默认预览开发面板，`SETTINGS_CHANNEL=formal` 切换正式面板。Universal 继续映射通用模块页与 `index.mjs`，并提供现有配置和固定存储 API。


首页与设置页的默认 CSS 已合并为 PreferencePanes 的 `styles.css`，复用同一安装与清理逻辑，构建时随页面内置。默认 CSS 源码为一份；Biliverse 额外提供一份 `theme.css`，DualSubs 不提供品牌 CSS。

## 本地验收记录（2026-10-09）

两站预览／部署 HTML 与 PreferencePanes `dist/home.html` 的 SHA-256 相同。共用框架 71 项、Enhanced 53 项、Universal 4 项及两站打包／Bridge 测试通过；两站 TypeScript 检查与完整构建通过。原图哈希与图标透明度／居中校验通过。

浏览器实际渲染验证了 390／600／800px 下的四／六／八列、混合分组、真实图标、居中版本／页脚、帮助链接与 API 面板别名。未提供 Bridge 时无模块导入或 SDK 请求；品牌 CSS 覆盖有效。JSON 失败、可选资源 HEAD 500／503、CSS 与 Bridge 加载失败、Bridge 语法与初始化失败均显示错误。Bilibili Bridge 使用本地 SDK 测试替身验证原生标题、MORE、主题和无重复网页标题栏／Toast；确认、取消、键盘、退出与迟到回调通过行为测试。

iOS 18.6 Safari 模拟器实际检查了首页四列、设置导航、菜单、共享缓存确认／取消及返回。iOS 15 和真实 Bilibili Common WebView 本次未覆盖，仍需设备验收；本次产物未发布。

CSS 合并后重新通过框架 71 项及两站 6 项测试、框架类型检查和两站完整构建。浏览器核对首页与 iframe 各安装一份相同默认样式，品牌覆盖和四／六／八列有效；实际挂载／卸载面板保持外层网页的边距、字体、颜色和配色模式。iOS 18.6 Safari 回归首页、设置页、菜单与返回正常。

外链打开方式补齐后通过框架 72 项及两站 7 项测试、框架类型检查和 Apifox 一致性校验，两站设置产物已重新生成。Codex 浏览器实际验证官网内部导航、沿网页历史返回到官网及设置首页、GitHub 新标签和原设置页保留；Bilibili 新页仅验证了 SDK 测试替身的成功／失败及迟到回调，实际容器行为仍需 Common WebView 设备验收。

## Universal 接入验收（2026-10-10）

使用已发布的 PreferencePanes `v1.3.0` 重新构建，预览与部署首页均与 Release 模板字节一致。站点打包测试、TypeScript 检查和完整构建通过；Universal 5 项测试、正式／开发模板构建、Egern 转换与 Surge 离线配置检查通过。Codex 浏览器核对了九个面板入口、Universal 外挂字幕选项和逐级返回。本次提交保留在 `dev`，未推送或部署。
