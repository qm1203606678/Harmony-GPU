**目前 GSCompare 用的是 HarmonyOS 原生的单 PLY 渲染路径。** 我核对了 `entry.zip` 和 `B603_HarmonyOS_Profile.zip` 中的 `Index.ets`。两版都通过 Spatial Recon Kit 的 `GSPlugin.loadGSNode()` 加载模型，通过 ArkGraphics 3D 的 `FORWARD` 相机渲染，再由 ArkUI 的 `Component3D` 以 `SURFACE` 模式显示。原始工程快照引用的是 `point_cloud.ply`，性能采集版改成了 `B603.ply`，并增加了对插件初始化结果的检查。Windows 本机工程的最新版本尚未核验。 [developer.huawei.com](https://developer.huawei.com/consumer/en/doc/harmonyos-references/spatial-recon-spatialrender/?utm_source=chatgpt.com)

| 环节     | 当前实现                                                     |
| -------- | ------------------------------------------------------------ |
| 模型加载 | ArkTS 初始化 `GSPlugin`、创建 `Scene`，把单个 PLY 的 URI 交给 `loadGSNode()`。 |
| 相机回放 | ArkTS 读取 `camera_path.json`，由 `displaySync` 驱动位置和四元数插值，更新相机位姿。 |
| 高斯绘制 | 系统插件处理模型并绘制。`FORWARD` 是相机配置，仅凭它无法判断高斯如何剔除、投影、排序和混合，也无法确认排序跑在 CPU 还是 GPU、模型如何驻留以及实际使用的图形后端。 |
| 屏幕显示 | `Component3D` 显示场景。性能采集版另外暴露了渲染分辨率比例，默认是 `100%`。 |

**源码方面，华为公开了 SDK 接口和调用示例。我没有找到 Mate 80 Pro 上 `GSPlugin` 的高斯渲染实现或着色器源码。** OpenHarmony 的 [`graphic_graphic_3d`](https://github.com/openharmony/graphic_graphic_3d?utm_source=chatgpt.com) 仓库可以查看通用 3D 引擎、插件框架和渲染后端，但从该仓库无法确认手机端高斯插件的具体实现。 [developer.huawei.com](https://developer.huawei.com/consumer/en/doc/doccenter-capabilities/spatial-recon-load/?utm_source=chatgpt.com)

和内存优化直接相关的是，华为从 **26.0.0** 起还公开了 `loadTiledGSNode()`。它接受描述分块层级的 JSON 清单，由相机驱动选块，应用可通过回调获取所需块并通知渲染器文件已就绪。**现有两版工程都走单 PLY 路径。** 如果当前手机和 SDK 支持分块接口，就可以用同一条相机轨迹对比单 PLY 与分块加载的峰值内存、常驻内存和首屏时间。 [developer.huawei.com](https://developer.huawei.com/consumer/en/doc/harmonyos-references/spatial-recon-spatialrender/?utm_source=chatgpt.com)

此前的交接包也已生成并通过完整性检查，含两份交接文档和 12 份现有资料。`B603.ply` 与 Windows 上的最新工程需从本机补入。 Huawei_3DGS_Handoff.zip