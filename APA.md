\# Android GPU Trace 采集简易操作手册



\## 1. 概述



本文介绍如何使用 \*\*Android Performance Analyzer（APA）\*\* 工具采集 Android 手机的系统性能 Trace，包括 CPU 调度、GPU 负载、GPU 性能计数器（GPU Counters）等数据。



\*\*适用场景：\*\* Android 游戏性能分析、GPU 负载分析、CPU/GPU 调度与能效优化研究。



\*\*示例测试环境：\*\*



| 项目 | 配置 |

|---|---|

| 电脑系统 | Windows 10/11 |

| 测试手机 | OnePlus 12 |

| Android 版本 | Android 15 |

| 处理器 | Snapdragon 8 Gen 3 |

| GPU | Adreno 750 |

| 测试应用 | 3DMark、三角洲行动等 |

| 采集工具 | Android Performance Analyzer（APA） |



其他 Android 手机也可以参考本手册，但 GPU Counters 的支持情况取决于设备及驱动。



\---



\## 2. 环境安装与配置



\### 2.1 安装 Android SDK Platform-Tools



下载地址：



https://developer.android.com/tools/releases/platform-tools



下载 Windows 版本，解压到指定目录，例如：



```text

D:\\Workspace\\Android\\platform-tools

```



确认该目录包含 `adb.exe` 和 `source.properties`。



打开 PowerShell，进入对应目录：



```powershell

cd D:\\Workspace\\Android\\platform-tools

.\\adb.exe version

```



如果正常输出 ADB 版本信息，说明安装成功。



\### 2.2 配置环境变量



建议设置以下环境变量：



| 变量 | 配置值（示例） |

|---|---|

| ANDROID\_HOME | `D:\\Workspace\\Android` |

| Path | `D:\\Workspace\\Android\\platform-tools` |



其中 `ANDROID\_HOME` 指向 \*\*Android SDK 根目录\*\*，不是 `platform-tools` 子目录。



可以通过 Windows 的“编辑系统环境变量”界面进行配置，也可以使用 PowerShell：



```powershell

\[Environment]::SetEnvironmentVariable(

&#x20;   "ANDROID\_HOME",

&#x20;   "D:\\Workspace\\Android",

&#x20;   "User"

)

```



将 `platform-tools` 目录添加到用户 `Path` 环境变量后，重新打开 PowerShell。



验证配置：



```powershell

echo $env:ANDROID\_HOME

adb version

where.exe adb

```



注意：APA 需要能够识别 Android SDK 及其中的 Platform-Tools 软件包。如果只有独立解压的 ADB，配置后仍无法识别，可以通过 Android Studio 的 SDK Manager 安装 `Android SDK Platform-Tools`，并将 `ANDROID\_HOME` 指向 SDK Manager 显示的 SDK 根目录。



\### 2.3 安装 APA



官方下载地址：



https://developer.android.com/android-performance-analyzer



下载 Windows 版本，解压后启动 APA。



首次打开时，可以创建一个新项目：



1\. 点击 `New Project`。

2\. 设置项目名称，例如 `GPU\_Profiling`。

3\. 选择项目保存目录。

4\. 点击确认，进入主界面。



\### 2.4 开启手机 USB 调试



在 Android 手机上：



1\. 进入“设置 → 关于手机 → 版本信息”。

2\. 连续点击版本号，开启开发者选项。

3\. 进入“开发者选项”。

4\. 开启 `USB 调试`。

5\. 使用 USB 数据线连接电脑，并允许 USB 调试授权。



打开 PowerShell：



```powershell

adb devices -l

```



正常输出示例：



```text

List of devices attached

101e55eb    device model:PJD110

```



如果显示 `device`，说明连接成功；如果显示 `unauthorized`，需要在手机上确认授权。



可使用以下命令检查设备：



```powershell

adb shell getprop ro.product.model

adb shell getprop ro.soc.model

adb shell getprop ro.build.version.release

```



