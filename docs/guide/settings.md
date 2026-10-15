# ⚙️ 偏好面板

DualSubs 的[在线设置面板](https://dualsubs.github.io/settings/)用于配置已安装的插件、字幕与歌词处理方式及第三方 API，无需安装 BoxJs。面板由整个 DualSubs 项目共用，使用 [PreferencePanes 配置模板](https://github.com/NSNanoCat/PreferencePanes)。

## 进入设置页面

1. 安装并启用最新版 [Universal](./universal#安装链接)。它提供共用设置面板的本机存储读写功能；使用 YouTube、Netflix 或 Spotify 时，还需安装对应插件。
2. 在安装插件的设备上保持代理工具运行，确认模块／插件已启用、`dualsubs.github.io`的 HTTPS 解密生效。
3. 点击官网导航栏的「设置面板」；手机上可先展开导航菜单。也可直接用浏览器打开 <https://dualsubs.github.io/settings/>。
4. 选择显示版本号的入口进入面板。修改选项或输入内容后自动保存，无需额外点击保存按钮；重新进入面板可核对已保存的值。

设置保存在当前代理工具的持久化存储中，与 BoxJs 共用原有设置。更换设备或代理工具后，设置不会自动同步。

入口显示「未安装」或无法打开时，请检查对应插件是否已更新并启用、浏览器流量是否经过该代理工具，以及 `dualsubs.github.io` 的 HTTPS 解密是否正常。仅打开网页不能代替安装插件。

## 配置来源与优先级

为避免模块／插件参数覆盖在线面板或 BoxJs 中保存的设置，默认采用「持久化存储优先」（`Storage=PersistentStore`）。没有保存的字段继续使用模块／插件参数，再回退到脚本默认值。

「[储存] 配置类型」位于代理工具的模块／插件参数中，不在在线面板或 BoxJs 中设置：

| 配置类型 | 参数值 | 优先级（由高到低） |
| --- | --- | --- |
| 持久化存储优先（默认） | `PersistentStore` | 在线面板／BoxJs → 模块／插件参数 → 脚本默认值 |
| 插件配置优先 | `Argument` | 模块／插件参数 → 在线面板／BoxJs → 脚本默认值 |
| 仅使用默认配置 | `database` | 只使用脚本默认值 |

如需继续优先使用模块／插件中的配置，将「[储存] 配置类型」设为「插件配置优先」（`Storage=Argument`）。旧安装中已保存的配置类型不会随模块更新自动改变；使用在线面板前，请确认其为 `PersistentStore`。

## 选择对应面板

| 首页分组 | 面板 | 设置内容 |
| --- | --- | --- |
| 插件 | Universal、YouTube、Netflix、Spotify | 对应平台的字幕／歌词类型、语言、自动显示及日志设置 |
| 字幕与歌词 | 合成器 | 官方双语及外挂字幕的位置、时间轴匹配与缓存 |
| 字幕与歌词 | 翻译器 | 翻译服务、双语位置、翻译方式与重试 |
| 字幕与歌词 | 外部源 | 外部歌词来源与缓存；开发版还提供外挂字幕来源 |
| API | 翻译器 API | Google Cloud、Microsoft、DeepL 等服务的认证信息 |
| API | 外部源 API | 开发版的外挂字幕地址及网易云音乐账号信息 |

「合成器」「翻译器」「外部源」及 API 面板为共用设置，影响使用对应功能的各平台。字幕位置和翻译服务应在对应的共用面板调整；持久化配置优先时，共用面板已保存的同名设置会覆盖平台模块参数。

## 设置项与默认值

下表列出正式版在线面板的默认值；已有保存值会继续保留。模块／插件参数与开发版的差异在后文单独列出。

### Universal

| 设置项 | 默认值 | 可选项与说明 |
| --- | --- | --- |
| [字幕] 启用类型（`Types`） | 官方字幕、翻译字幕 | 多选；官方字幕使用合成器，翻译字幕使用翻译器 |
| [字幕] 主语言（源语言）（`Languages[0]`） | 自动（`AUTO`） | 按平台提供的字幕轨道及语言回退规则选择源语言，不固定为英文 |
| [字幕] 副语言（目标语言）（`Languages[1]`） | 中文（自动）（`ZH`） | 中文、英语、西班牙语等；需要固定简体中文时选择 `ZH-HANS` |
| [调试] 日志等级（`LogLevel`） | 警告（`WARN`） | `OFF`、`ERROR`、`WARN`、`INFO`、`DEBUG`、`ALL` |

语言选项包括中文（自动／简体／香港／繁体）、英语、西班牙语、日语、韩语、德语、法语、土耳其语和高棉语；主语言另有「自动」。主语言和副语言表示字幕语言，显示在哪一行由「合成器」或「翻译器」的位置设置决定。

### YouTube

| 设置项 | 默认值 | 可选项与说明 |
| --- | --- | --- |
| [字幕] 启用类型（`Type`） | 官方字幕（`Official`） | 官方字幕使用 YouTube 的字幕及自动翻译进行合成；选择 `Translate` 时使用共用翻译器 |
| [歌词] 启用类型（`Types`） | 翻译歌词（`Translate`） | 正式版提供翻译歌词 |
| [字幕] 自动显示（`AutoCC`） | 开启（`true`） | 自动开启字幕；目标语言优先使用上次选择的自动翻译语言 |
| [翻译器] 只显示“自动翻译”字幕（`ShowOnly`） | 关闭（`false`） | 默认保留源语言字幕；开启后仅显示目标语言字幕 |
| [调试] 日志等级（`LogLevel`） | 警告（`WARN`） | 与 Universal 相同 |

首次使用时，请在播放器「字幕 → 自动翻译」中选择一次目标语言；以后自动显示会沿用该语言。源语言来自当前字幕轨道。在线 YouTube 面板不提供固定语言字段。

### Netflix 与 Spotify

| 面板 | 设置项 | 默认值 |
| --- | --- | --- |
| Netflix | [字幕] 启用类型（`Type`） | 翻译字幕（`Translate`） |
| Netflix | [字幕] 主语言／副语言（`Languages`） | 自动（`AUTO`）／中文（自动）（`ZH`） |
| Netflix | [调试] 日志等级（`LogLevel`） | 警告（`WARN`） |
| Spotify | [歌词] 启用类型（`Types`） | 翻译歌词、外部歌词（`Translate`、`External`） |
| Spotify | [翻译器] 主语言／副语言（`Languages`） | 自动（`AUTO`）／中文（自动）（`ZH`） |
| Spotify | [调试] 日志等级（`LogLevel`） | 警告（`WARN`） |

### 合成器

| 设置项 | 默认值 | 说明 |
| --- | --- | --- |
| 播放记录缓存数量（`CacheSize`） | `20` | 同时处理多个设备时，建议不小于播放设备数，最大可用值为 50 |
| 主语言（源语言）字幕位置（`Position`） | 下面／第二行（`Reverse`） | 可改为上面／第一行（`Forward`） |
| [合成器] 时间偏移量（`Offset`） | `0` 毫秒 | 调整两份字幕之间的时间偏移，可为正负整数 |
| [合成器] 时间戳公差（`Tolerance`） | `1000` 毫秒 | 匹配不同语言字幕时允许的时间误差 |

### 翻译器

| 设置项 | 默认值 | 可选项与说明 |
| --- | --- | --- |
| 服务商 API（`Vendor`） | Google Translate（`Google`） | Google、Google Cloud、Microsoft、DeepL；后三者需配置对应 API |
| 只显示翻译字幕（`ShowOnly`） | 关闭（`false`） | 默认输出源语言及译文 |
| 主语言（源语言）字幕位置（`Position`） | 上面／第一行（`Forward`） | 可改为下面／第二行（`Reverse`） |
| [翻译器] 翻译方式（`Method`） | 逐段翻译（`Part`） | 将多句字幕合并请求，保留上下文；也可选择逐句翻译（`Row`） |
| [翻译器] 重试次数（`Times`） | `3` 次 | 翻译请求失败后的重试次数 |
| [翻译器] 重试间隔时长（`Interval`） | `500` 毫秒 | 初始重试间隔 |
| [翻译器] 重试间隔时长递增（`Exponential`） | 开启（`true`） | 后续重试间隔递增 |

### 外部源

| 设置项 | 默认值 | 可选项与说明 |
| --- | --- | --- |
| [歌词] 服务商 API（`LrcVendor`） | 网易云音乐（官方）（`NeteaseMusic`） | 也可选择 QQ 音乐（`QQMusic`）或网易云音乐 NodeJS API（`NeteaseMusicNodeJS`） |
| 播放记录缓存数量（`CacheSize`） | `50` | 缓存外部歌词的歌曲记录 |

### 翻译器 API

| 服务 | 设置项 | 面板默认值 |
| --- | --- | --- |
| Google Cloud | API 版本（`GoogleCloud.Version`） | `v2`，可选 `v3` |
| Google Cloud | 认证方式（`GoogleCloud.Mode`） | 密钥（`Key`）；令牌模式暂不支持 |
| Google Cloud | 认证内容（`GoogleCloud.Auth`） | 空，需要填写服务密钥 |
| Microsoft Translator | API 版本（`Microsoft.Version`） | 国际版（`Azure`），可选中国版（`AzureCN`）或美国政府版（`AzureUS`） |
| Microsoft Translator | 认证方式（`Microsoft.Mode`） | Edge Translator 令牌（`Token`），可选 Azure 密钥（`Key`） |
| Microsoft Translator | Azure 区域代码（`Microsoft.Region`） | `global`；密钥模式按 Azure 资源的实际区域填写 |
| Microsoft Translator | 认证内容（`Microsoft.Auth`） | 空，需要填写令牌或密钥 |
| DeepL | API 版本（`DeepL.Version`） | `Free`，可选 `Pro` |
| DeepL | API 认证内容（`DeepL.Auth`） | 空，需要填写服务密钥 |

先在「翻译器 API」填写认证信息，再在「翻译器」选择对应服务。使用默认 Google Translate 无需填写这些认证信息。

### 模块／插件参数

在线面板按功能拆分设置，模块／插件参数仍保留常用快捷选项：

| 参数 | 默认值与说明 |
| --- | --- |
| `Storage` | `PersistentStore`；仅在模块／插件参数中选择配置优先级 |
| `Position` | Universal 为 `Reverse`；YouTube、Netflix 为 `Forward`；在线面板分别在「合成器」「翻译器」调整 |
| `Vendor` | `Google`；快捷选项提供 Google 和 Microsoft，完整选项在「翻译器」面板 |
| `ShowOnly` | `false`；Universal、YouTube、Netflix 提供此参数 |
| `LrcVendor` | Spotify 为 `NeteaseMusic`；在线面板在「外部源」调整 |

### 开发版面板差异

- Universal 增加「外挂字幕」（`External`）选项，以及美式英语、西班牙语地区和 `[CC]` 字幕选项；默认启用类型仍为官方字幕、翻译字幕。
- YouTube 的歌词默认启用翻译歌词和外部歌词（`Translate`、`External`）。
- 「翻译器」增加百度翻译、百度翻译开放平台、有道翻译、有道智云、Microsoft Bing、DeepL X；翻译结果缓存数量（`CacheSize`）默认为 `10`。
- 「外部源」增加外部字幕服务商（`SubVendor`），默认网页地址（`URL`）。启用 Universal 的「外挂字幕」后，在「外部源 API」填写完整 HTTP(S) 字幕文件地址（`URL`，默认空），支持 WebVTT 和 SRT。
- 「翻译器 API」增加 DeepL X 的终结点（`DeepLX.Endpoint`）和认证内容（`DeepLX.Auth`），默认均为空。
- 「外部源 API」增加网易云音乐手机号码（`NeteaseMusic.PhoneNumber`）和密码（`NeteaseMusic.Password`），默认均为空。

## 使用 BoxJs 配置

BoxJs 仍可配置相同的持久化设置，安装与订阅方法见 [BoxJs 指南](./box-js)。在线面板和 BoxJs 修改的是同一份数据，后保存的值生效；配置来源仍由模块／插件的 `Storage` 参数决定。