\---



\## 3. APA Trace 录制参数设置



\### 3.1 进入配置界面



启动 APA，打开已创建的项目。



点击：



`Record Trace → System（如有类型选择）→ Configure`



进入：



\*\*Configure a Recording\*\*



在 `Device` 下拉框中选择已连接的 Android 手机。



设备通过验证后，通常会显示绿色对勾。



\### 3.2 选择录制模式



APA 提供两种主要模式：



| Mode | 功能 | 适用场景 |

|---|---|---|

| Launch app and record | 由 APA 启动指定应用并录制 | 应用启动过程分析 |

| Record a running app | 录制已经运行的应用 | 游戏跑分、持续负载测试 |



\*\*推荐使用 `Record a running app`。\*\*



这种模式适合 3DMark、三角洲行动等第三方应用。先在手机上启动应用，再使用 APA 开始采集。



需要注意：该模式采集的是系统级 Trace，并非只包含某个应用的数据。



\### 3.3 设置录制时间



在配置界面设置：



| 参数 | 推荐设置 |

|---|---|

| Start recording | Manual |

| End recording | Duration / Manual |

| Duration | 首次测试 30 秒 |

| Use custom trace configuration | 关闭 |

| Vulkan Layers | 首次测试关闭 |



两种结束方式：



\- \*\*Duration：\*\* 设置固定时长，到达时间后自动停止。

\- \*\*Manual：\*\* 手动点击 Start 开始，点击 Stop 结束。



对于 3DMark 等跑分应用，建议使用 `Manual`，确保完整覆盖测试过程。



对于 1 分钟以上的长时间录制，建议减少数据源和 GPU Counters 数量，避免采集开销过大。Manual 模式也不保证没有工具内部的时长、缓冲区或存储限制。



\### 3.4 配置 GPU Counters



在 `Trace configuration` 中找到：



`GPU counters → Configure`



点击 `Configure`，打开 GPU 性能计数器选择窗口。



推荐优先选择以下类型的指标（具体名称以设备实际显示为准）：



| 类型 | Counter 示例 | 作用 |

|---|---|---|

| GPU 负载 | GPU Utilization / GPU Busy | 分析 GPU 利用率 |

| GPU 计算 | Fragment / Vertex Instructions | 分析着色器工作量 |

| GPU 频率 | GPU Frequency / Clock | 分析 GPU 调频 |

| 内存访问 | Memory Read / Write | 分析内存读写速率 |

| 纹理处理 | Texture Activity / Stall | 分析纹理处理压力 |

| 缓存 | L2 Cache Counters | 分析缓存访问情况 |



第一次可以选择少量关键指标，确认录制成功后再增加其他指标。



不建议在长时间实验中无条件勾选全部 GPU Counters。



如果设备不支持某个 Counter，可以跳过。部分设备可能无法提供硬件 GPU Counters，但仍能够正常采集 CPU 调度及其他系统 Trace 数据。



\### 3.5 设置输出文件



在 `Output` 区域设置 Trace 文件名称，例如：



```text

OnePlus12\_3DMark\_GPU

```



建议每次录制按照“设备型号 + 应用名称 + 测试场景”的方式命名，便于后续整理与比较。



完成配置后点击 `OK`。



\---



\## 4. 开始录制 Trace



以 \*\*3DMark Steel Nomad Light（SNL）\*\* 跑分为例。



操作步骤：



1\. 在手机上打开 3DMark，进入 Steel Nomad Light 测试界面。

2\. 在 APA 中选择 `Record a running app` 模式。

3\. 设置 `Start recording = Manual`。

4\. 设置 `End recording = Manual`。

5\. 点击 `OK`，进入 `Control Recording` 窗口。

6\. 点击 `Start`，开始录制 Trace。

7\. 在手机上启动 SNL 跑分。

8\. 等待测试完成后，点击 APA 中的 `Stop`。

9\. APA 自动获取 Trace 数据，并打开分析界面。



\*\*注意事项：\*\*



\- 录制时尽量不要切换其他应用。

\- 保持屏幕亮度、分辨率、帧率设置一致。

\- 避免设备过热影响测试结果。

\- 长时间测试建议控制采集指标数量。

\- 对比实验建议重复录制 3 次以上。



\---



\## 5. 查看和分析 Trace



\### 5.1 查找目标应用进程



Trace 录制完成后，在 APA 中找到 `Processes`。



可以在 `Filter tracks by name` 中输入应用名称或包名关键词。



例如，3DMark 可尝试：



```text

futuremark

```



其 Android 正式版常见包名为：



```text

com.futuremark.dmandroid.application

```



也可以使用 ADB 查询设备上的实际包名：



```powershell

adb shell pm list packages -3

```



找到目标进程后，展开查看 CPU 线程调度信息。



\### 5.2 查看 GPU Counters



在 Trace 视图中展开：



`GPU → GPU Counters`



重点观察：



\- GPU Utilization：GPU 利用率变化。

\- GPU Frequency：GPU 频率变化（如果已采集）。

\- Shader Instructions：GPU 着色器工作量。

\- Memory Read / Write：内存访问压力。

\- Cache / Stall Counters：缓存与执行停顿情况。



如果存在 `GPU Queues`，还可以查看 GPU 工作执行的时间线。



注意：GPU Counters 通常是整颗 GPU 的硬件指标，不能直接将所有 GPU 活动归属于单一应用。



\### 5.3 分析 CPU/GPU 性能



建议重点查看以下数据：



| 数据轨道 | 分析内容 |

|---|---|

| Processes | 目标应用及线程 |

| CPU Scheduling | CPU 线程执行情况 |

| CPU Frequency | CPU 调频过程 |

| GPU Counters | GPU 利用率和硬件活动 |

| GPU Queues | GPU 工作执行时间 |

| Frame Timeline | 帧耗时和卡顿情况 |



通过对比不同时间段的 CPU/GPU 数据，可以进一步分析 GPU 负载变化、频率响应以及性能瓶颈。



\---



\## 6. 常见问题



| 问题 | 解决方法 |

|---|---|

| APA 提示安装 Platform-Tools | 检查 `ANDROID\_HOME` 和 Android SDK 安装 |

| APA 无法检测手机 | 检查 USB 调试及 `adb devices` |

| Device 验证失败 | 点击 Retry 或重新连接手机 |

| GPU Counters 无法选择 | 检查 GPU/驱动是否支持 |

| Trace 中找不到应用 | 搜索包名，检查 Processes |

| GPU Counters 没有数据 | 检查采样支持、数据源配置及录制结果 |

| Trace 文件过大 | 减少数据源、Counters 或录制时长 |

| 录制时长不够 | 使用 Manual 结束模式 |



\---



\## 7. 参考资料



1\. \[Android Performance Analyzer 官方网站](https://developer.android.com/android-performance-analyzer)

2\. \[APA Quickstart](https://developer.android.com/android-performance-analyzer/quickstart)

3\. \[APA System Trace 录制指南](https://developer.android.com/android-performance-analyzer/run)

4\. \[Android SDK Platform-Tools](https://developer.android.com/tools/releases/platform-tools)

5\. \[Perfetto 官方文档](https://perfetto.dev/docs/)



\---



\*\*总结：\*\* 使用 APA 采集 Android GPU Trace 的基本流程是：



\*\*安装 Android SDK 和 APA → 配置环境变量 → USB 连接手机 → 选择录制模式 → 配置 GPU Counters → 开始录制 → 查看 Trace 并分析数据。\*\*



对于游戏测试，推荐优先使用 `Record a running app + Manual Start + Manual End`，再结合 GPU Counters、GPU Queues 和 CPU Scheduling 分析性能表现。

