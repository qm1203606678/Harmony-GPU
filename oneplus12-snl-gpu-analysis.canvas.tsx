import {
  BarChart,
  Callout,
  Card,
  CardBody,
  CardHeader,
  CollapsibleSection,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  LineChart,
  Pill,
  Row,
  Spacer,
  Stack,
  Stat,
  Swatch,
  Table,
  Text,
  UsageBar,
  useCanvasState,
  useHostTheme,
  type ChartSeries,
  type Color,
  type TableRowTone,
} from "cursor/canvas";

// ============================================================================
// VERIFIED DATASET EMBEDDED FROM OnePlus12_GPU_Counters_Data.xlsx
// Capture: 114,577 rows, 71 columns, 0.239s - 89.322s (89.08s total)
// Active steady-state window: 25.40s - 85.25s (59.828s, 47,391 valid HW rows)
// ============================================================================

const FULL_CATS_2S = [
  "0s","2s","4s","6s","8s","10s","12s","14s","16s","18s","20s","22s","24s",
  "26s","28s","30s","32s","34s","36s","38s","40s","42s","44s","46s","48s",
  "50s","52s","54s","56s","58s","60s","62s","64s","66s","68s","70s","72s",
  "74s","76s","78s","80s","82s","84s","86s","88s",
];

const FULL_CLK_MHZ = [
  185.1,224.1,208.6,185.1,194.4,196.9,187.8,178.9,167.4,171.9,333.6,410.3,591.2,
  903,903,903,903,903,902.9,903,903,902.9,903,903,902.9,
  903,903.2,903,903,903,902.9,903,903,903,903,903,902.8,
  903,903.2,903,903,903,677.6,215.7,192.6,
];

const FULL_SH_BUSY = [
  0,4.6,2.2,6.4,8.5,8.1,5.8,2.6,0.4,0.9,23.6,36.9,60,
  89.3,84.2,83.5,84.3,83.6,84.6,85,84.2,84,84.9,84.4,84.7,
  83.4,83,84.4,86.9,87.5,86.1,83.3,84,83.4,82.2,82,82.6,
  83.1,82.5,85.1,84.8,83.6,54.6,4,1.6,
];

const FULL_RD_GBS = [
  0.01,0.18,0.07,0.24,0.25,0.24,0.16,0.15,0.02,0.03,3.38,5.96,11.43,
  20.79,19.99,17.07,19.88,16.96,18.18,13.19,15.1,11.57,16.8,16.61,15.88,
  12.71,11.42,15.02,23.88,22.3,18.42,12.92,10.39,10.1,12.42,12.08,12.26,
  12.97,11.93,15.34,16.68,11.5,7.24,0.17,0.1,
];

const MEM_CATS = ["1s","5s","10s","15s","20s","24s","26s","30s","40s","50s","60s","70s","80s","85s","87s","89s"];
const MEM_GLOBAL_MB = [901.4,1263.2,1963.9,2801.6,2805.6,3252.6,3668.1,3720.1,3730.6,3728.1,3728.5,3728.5,3728.5,3728.5,918.5,852.6];
const MEM_3DMARK_MB = [168.4,559.3,1255.9,2093.6,2097.6,2544.7,2960.1,3012.2,3022.6,3022.7,3023.0,3023.0,3023.0,3023.0,212.8,161.2];

// Active 2s bins (26s..82s, 29 bins matching steady state; excluding partial 84-85.3s)
const ACT_CATS = [
  "26s","28s","30s","32s","34s","36s","38s","40s","42s","44s","46s","48s",
  "50s","52s","54s","56s","58s","60s","62s","64s","66s","68s","70s","72s",
  "74s","76s","78s","80s","82s",
];
const ACT_FPS_AUTOCORR = [
  15.15,12.82,14.71,13.33,10.31,11.11,15.87,16.13,12.50,12.66,12.82,11.36,
  11.36,11.49,12.50,11.76,10.99,10.75,14.29,11.63,12.05,16.39,12.50,12.20,
  14.71,13.89,11.76,12.05,12.99,
];
const ACT_FT_MS = [
  66,78,68,75,97,90,63,62,80,79,78,88,88,87,80,85,91,93,70,86,83,61,80,82,68,72,85,83,77,
];
const ACT_V_PCT = [6.4,15.4,13.9,13.4,16.2,13.9,11.2,12.8,13.4,12.4,13,12.8,14.4,15.4,14.2,11.5,11.1,12,14.1,14.6,15.2,13.6,17.1,16,13.6,15.2,12.1,13.2,14.8];
const ACT_F_PCT = [60.7,58.3,64.2,57.6,64,64,75.9,69.2,78.3,66.8,66.8,70,74,75,69.8,58.2,61.9,67.6,75.4,78.6,77.5,65,74.6,75.4,74.8,75.6,72.8,69.8,77.1];
const ACT_C_PCT = [33,26.4,21.9,29,19.8,22.2,13,18.2,8.4,20.8,20.2,17.2,11.6,9.6,16.1,30.5,27,20.4,10.6,6.9,7.2,21.6,8.2,8.8,11.6,9.3,15.2,17,8.1];
const ACT_ALU_WK = [43.5,36.7,37.8,36.4,39.3,38.1,46.4,44,45.1,40.6,39.5,39.6,41.4,44.2,45.4,38.8,40,41.5,43.5,48.2,48.2,42.2,41.1,41.6,43.2,42,40.8,38.2,42.3];
const ACT_TEX_BSY = [68.2,59.5,56.4,60.6,58.4,58.1,58.8,59.2,57.4,59.9,58.2,57,55.1,54.6,59.9,65.6,65,60.8,55,56.4,55.8,52.7,52.8,53.8,51.8,52.6,58.2,58.8,53.4];
const ACT_RD = [20.8,20,17.1,19.9,17,18.2,13.2,15.1,11.6,16.8,16.6,15.9,12.7,11.4,15,23.9,22.3,18.4,12.9,10.4,10.1,12.4,12.1,12.3,13,11.9,15.3,16.7,11.5];
const ACT_WR = [3.8,3.2,4.2,3.9,3.2,3.3,4.9,4.2,4.1,3.8,3.6,3.6,3.8,3.7,3.8,3.2,3.3,3.6,4.5,3.8,3.8,4.4,3.9,3.8,4.3,3.9,3.9,3.7,4];
const ACT_SYS_STL = [3.64,4.05,2.19,3.74,3.54,3.4,1.24,2.02,0.95,1.9,2.14,2.24,1.06,0.93,2.26,4.97,4.81,3.46,1.16,0.88,0.82,1.02,0.84,0.88,1.74,1.17,1.66,2.04,0.88];
const ACT_VTX_STL = [7.4,12.9,13,11.8,15.2,12.4,6.4,6.4,10.6,12.2,14.4,16.2,17,15.1,9.8,8.2,8.6,10,11.8,13,12.2,8.8,19.4,18.8,14.9,17.3,17.3,15.8,15.1];
const ACT_HALF_G = [33.8,24.3,29,28.8,17.8,21.8,20.6,22.8,14,28.2,24,19.3,16.2,16.7,19.2,24.8,20.4,18.4,18.1,14,14.1,42.8,14.6,15.6,19.4,15.6,18.8,19.6,16.5];
const ACT_POLY_M = [59.4,144.2,113.4,119.6,144,118.1,69.8,92.2,116.4,98.4,101.4,101.5,130.8,135,108.6,91.5,96.6,106.8,101,119,125.4,87.7,146.6,133.8,101.2,129.8,104.3,109.6,129.9];

// Memory Bandwidth Knee Curve (Active phase 5 GB/s buckets)
const BW_CATS = ["0-5","5-10","10-15","15-20","20-25","25-30","30-35","35-40","40-45","45-50","50-55","55-60","60-65"];
const BW_SHARE = [3.2,30.1,23.2,12.9,6.4,4.3,3.7,2.3,3.3,5.0,2.0,2.3,1.2];
const BW_BUS = [3.2,7.3,11.3,15.2,20.5,26.9,31.4,36.4,41.8,42.8,57.6,66.9,86.0];
const BW_SYS_STL = [0.19,0.71,0.52,0.33,1.19,3.06,3.40,4.16,4.60,2.17,11.88,17.58,32.24];
const BW_TEX_STL = [16.5,12.1,15.8,15.4,17.1,16.9,21.4,22.1,26.4,35.8,44.5,52.1,59.5];
const BW_ALU_WK = [58.5,51.0,41.0,31.9,39.1,41.9,47.7,36.5,28.3,25.8,21.9,18.6,13.4];

// Single-Frame X-Ray Data
interface FrameSample {
  ms: number;
  s: "V" | "F" | "C";
  alu: number;
  tex: number;
  rd: number;
  wr: number;
  sp: number;
  bus: number;
  stl: number;
}

const FRAME_57: FrameSample[] = [
  {ms:0.1,s:"V",alu:6,tex:9,rd:11.7,wr:7.2,sp:0,bus:17,stl:26},{ms:1.4,s:"V",alu:6,tex:9,rd:11.7,wr:7.2,sp:0,bus:17,stl:26},
  {ms:2.7,s:"V",alu:5,tex:9,rd:11.7,wr:2.4,sp:0,bus:12,stl:30},{ms:4.1,s:"V",alu:5,tex:15,rd:9.3,wr:0.5,sp:0.01,bus:8,stl:40},
  {ms:5.8,s:"V",alu:5,tex:15,rd:9.3,wr:0.5,sp:0.01,bus:8,stl:40},{ms:7.3,s:"V",alu:5,tex:15,rd:9.3,wr:0.5,sp:0.01,bus:8,stl:40},
  {ms:8.6,s:"V",alu:5,tex:15,rd:9.3,wr:0.5,sp:0.01,bus:8,stl:40},{ms:9.7,s:"F",alu:25,tex:8,rd:11.8,wr:1.9,sp:0.05,bus:12,stl:16},
  {ms:10.9,s:"F",alu:40,tex:38,rd:8.0,wr:1.7,sp:0.03,bus:9,stl:19},{ms:12.3,s:"F",alu:40,tex:28,rd:6.6,wr:1.6,sp:0.03,bus:9,stl:21},
  {ms:14.6,s:"F",alu:36,tex:54,rd:13.2,wr:1.5,sp:0.02,bus:13,stl:12},{ms:16.6,s:"F",alu:46,tex:42,rd:7.0,wr:1.5,sp:0.02,bus:7,stl:14},
  {ms:17.7,s:"F",alu:42,tex:43,rd:10.4,wr:1.9,sp:0.02,bus:12,stl:14},{ms:19.0,s:"F",alu:43,tex:46,rd:11.7,wr:1.4,sp:0.03,bus:14,stl:15},
  {ms:20.1,s:"F",alu:47,tex:54,rd:11.8,wr:1.6,sp:0.02,bus:13,stl:14},{ms:22.6,s:"F",alu:49,tex:39,rd:8.1,wr:1.7,sp:0.02,bus:10,stl:13},
  {ms:23.8,s:"F",alu:44,tex:40,rd:9.0,wr:1.4,sp:0.03,bus:10,stl:14},{ms:24.9,s:"F",alu:51,tex:44,rd:9.5,wr:2.0,sp:0.02,bus:12,stl:13},
  {ms:26.0,s:"F",alu:49,tex:49,rd:8.9,wr:1.6,sp:0.02,bus:10,stl:11},{ms:27.1,s:"F",alu:47,tex:49,rd:12.4,wr:2.2,sp:0.02,bus:14,stl:11},
  {ms:28.1,s:"F",alu:50,tex:40,rd:7.9,wr:1.3,sp:0.02,bus:9,stl:12},{ms:30.5,s:"F",alu:51,tex:76,rd:15.1,wr:9.7,sp:0,bus:22,stl:14},
  {ms:31.6,s:"F",alu:83,tex:80,rd:11.2,wr:2.4,sp:0,bus:12,stl:0},{ms:32.7,s:"F",alu:60,tex:69,rd:8.7,wr:4.1,sp:0,bus:11,stl:17},
  {ms:33.9,s:"F",alu:58,tex:83,rd:5.5,wr:3.2,sp:0,bus:8,stl:11},{ms:35.0,s:"F",alu:67,tex:87,rd:4.3,wr:2.3,sp:0,bus:6,stl:5},
  {ms:36.1,s:"F",alu:57,tex:83,rd:6.1,wr:3.4,sp:0,bus:8,stl:11},{ms:37.4,s:"F",alu:53,tex:78,rd:11.1,wr:1.6,sp:0,bus:12,stl:9},
  {ms:39.7,s:"C",alu:23,tex:92,rd:49.2,wr:0.1,sp:0,bus:53,stl:15},{ms:40.8,s:"C",alu:24,tex:93,rd:53.8,wr:0.1,sp:0,bus:55,stl:18},
  {ms:42.0,s:"C",alu:21,tex:91,rd:54.4,wr:0.1,sp:0,bus:58,stl:19},{ms:43.4,s:"C",alu:21,tex:91,rd:55.3,wr:0.1,sp:0,bus:63,stl:19},
  {ms:44.6,s:"C",alu:22,tex:91,rd:53.7,wr:0.2,sp:0,bus:59,stl:20},{ms:45.7,s:"C",alu:19,tex:91,rd:54.5,wr:0.1,sp:0,bus:62,stl:21},
  {ms:46.8,s:"C",alu:19,tex:90,rd:56.1,wr:0.1,sp:0,bus:63,stl:23},{ms:49.1,s:"C",alu:19,tex:91,rd:57.2,wr:0.1,sp:0,bus:69,stl:20},
  {ms:50.3,s:"C",alu:20,tex:90,rd:57.2,wr:0.1,sp:0,bus:62,stl:24},{ms:51.4,s:"C",alu:17,tex:89,rd:58.0,wr:0.1,sp:0,bus:70,stl:22},
  {ms:52.5,s:"C",alu:14,tex:93,rd:60.9,wr:0.1,sp:0,bus:80,stl:21},{ms:53.7,s:"C",alu:12,tex:93,rd:61.8,wr:0.1,sp:0,bus:83,stl:20},
  {ms:55.0,s:"C",alu:10,tex:89,rd:62.9,wr:0.1,sp:0,bus:89,stl:28},{ms:56.1,s:"C",alu:15,tex:87,rd:63.9,wr:0.1,sp:0,bus:100,stl:31},
  {ms:57.2,s:"C",alu:15,tex:87,rd:63.9,wr:0.1,sp:0,bus:100,stl:31},{ms:58.4,s:"C",alu:28,tex:81,rd:44.1,wr:0.8,sp:0,bus:41,stl:40},
  {ms:59.5,s:"C",alu:22,tex:95,rd:34.1,wr:12.9,sp:0,bus:41,stl:34},{ms:60.7,s:"F",alu:25,tex:91,rd:25.6,wr:19.9,sp:0.02,bus:41,stl:18},
  {ms:61.8,s:"F",alu:56,tex:65,rd:3.6,wr:0.3,sp:0.01,bus:3,stl:17},{ms:62.9,s:"F",alu:38,tex:54,rd:19.2,wr:1.0,sp:0.01,bus:18,stl:12},
  {ms:64.1,s:"F",alu:74,tex:75,rd:9.9,wr:1.5,sp:0.02,bus:10,stl:4},{ms:65.4,s:"F",alu:82,tex:93,rd:33.9,wr:0.6,sp:0,bus:30,stl:1},
  {ms:67.7,s:"F",alu:82,tex:94,rd:36.3,wr:0.5,sp:0,bus:32,stl:1},{ms:68.8,s:"F",alu:87,tex:95,rd:27.5,wr:0.4,sp:0,bus:24,stl:1},
  {ms:70.1,s:"F",alu:75,tex:73,rd:17.8,wr:1.5,sp:0.01,bus:17,stl:2},{ms:71.3,s:"F",alu:71,tex:96,rd:20.8,wr:6.6,sp:0,bus:24,stl:3},
  {ms:72.7,s:"F",alu:65,tex:97,rd:23.2,wr:7.6,sp:0,bus:27,stl:2},{ms:74.2,s:"F",alu:50,tex:89,rd:17.4,wr:3.2,sp:0,bus:18,stl:5},
  {ms:75.6,s:"F",alu:66,tex:98,rd:1.0,wr:1.5,sp:0,bus:2,stl:1},{ms:76.9,s:"F",alu:60,tex:100,rd:1.2,wr:1.5,sp:0,bus:2,stl:1},
  {ms:78.2,s:"F",alu:62,tex:85,rd:15.5,wr:10.0,sp:0,bus:22,stl:7},{ms:79.4,s:"F",alu:27,tex:86,rd:34.7,wr:11.1,sp:0,bus:40,stl:6},
  {ms:80.5,s:"C",alu:37,tex:90,rd:28.2,wr:19.0,sp:0.02,bus:48,stl:13},{ms:82.0,s:"C",alu:11,tex:43,rd:16.8,wr:12.0,sp:1.11,bus:39,stl:13},
  {ms:84.6,s:"C",alu:11,tex:43,rd:16.8,wr:12.0,sp:1.11,bus:39,stl:13},{ms:89.6,s:"V",alu:6,tex:11,rd:11.4,wr:7.9,sp:0.5,bus:18,stl:27},
];

const FRAME_65: FrameSample[] = [
  {ms:0.1,s:"V",alu:4,tex:15,rd:8.1,wr:2.9,sp:0.01,bus:10,stl:41},{ms:1.3,s:"V",alu:5,tex:12,rd:9.1,wr:4.6,sp:0,bus:12,stl:29},
  {ms:4.6,s:"V",alu:5,tex:8,rd:12.1,wr:5.5,sp:0,bus:15,stl:27},{ms:7.1,s:"V",alu:5,tex:12,rd:12.7,wr:1.4,sp:0.01,bus:13,stl:35},
  {ms:9.4,s:"V",alu:6,tex:5,rd:13.1,wr:3.7,sp:0,bus:15,stl:18},{ms:10.7,s:"V",alu:7,tex:10,rd:8.4,wr:0.7,sp:0,bus:8,stl:30},
  {ms:14.8,s:"F",alu:46,tex:27,rd:5.7,wr:1.2,sp:0.23,bus:7,stl:21},{ms:15.9,s:"F",alu:49,tex:26,rd:4.4,wr:1.1,sp:0.01,bus:5,stl:19},
  {ms:18.6,s:"F",alu:44,tex:31,rd:6.7,wr:1.5,sp:0.02,bus:9,stl:22},{ms:19.7,s:"F",alu:48,tex:28,rd:4.1,wr:1.2,sp:0.02,bus:6,stl:20},
  {ms:20.8,s:"F",alu:55,tex:37,rd:7.1,wr:1.8,sp:0.02,bus:9,stl:13},{ms:22.5,s:"F",alu:43,tex:43,rd:8.9,wr:1.4,sp:0.02,bus:11,stl:15},
  {ms:24.8,s:"F",alu:47,tex:36,rd:7.9,wr:1.3,sp:0.06,bus:9,stl:17},{ms:25.9,s:"F",alu:53,tex:36,rd:7.5,wr:1.4,sp:0.03,bus:9,stl:16},
  {ms:27.0,s:"F",alu:47,tex:39,rd:7.4,wr:1.5,sp:0.07,bus:9,stl:15},{ms:29.3,s:"F",alu:45,tex:46,rd:10.2,wr:1.1,sp:0.04,bus:10,stl:12},
  {ms:30.4,s:"F",alu:39,tex:55,rd:13.0,wr:1.4,sp:0.04,bus:13,stl:13},{ms:32.7,s:"F",alu:45,tex:39,rd:7.5,wr:1.4,sp:0.03,bus:9,stl:14},
  {ms:33.8,s:"F",alu:47,tex:48,rd:12.0,wr:1.4,sp:0.05,bus:14,stl:12},{ms:35.0,s:"F",alu:41,tex:52,rd:10.6,wr:1.4,sp:0.03,bus:11,stl:11},
  {ms:37.4,s:"F",alu:44,tex:55,rd:12.8,wr:1.3,sp:0.01,bus:13,stl:9},{ms:38.6,s:"F",alu:47,tex:49,rd:8.9,wr:1.6,sp:0.02,bus:10,stl:11},
  {ms:41.3,s:"F",alu:44,tex:57,rd:11.4,wr:7.0,sp:0.01,bus:16,stl:17},{ms:42.5,s:"F",alu:82,tex:81,rd:11.7,wr:2.5,sp:0,bus:12,stl:0},
  {ms:43.7,s:"F",alu:82,tex:82,rd:12.6,wr:4.1,sp:0,bus:14,stl:0},{ms:46.0,s:"F",alu:63,tex:85,rd:6.1,wr:3.6,sp:0,bus:8,stl:9},
  {ms:47.1,s:"F",alu:56,tex:81,rd:6.0,wr:3.6,sp:0,bus:8,stl:12},{ms:49.4,s:"F",alu:56,tex:82,rd:4.8,wr:3.0,sp:0,bus:7,stl:12},
  {ms:50.6,s:"F",alu:38,tex:87,rd:17.0,wr:8.7,sp:0,bus:22,stl:21},{ms:51.7,s:"C",alu:15,tex:94,rd:29.9,wr:18.8,sp:0.01,bus:44,stl:28},
  {ms:52.9,s:"C",alu:15,tex:94,rd:29.9,wr:18.8,sp:0.01,bus:44,stl:28},{ms:54.0,s:"F",alu:67,tex:76,rd:10.7,wr:7.0,sp:0.01,bus:15,stl:11},
  {ms:55.1,s:"F",alu:76,tex:73,rd:6.6,wr:1.1,sp:0.01,bus:7,stl:8},{ms:56.3,s:"F",alu:89,tex:80,rd:4.9,wr:1.9,sp:0.01,bus:6,stl:1},
  {ms:58.6,s:"F",alu:89,tex:81,rd:5.8,wr:1.7,sp:0.01,bus:7,stl:1},{ms:59.7,s:"F",alu:89,tex:82,rd:6.0,wr:1.1,sp:0.01,bus:6,stl:1},
  {ms:62.0,s:"F",alu:87,tex:78,rd:5.0,wr:1.6,sp:0.01,bus:6,stl:1},{ms:63.1,s:"F",alu:88,tex:79,rd:4.2,wr:1.0,sp:0.01,bus:4,stl:1},
  {ms:65.6,s:"F",alu:88,tex:78,rd:4.6,wr:1.9,sp:0,bus:6,stl:1},{ms:66.9,s:"F",alu:82,tex:81,rd:7.8,wr:3.3,sp:0,bus:10,stl:2},
  {ms:68.1,s:"F",alu:71,tex:98,rd:21.9,wr:7.5,sp:0,bus:25,stl:2},{ms:70.4,s:"F",alu:52,tex:94,rd:24.9,wr:5.9,sp:0,bus:27,stl:1},
  {ms:71.6,s:"F",alu:58,tex:94,rd:0.7,wr:0.9,sp:0,bus:1,stl:6},{ms:74.0,s:"F",alu:56,tex:97,rd:3.2,wr:1.1,sp:0,bus:4,stl:4},
  {ms:75.1,s:"F",alu:54,tex:93,rd:8.4,wr:2.0,sp:0,bus:9,stl:8},{ms:76.2,s:"F",alu:38,tex:95,rd:30.7,wr:11.7,sp:0,bus:37,stl:10},
  {ms:79.0,s:"C",alu:34,tex:80,rd:27.1,wr:17.7,sp:0.05,bus:44,stl:11},{ms:81.8,s:"C",alu:11,tex:27,rd:13.5,wr:14.7,sp:1.83,bus:35,stl:14},
  {ms:83.4,s:"V",alu:5,tex:11,rd:13.2,wr:3.1,sp:0,bus:14,stl:36},
];

// Roofline Regimes
interface RooflineNode {
  id: string;
  label: string;
  share: number;
  oi: number;
  gInstr: number;
  bw: number;
  aluCap: number;
  bus: number;
  tex: number;
  sysStl: number;
  halfPct: number;
  color: Color;
  bound: string;
}

const ROOFLINE_NODES: RooflineNode[] = [
  { id: "F1", label: "F1 全屏 PBR 光照 (ALU 重载)", share: 16.5, oi: 72.06, gInstr: 1013.6, bw: 14.07, aluCap: 73.3, bus: 12.2, tex: 81.5, sysStl: 0.02, halfPct: 0.5, color: "green", bound: "FP32 ALU 算力受限" },
  { id: "F2", label: "F2 全屏反射/后处理 (纹理管线饱和)", share: 14.7, oi: 31.82, gInstr: 663.5, bw: 20.85, aluCap: 46.4, bus: 18.2, tex: 89.7, sysStl: 0.18, halfPct: 3.3, color: "cyan", bound: "TMU 纹理管线吞吐受限" },
  { id: "F3", label: "F3 几何片元纹理延迟停顿", share: 15.7, oi: 36.98, gInstr: 507.0, bw: 13.71, aluCap: 37.5, bus: 12.7, tex: 51.2, sysStl: 0.87, halfPct: 4.4, color: "blue", bound: "L2 缺失(44.6%)+纹理取指延迟" },
  { id: "F4", label: "F4 G-Buffer 混合几何着色", share: 21.3, oi: 59.36, gInstr: 521.4, bw: 8.78, aluCap: 40.3, bus: 8.7, tex: 35.8, sysStl: 1.08, halfPct: 4.5, color: "purple", bound: "微三角形(43px)+着色器延迟/占用率" },
  { id: "C1", label: "C1 体积光/GI 计算带宽饱和", share: 12.9, oi: 5.16, gInstr: 254.5, bw: 49.37, aluCap: 17.0, bus: 53.3, tex: 86.3, sysStl: 10.60, halfPct: 18.7, color: "red", bound: "LPDDR5X 内存带宽受限 (峰值65GB/s)" },
  { id: "C2", label: "C2 中带宽/FP16 计算着色器", share: 1.6, oi: 15.08, gInstr: 387.4, bw: 25.70, aluCap: 23.5, bus: 24.1, tex: 73.1, sysStl: 1.81, halfPct: 30.3, color: "yellow", bound: "混合精度纹理+计算均衡" },
  { id: "C3", label: "C3 帧尾 SSBO 剔除/写回计算", share: 3.0, oi: 2.28, gInstr: 61.5, bw: 26.95, aluCap: 9.0, bus: 32.9, tex: 25.9, sysStl: 9.53, halfPct: 2.7, color: "orange", bound: "SP 直接读(1.76GB/s)+L2 缺失(76.6%)" },
  { id: "V", label: "V1+V2 顶点/分块 Binning 通道", share: 14.3, oi: 1.46, gInstr: 21.1, bw: 14.53, aluCap: 5.1, bus: 12.7, tex: 9.3, sysStl: 0.13, halfPct: 0.9, color: "pink", bound: "几何前端(0.82-1.25 tri/clk)+顶点停顿" },
];

// Full Counter Reference Catalog
interface CounterSpec {
  cat: "System" | "Shader" | "Texture" | "Memory" | "Geometry" | "Compute";
  name: string;
  unit: string;
  twMean: string;
  p50: string;
  p95: string;
  p99: string;
  note: string;
  tone?: TableRowTone;
}

const COUNTER_CATALOG: CounterSpec[] = [
  { cat: "System", name: "Clocks / Second", unit: "MHz", twMean: "902.93", p50: "902.99", p95: "903.79", p99: "904.47", note: "全程锁定 Adreno 750 峰值 903 MHz，零降频", tone: "success" },
  { cat: "System", name: "GPU % Utilization (原始值)", unit: "%", twMean: "42.04%", p50: "42.05%", p95: "42.10%", p99: "42.14%", note: "工具公式分母误用 INT32_MAX (2.147GHz)，真实利用率 ~100%", tone: "danger" },
  { cat: "System", name: "Preemptions / second", unit: "/s", twMean: "4.46", p50: "0", p95: "0", p99: "0", note: "仅 0.92% 采样出现抢占，中位延迟 6.3us，最大 776us" },
  { cat: "System", name: "Global GPU Memory (Col 35)", unit: "MiB", twMean: "3,728", p50: "3,728", p95: "3,730", p99: "3,731", note: "3DMark 进程 (Col 33) 占 3,023 MiB，系统共享差值恒定" },
  { cat: "Shader", name: "% Shaders Busy", unit: "%", twMean: "83.3%", p50: "93.4%", p95: "100.0%", p99: "100.0%", note: "片元/计算期 86-97%，顶点 Binning 期骤降至 33.9%", tone: "info" },
  { cat: "Shader", name: "% Shaders Stalled", unit: "%", twMean: "15.5%", p50: "14.6%", p95: "34.5%", p99: "41.1%", note: "与 ALU 效率强负相关 (r=-0.77)；顶点期 84% 活跃周期处于停顿", tone: "warning" },
  { cat: "Shader", name: "% Time ALUs Working", unit: "%", twMean: "41.1%", p50: "43.6%", p95: "82.1%", p99: "88.2%", note: "全屏 PBR 期高达 77-89%；体积计算带宽满载时暴跌至 10-22%" },
  { cat: "Shader", name: "% Shader ALU Capacity Utilized", unit: "%", twMean: "36.9%", p50: "38.0%", p95: "81.2%", p99: "87.1%", note: "满载外推峰值 ~1,323 GInstr/s，验证 1,536 ALU 架构" },
  { cat: "Shader", name: "Fragment ALU Instr/s (Full FP32)", unit: "G/s", twMean: "456.6", p50: "466.8", p95: "1,078.5", p99: "1,157.8", note: "占总片元+计算指令 92.0%，SNL 极度依赖 FP32 算力", tone: "info" },
  { cat: "Shader", name: "Fragment ALU Instr/s (Half FP16)", unit: "G/s", twMean: "20.5", p50: "17.7", p95: "66.4", p99: "155.9", note: "纯片元仅 2.7%，纯计算升至 30.7% (t=68s 峰值 331 G/s)" },
  { cat: "Shader", name: "Fragment EFU Instr/s (超越函数)", unit: "G/s", twMean: "19.3", p50: "13.3", p95: "67.0", p99: "126.4", note: "占 3.9%，全屏 PBR 光照期达 45.6 G/s" },
  { cat: "Shader", name: "Fragments Shaded / Second", unit: "M/s", twMean: "1,110", p50: "527", p95: "3,712", p99: "5,500", note: "每帧 88.8M 片元，相对 2560x1440 为 24.1x 总着色倍增" },
  { cat: "Shader", name: "ALU / Fragment (纯片元 %F>=95)", unit: "/Frag", twMean: "873.8", p50: "707.3", p95: "—", p99: "—", note: "原始全活跃均值 1,027 含计算通道污染；剔除后中位数 707" },
  { cat: "Shader", name: "% Instruction Cache Miss", unit: "%", twMean: "0.246%", p50: "0.034%", p95: "0.885%", p99: "1.169%", note: "整体极低；G-Buffer 多材质 Uber-Shader 期最高 (0.59%)" },
  { cat: "Texture", name: "% Texture Pipes Busy", unit: "%", twMean: "56.7%", p50: "61.4%", p95: "96.5%", p99: "99.9%", note: "F2 后处理(89.7%)、C1 体积计算(86.3%)、F1 PBR(81.5%) 高度饱和", tone: "warning" },
  { cat: "Texture", name: "% Texture Fetch Stall", unit: "%", twMean: "18.4%", p50: "15.1%", p95: "52.2%", p99: "63.1%", note: "与读带宽强正相关 (r=+0.63)；C1 峰值期达 59.5%", tone: "warning" },
  { cat: "Texture", name: "% Texture L1 Miss", unit: "%", twMean: "28.9%", p50: "28.5%", p95: "61.1%", p99: "69.5%", note: "60-65GB/s 带宽悬崖区飙升至 69.0%" },
  { cat: "Texture", name: "% Texture L2 Miss", unit: "%", twMean: "28.3%", p50: "35.7%", p95: "55.1%", p99: "84.5%", note: "冰火两重天：全屏 PBR 仅 1.8%，G-Buffer 40.8%，SSBO 剔除 85.4%", tone: "info" },
  { cat: "Texture", name: "Textures / Fragment (纯片元)", unit: "/Frag", twMean: "23.2", p50: "10.1", p95: "—", p99: "—", note: "全屏纹理通道中位数 24.3 次/片元，G-Buffer 为 7.5 次/片元" },
  { cat: "Texture", name: "Filtering Mix (Near / Lin / Aniso)", unit: "%", twMean: "57 / 32 / 10", p50: "52 / 27 / 0", p95: "—", p99: "—", note: "G-Buffer 含 26.2% 各向异性过滤；体积计算 88.8% 双线性/三线性" },
  { cat: "Memory", name: "Read Total (Bytes/sec)", unit: "GB/s", twMean: "15.13", p50: "10.75", p95: "51.88", p99: "60.64", note: "峰值 69.56 GB/s；每帧读取 1,210.9 MB，纹理读占 86.7%", tone: "danger" },
  { cat: "Memory", name: "Write Total (Bytes/sec)", unit: "GB/s", twMean: "3.93", p50: "1.76", p95: "14.89", p99: "18.42", note: "读写比 3.85:1；每帧写出 314.7 MB，总流量 1,525.6 MB/帧" },
  { cat: "Memory", name: "Texture Memory Read BW", unit: "GB/s", twMean: "13.12", p50: "8.05", p95: "51.81", p99: "60.66", note: "占 GPU 总读带宽 86.7%，决定全系统 LPDDR 负载" },
  { cat: "Memory", name: "Vertex Memory Read BW", unit: "GB/s", twMean: "0.80", p50: "0.04", p95: "4.01", p99: "5.17", note: "占总读 5.3%；顶点 Binning 通道均值 3.61 GB/s，峰值 9.84 GB/s" },
  { cat: "Memory", name: "SP Memory Read BW (SSBO/Spill)", unit: "GB/s", twMean: "0.079", p50: "0.006", p95: "0.227", p99: "2.034", note: "帧尾 C3 计算剔除通道脉冲高达 1.76-3.15 GB/s，片元期近零(无寄存器溢出)" },
  { cat: "Memory", name: "GPU % Bus Busy", unit: "%", twMean: "18.6%", p50: "12.1%", p95: "56.4%", p99: "79.5%", note: "与读带宽 r=+0.954；Bus>=90% 时实测总带宽上限 63.7-65.3 GB/s", tone: "warning" },
  { cat: "Memory", name: "% Stalled on System Memory", unit: "%", twMean: "2.10%", p50: "0.30%", p95: "13.61%", p99: "26.84%", note: "50 GB/s 以上出现 5.5x 拐点暴涨，60-65GB/s 时高达 32.2%", tone: "danger" },
  { cat: "Geometry", name: "Pre-clipped Polygons / Second", unit: "M/s", twMean: "121.1", p50: "1.98", p95: "837.6", p99: "1,088.0", note: "每帧 9.69M 三角形；纯顶点期 738M/s (0.82-1.25 tri/clk)", tone: "info" },
  { cat: "Geometry", name: "Vertices Shaded / Reused", unit: "M/s", twMean: "121.9 / 280.7", p50: "3.6 / 4.8", p95: "762 / 1,816", p99: "941 / 2,352", note: "Post-Transform 顶点缓存复用率 69.7% (顶点期 70.7%)" },
  { cat: "Geometry", name: "% Vertex Fetch Stall", unit: "%", twMean: "12.8%", p50: "2.5%", p95: "51.1%", p99: "70.7%", note: "G-Buffer 分块二次顶点着色期 25-30%，第 70-78s 达 19.4%" },
  { cat: "Geometry", name: "Average Polygon Area (G-Buffer)", unit: "px", twMean: "966 (中位 43.3)", p50: "43.3", p95: "2,680", p99: "—", note: "大量微三角形 (P25=24.9px)；全屏三角峰值 7,369,280px 实证 1440p" },
  { cat: "Geometry", name: "% Prims Trivially Rejected / Clipped", unit: "%", twMean: "5.6% / 0.17%", p50: "0 / 0", p95: "28.5 / 0.14", p99: "91.8 / 0.24", note: "纯顶点 Binning 期均值 13.4% 被剔除，裁剪极低 (0.10%)" },
  { cat: "Compute", name: "% Time Compute / Frag / Vtx", unit: "%", twMean: "16.9 / 68.5 / 14.7", p50: "0 / 99.2 / 0.2", p95: "100 / 100 / 100", p99: "100 / 100 / 100", note: "TBDR 时分交替：活跃时长中片元 68.2%、计算 17.5%、顶点 14.3%" },
  { cat: "Compute", name: "Ray Tracing / RTU / BVH (5 项)", unit: "all", twMean: "0", p50: "0", p95: "0", p99: "0", note: "全 70,905 帧均为 0，确认为纯光栅+计算负载 (Steel Nomad Light)" },
];

// ============================================================================
// CUSTOM SVG: EMPIRICAL ROOFLINE MODEL (Theme-aware, zero hardcoded hex)
// ============================================================================
function RooflineSvg({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const theme = useHostTheme();
  const W = 740;
  const H = 310;
  const padL = 62;
  const padR = 26;
  const padT = 26;
  const padB = 44;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  // Log10 domain: OI in [1, 150] Instr/Byte, Perf in [10, 2000] GInstr/s
  const minX = Math.log10(1);
  const maxX = Math.log10(150);
  const minY = Math.log10(10);
  const maxY = Math.log10(2000);

  const sx = (oi: number) => padL + ((Math.log10(Math.max(1, oi)) - minX) / (maxX - minX)) * plotW;
  const sy = (g: number) => padT + plotH - ((Math.log10(Math.max(10, g)) - minY) / (maxY - minY)) * plotH;

  // Hardware ceilings measured directly from dataset:
  // Peak ALU = 1323 GInstr/s (extrapolated @ 100% ALU Cap), Peak BW = 65.26 GB/s
  // Ridge Point = 1323 / 65.26 = 20.27 Instr/Byte
  const peakAlu = 1323;
  const peakBw = 65.26;
  const ridgeOi = peakAlu / peakBw;

  // Also show hypothetical Huawei lower-BW ceiling reference (42 GB/s) as dashed comparison!
  const hwBwRef = 42.0;
  const hwRidge = peakAlu / hwBwRef;

  const xTicks = [1, 2, 5, 10, 20, 50, 100];
  const yTicks = [10, 20, 50, 100, 200, 500, 1000, 1323];

  const roofPath = `M ${sx(1).toFixed(1)} ${sy(peakBw * 1).toFixed(1)} L ${sx(ridgeOi).toFixed(1)} ${sy(peakAlu).toFixed(1)} L ${sx(150).toFixed(1)} ${sy(peakAlu).toFixed(1)}`;
  const hwRefPath = `M ${sx(1).toFixed(1)} ${sy(hwBwRef * 1).toFixed(1)} L ${sx(hwRidge).toFixed(1)} ${sy(peakAlu).toFixed(1)}`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label="Adreno 750 Empirical Roofline Model across 8 Steel Nomad Light Workload Sub-Regimes"
    >
      {/* Grid lines */}
      {xTicks.map((x) => (
        <g key={`gx-${x}`}>
          <line
            x1={sx(x)}
            y1={padT}
            x2={sx(x)}
            y2={padT + plotH}
            stroke={theme.stroke.tertiary}
            strokeWidth={1}
          />
          <text
            x={sx(x)}
            y={padT + plotH + 16}
            textAnchor="middle"
            fontSize={10}
            fill={theme.text.tertiary}
          >
            {x}
          </text>
        </g>
      ))}
      {yTicks.map((y) => (
        <g key={`gy-${y}`}>
          <line
            x1={padL}
            y1={sy(y)}
            x2={padL + plotW}
            y2={sy(y)}
            stroke={theme.stroke.tertiary}
            strokeWidth={1}
          />
          <text
            x={padL - 8}
            y={sy(y) + 3}
            textAnchor="end"
            fontSize={10}
            fill={theme.text.tertiary}
          >
            {y}
          </text>
        </g>
      ))}

      {/* Ridge vertical marker */}
      <line
        x1={sx(ridgeOi)}
        y1={sy(peakAlu)}
        x2={sx(ridgeOi)}
        y2={padT + plotH}
        stroke={theme.stroke.primary}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
      <text
        x={sx(ridgeOi) + 5}
        y={padT + plotH - 6}
        fontSize={10}
        fill={theme.text.secondary}
      >
        拐点 OI = 20.3 Instr/B
      </text>

      {/* Hypothetical 42 GB/s lower-BW reference line */}
      <path
        d={hwRefPath}
        fill="none"
        stroke={theme.category.orange}
        strokeWidth={1.25}
        strokeDasharray="5 4"
        opacity={0.75}
      />
      <text
        x={sx(3.0)}
        y={sy(hwBwRef * 3.0) + 14}
        fontSize={9.5}
        fill={theme.category.orange}
      >
        假设带宽受限参考线 (42 GB/s)
      </text>

      {/* Empirical Adreno 750 Roofline */}
      <path
        d={roofPath}
        fill="none"
        stroke={theme.text.primary}
        strokeWidth={2}
      />
      <text
        x={sx(2.4)}
        y={sy(peakBw * 2.4) - 8}
        fontSize={10.5}
        fontWeight={500}
        fill={theme.text.primary}
      >
        实测 DRAM 上限 65.3 GB/s
      </text>
      <text
        x={sx(52)}
        y={sy(peakAlu) - 7}
        fontSize={10.5}
        fontWeight={500}
        fill={theme.text.primary}
      >
        实测 ALU 峰值 ~1,323 GInstr/s (903 MHz)
      </text>

      {/* Workload Sub-Regime Bubbles (area proportional to active time share) */}
      {ROOFLINE_NODES.map((n) => {
        const cx = sx(n.oi);
        const cy = sy(n.gInstr);
        const r = Math.max(5.5, Math.sqrt(n.share) * 3.3);
        const isSel = selectedId === n.id;
        const fill = theme.category[n.color];
        const labelDx = n.id === "F2" ? -12 : n.id === "F4" ? 10 : n.id === "V" ? 12 : 10;
        const labelDy = n.id === "F2" ? 16 : n.id === "F3" ? 14 : n.id === "C1" ? -10 : 4;
        const anchor = n.id === "F2" ? "end" : "start";
        return (
          <g
            key={n.id}
            style={{ cursor: "pointer" }}
            onClick={() => onSelect(n.id)}
          >
            {isSel && (
              <circle
                cx={cx}
                cy={cy}
                r={r + 4.5}
                fill="none"
                stroke={theme.text.primary}
                strokeWidth={1.5}
              />
            )}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={fill}
              fillOpacity={isSel ? 0.95 : 0.72}
              stroke={theme.bg.editor}
              strokeWidth={1.2}
            />
            <text
              x={cx + labelDx}
              y={cy + labelDy}
              textAnchor={anchor}
              fontSize={10.5}
              fontWeight={isSel ? 600 : 400}
              fill={isSel ? theme.text.primary : theme.text.secondary}
            >
              {n.id} ({n.share}%)
            </text>
          </g>
        );
      })}

      {/* Axis labels */}
      <text
        x={padL + plotW / 2}
        y={H - 8}
        textAnchor="middle"
        fontSize={11}
        fill={theme.text.secondary}
      >
        运算强度 Operational Intensity (Instructions / Byte，对数坐标；点击气泡查看详情)
      </text>
      <text
        x={16}
        y={padT + plotH / 2}
        textAnchor="middle"
        fontSize={11}
        fill={theme.text.secondary}
        transform={`rotate(-90 16 ${padT + plotH / 2})`}
      >
        实测吞吐 (GInstr/s)
      </text>
    </svg>
  );
}

// ============================================================================
// CUSTOM SVG: SINGLE-FRAME MILLISECOND PASS X-RAY
// ============================================================================
function FrameXRaySvg({
  samples,
  totalMs,
  title,
}: {
  samples: FrameSample[];
  totalMs: number;
  title: string;
}) {
  const theme = useHostTheme();
  const W = 740;
  const H = 250;
  const padL = 48;
  const padR = 46;
  const ribbonY = 18;
  const ribbonH = 22;
  const plotTop = 54;
  const plotH = 158;
  const plotW = W - padL - padR;

  const sx = (ms: number) => padL + (ms / totalMs) * plotW;
  const syPct = (pct: number) => plotTop + plotH - (Math.min(100, Math.max(0, pct)) / 100) * plotH;
  const syBw = (gb: number) => plotTop + plotH - (Math.min(70, Math.max(0, gb)) / 70) * plotH;

  const stageColor = (s: "V" | "F" | "C") =>
    s === "V" ? theme.category.pink : s === "C" ? theme.category.red : theme.category.blue;

  const aluPts = samples.map((p) => `${sx(p.ms).toFixed(1)},${syPct(p.alu).toFixed(1)}`).join(" ");
  const texPts = samples.map((p) => `${sx(p.ms).toFixed(1)},${syPct(p.tex).toFixed(1)}`).join(" ");
  const rdPts = samples.map((p) => `${sx(p.ms).toFixed(1)},${syBw(p.rd).toFixed(1)}`).join(" ");

  const xTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, Math.round(totalMs)];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "auto", display: "block" }}
      role="img"
      aria-label={title}
    >
      {/* Top Pipeline Stage Ribbon */}
      <text x={padL - 6} y={ribbonY + 15} textAnchor="end" fontSize={10} fill={theme.text.tertiary}>
        阶段
      </text>
      {samples.map((p, idx) => {
        const nextMs = idx + 1 < samples.length ? samples[idx + 1].ms : totalMs;
        const x0 = sx(p.ms);
        const w = Math.max(1.5, sx(nextMs) - x0);
        return (
          <rect
            key={idx}
            x={x0}
            y={ribbonY}
            width={w}
            height={ribbonH}
            fill={stageColor(p.s)}
            fillOpacity={0.82}
          />
        );
      })}

      {/* Horizontal grid */}
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={`hg-${v}`}>
          <line
            x1={padL}
            y1={syPct(v)}
            x2={padL + plotW}
            y2={syPct(v)}
            stroke={theme.stroke.tertiary}
            strokeWidth={1}
          />
          <text x={padL - 6} y={syPct(v) + 3} textAnchor="end" fontSize={9.5} fill={theme.text.tertiary}>
            {v}%
          </text>
        </g>
      ))}
      {/* Right axis labels for Read BW (0..70 GB/s) */}
      {[0, 20, 40, 60, 70].map((gb) => (
        <text
          key={`rbw-${gb}`}
          x={padL + plotW + 6}
          y={syBw(gb) + 3}
          textAnchor="start"
          fontSize={9.5}
          fill={theme.category.orange}
        >
          {gb}G
        </text>
      ))}

      {/* Curves */}
      <polyline fill="none" stroke={theme.category.cyan} strokeWidth={1.6} points={texPts} opacity={0.85} />
      <polyline fill="none" stroke={theme.category.green} strokeWidth={2} points={aluPts} />
      <polyline fill="none" stroke={theme.category.orange} strokeWidth={2} points={rdPts} />

      {/* X axis ticks */}
      {xTicks.map((ms, i) => (
        <g key={`xt-${i}`}>
          <line
            x1={sx(ms)}
            y1={plotTop + plotH}
            x2={sx(ms)}
            y2={plotTop + plotH + 4}
            stroke={theme.stroke.secondary}
          />
          <text
            x={sx(ms)}
            y={plotTop + plotH + 16}
            textAnchor="middle"
            fontSize={9.5}
            fill={theme.text.tertiary}
          >
            {ms}ms
          </text>
        </g>
      ))}

      <text x={padL + plotW / 2} y={H - 5} textAnchor="middle" fontSize={10.5} fill={theme.text.secondary}>
        单帧内时间进程 (ms) — 左轴: ALU 工作率 / 纹理管线忙碌度 (%) | 右轴: DRAM 读带宽 (GB/s)
      </text>
    </svg>
  );
}

// ============================================================================
// MAIN CANVAS COMPONENT
// ============================================================================
export default function OnePlus12SnlGpuAnalysis() {
  const theme = useHostTheme();
  const [activeTab, setActiveTab] = useCanvasState<string>("tab", "overview");
  const [timelineView, setTimelineView] = useCanvasState<string>("tlView", "fps");
  const [frameChoice, setFrameChoice] = useCanvasState<"f57" | "f65">("frameChoice", "f57");
  const [selectedRoof, setSelectedRoof] = useCanvasState<string>("roofId", "C1");
  const [counterCat, setCounterCat] = useCanvasState<string>("counterCat", "All");

  const tabs = [
    { id: "overview", label: "1. 总览与数据审计" },
    { id: "timeline", label: "2. 60s 场景与帧率" },
    { id: "xray", label: "3. 单帧微架构透视" },
    { id: "roofline", label: "4. 瓶颈与 Roofline" },
    { id: "huawei", label: "5. 华为对标与全指标库" },
  ];

  const roofSelected = ROOFLINE_NODES.find((n) => n.id === selectedRoof) ?? ROOFLINE_NODES[4];
  const filteredCounters =
    counterCat === "All"
      ? COUNTER_CATALOG
      : COUNTER_CATALOG.filter((c) => c.cat === counterCat);

  const stageSeries2s: ChartSeries[] = [
    { name: "Fragment 片元 (%)", data: ACT_F_PCT, tone: "info" },
    { name: "Compute 计算 (%)", data: ACT_C_PCT, tone: "danger" },
    { name: "Vertex 顶点 (%)", data: ACT_V_PCT, tone: "warning" },
  ];

  return (
    <Stack gap={18} style={{ padding: 20, maxWidth: 1120, margin: "0 auto" }}>
      {/* Header */}
      <Stack gap={6}>
        <Row align="center" justify="space-between" wrap gap={8}>
          <H1>OnePlus 12 (Adreno 750) · 3DMark SNL GPU Counters 深度分析</H1>
          <Text size="small" tone="tertiary">
            数据源: OnePlus12_GPU_Counters_Data.xlsx · 114,577 行 × 71 列 · 89.08s
          </Text>
        </Row>
        <Text tone="secondary">
          基于骁龙 8 Gen 3 (Adreno 750 @ 903 MHz) 在 3DMark Steel Nomad Light (2560×1440 Vulkan，纯光栅+计算，无光追) 下 APA 1.16ms 硬件计数器采样的全量架构剖面，面向华为 Kirin / Maleoon GPU 性能对标与瓶颈诊断基线构建。
        </Text>
      </Stack>

      {/* Top Navigation Pills */}
      <Row gap={8} wrap>
        {tabs.map((t) => (
          <Pill
            key={t.id}
            active={activeTab === t.id}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </Pill>
        ))}
      </Row>

      <Divider />

      {/* ==================================================================== */}
      {/* TAB 1: OVERVIEW & DATA INTEGRITY                                     */}
      {/* ==================================================================== */}
      {activeTab === "overview" && (
        <Stack gap={18}>
          {/* Hero KPI Strip */}
          <Grid columns={5} gap={12}>
            <Stat value="903.0 MHz" label="活跃期 GPU 频率 (0 次降频)" tone="success" />
            <Stat value="12.64 FPS" label="自相关实测均帧 (79.1 ms)" tone="info" />
            <Stat value="19.07 GB/s" label="均 DRAM 带宽 (峰值 65.3)" tone="warning" />
            <Stat value="83.3% / 41.1%" label="Shader 忙碌 / ALU 工作率" />
            <Stat value="3.64 GiB" label="峰值全局显存 (进程 2.95G)" />
          </Grid>

          {/* Critical APA Tooling Traps */}
          <Callout
            tone="warning"
            title="APA / Adreno 计数器 4 大数据陷阱（横向对比华为前必读）"
          >
            <Stack gap={6}>
              <Text size="small">
                1. <Text weight="semibold">`GPU % Utilization` 严重失真（报告 42.05%，实为 ~100%）</Text>：全活跃期 `Clocks/s ÷ (GPU_Util/100)` 中位数精确等于 `2,147,483,647 Hz` (`INT32_MAX`)。即工具用 `INT32_MAX` 替代实际最高频 903 MHz 做分母 (`903 / 2147.48 = 42.05%`)。切勿直接拿该列与华为 GPU 利用率对比，应改用 `Clocks/s ÷ 峰值频率` 与 `% Shaders Busy`。
              </Text>
              <Text size="small">
                2. <Text weight="semibold">`ALU/Fragment` 与 `Textures/Fragment` 被 Compute 指令污染</Text>：Adreno 硬件计数器将 Compute 指令计入 `Fragment ALU/EFU` 总数；当 `% Time Compute = 100%` 时分母 `Fragments` 趋近 0，导致 `ALU/Frag` 虚高至 5,000–12,647（且引发 953 行 `Tex/Frag = null`）。剔除计算通道后，纯片元中位数实为 `707 ALU/Frag`、`10.1 Tex/Frag`。
              </Text>
              <Text size="small">
                3. <Text weight="semibold">加载/预热期占总时长 32.8% + Row 0 累积脉冲 + 30.7% 零阶保持重复行</Text>：直接对整表求均值会严重拉低所有指标（如全表 Read 均 10.6 GB/s，纯活跃期实为 15.13 GB/s）；此外 Row 0 (`t=0.246s`) 存在 `6.49 GHz` 初始化毛刺，必须截取稳态窗 `25.40s–85.25s` 并按 `dt` 时间加权统计。
              </Text>
              <Text size="small">
                4. <Text weight="semibold">高频采样开销 (860 Hz × 54 项计数器)</Text>：本轮 12.64 FPS 低于 Adreno 750 未挂工具常见 ~16–18 FPS，系 APA 1.16ms 全计数器采集开销叠加所致；采集华为手机时务必保持采样间隔与计数器数量一致。
              </Text>
            </Stack>
          </Callout>

          {/* 5-Phase Capture Timeline */}
          <Card>
            <CardHeader trailing={<Text size="small" tone="tertiary">0.24s – 89.32s · 2s 均值重采样</Text>}>
              全量采集生命周期：GPU 频率 (MHz) 与 Shader 忙碌度 (%) 演变
            </CardHeader>
            <CardBody>
              <Stack gap={8}>
                <LineChart
                  categories={FULL_CATS_2S}
                  series={[
                    { name: "GPU 频率 (MHz ÷ 10)", data: FULL_CLK_MHZ.map((v) => Math.round(v) / 10), tone: "info" },
                    { name: "Shaders Busy (%)", data: FULL_SH_BUSY, tone: "success" },
                    { name: "DRAM 读带宽 (GB/s × 3)", data: FULL_RD_GBS.map((v) => Math.round(v * 30) / 10), tone: "warning" },
                  ]}
                  height={230}
                  valueSuffix=""
                  referenceLines={[{ value: 90.3, label: "903 MHz 锁频", tone: "info" }]}
                />
                <Text size="small" tone="tertiary">
                  注：为同轴展示趋势，GPU 频率按 ÷10 缩放（90.3 对应 903 MHz），读带宽按 ×3 缩放（72 对应 24 GB/s）。Source: OnePlus12_GPU_Counters_Data.xlsx (0–89s)。
                </Text>
              </Stack>
            </CardBody>
          </Card>

          {/* Phase Table directly under H2 */}
          <Stack gap={8}>
            <H2>五阶段生命周期切分与资源画像</H2>
            <Table
              headers={["阶段", "时间窗口", "时长", "频率 / 忙碌度", "显存 (全局 / 3DMark)", "核心硬件行为特征"]}
              columnAlign={["left", "left", "right", "left", "left", "left"]}
              rowTone={["neutral", "warning", "info", "success", "neutral"]}
              rows={[
                ["P1 冷加载与资源上传", "0.24s – 20.4s", "20.2s", "167–235 MHz / 0–9%", "0.90 → 2.81 GiB (0.17→2.10G)", "6–12s 纹理上传/Mipmap Blit (0.25 GB/s)；15–19s 纯 CPU 编译 PSO"],
                ["P2 场景预热与首轮烘焙", "20.4s – 25.1s", "4.7s", "415 MHz / 37.2%", "2.81 → 3.25 GiB (2.10→2.54G)", "重度顶点/几何 (34.1% Vtx, 271M polys/s) + 20.2% Compute，I-Cache 缺失峰值 0.54%"],
                ["P3 DVFS 瞬态爬坡", "25.24s – 25.35s", "0.10s", "629 → 903 MHz (6档)", "3.25 → 3.67 GiB", "102 ms 内连续 6 档跃升至满频，极快响应无迟滞"],
                ["P4 正式 60s 压测活跃期", "25.40s – 85.25s", "59.85s", "903.0 MHz / 83.3%", "稳态 3.73 GiB (进程 3.02G)", "0 次热降频，均值 12.64 FPS，总带宽 19.07 GB/s，11 个显著负载切换场景"],
                ["P5 退场与资源释放", "85.30s – 89.32s", "4.02s", "903 → 578 → 186 MHz", "3.73 → 0.85 GiB (3.02→0.16G)", "85.32s 渲染终止，270ms 内降档回落，86–88s 释放 2.86 GiB 显存"],
              ]}
            />
          </Stack>

          {/* GPU Memory & Active Pipeline Split side by side */}
          <Grid columns="1.15fr 1fr" gap={16} align="start">
            <Card>
              <CardHeader trailing={<Text size="small" tone="tertiary">稳态总占用 3.73 GiB</Text>}>
                GPU 显存分配轨迹 (Global Col 35 vs 3DMark PID Col 33)
              </CardHeader>
              <CardBody>
                <Stack gap={8}>
                  <LineChart
                    categories={MEM_CATS}
                    series={[
                      { name: "全局 GPU 显存 (MB)", data: MEM_GLOBAL_MB, tone: "info" },
                      { name: "3DMark SNL 进程 (MB)", data: MEM_3DMARK_MB, tone: "success" },
                    ]}
                    height={200}
                    valueSuffix=" MB"
                    fill
                  />
                  <Text size="small" tone="tertiary">
                    14 列 `GPU Memory` 中 Col 35 为系统全局总显存、Col 33 为 3DMark 主进程、Col 40 (~363 MB) 为系统合成器；活跃期系统固定开销恒为 705.5 MB，无显存泄漏或抖动。
                  </Text>
                </Stack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader trailing={<Text size="small" tone="tertiary">59.83s 纯活跃期时间加权</Text>}>
                活跃期管线时间构成与 8 类微架构子态
              </CardHeader>
              <CardBody>
                <Stack gap={12}>
                  <UsageBar
                    total={100}
                    topLeftLabel="3DMark SNL 活跃时间分配"
                    topRightLabel="片元 68.2% · 计算 17.5% · 顶点 14.3%"
                    segments={[
                      { id: "f1", value: 16.5, color: "green" },
                      { id: "f2", value: 14.7, color: "cyan" },
                      { id: "f3", value: 15.7, color: "blue" },
                      { id: "f4", value: 21.3, color: "purple" },
                      { id: "c1", value: 12.9, color: "red" },
                      { id: "c2", value: 1.6, color: "yellow" },
                      { id: "c3", value: 3.0, color: "orange" },
                      { id: "v", value: 14.3, color: "pink" },
                    ]}
                  />
                  <Stack gap={6}>
                    {ROOFLINE_NODES.map((n) => (
                      <Row key={n.id} gap={8} align="center" justify="space-between">
                        <Row gap={6} align="center">
                          <Swatch color={n.color} />
                          <Text size="small" weight="medium">{n.label}</Text>
                        </Row>
                        <Text size="small" tone="secondary">{n.share.toFixed(1)}%</Text>
                      </Row>
                    ))}
                  </Stack>
                </Stack>
              </CardBody>
            </Card>
          </Grid>
        </Stack>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: 60s TIMELINE & SCENE BREAKDOWN                                */}
      {/* ==================================================================== */}
      {activeTab === "timeline" && (
        <Stack gap={18}>
          <Row align="center" justify="space-between" wrap gap={8}>
            <H2>60 秒稳态压测：帧率、管线切换与资源波动 (26s – 84s)</H2>
            <Row gap={6} wrap>
              <Pill active={timelineView === "fps"} onClick={() => setTimelineView("fps")}>
                帧率 & 帧时
              </Pill>
              <Pill active={timelineView === "stage"} onClick={() => setTimelineView("stage")}>
                V / F / C 占比
              </Pill>
              <Pill active={timelineView === "bw"} onClick={() => setTimelineView("bw")}>
                带宽 vs ALU 效率
              </Pill>
              <Pill active={timelineView === "geom"} onClick={() => setTimelineView("geom")}>
                几何 & FP16 脉冲
              </Pill>
            </Row>
          </Row>

          {timelineView === "fps" && (
            <Card>
              <CardHeader trailing={<Text size="small" tone="tertiary">多通道 1ms 自相关反演 · 均 12.64 FPS</Text>}>
                每 2 秒真实帧率 (FPS) 与帧耗时 (ms) 曲线
              </CardHeader>
              <CardBody>
                <Stack gap={10}>
                  <LineChart
                    categories={ACT_CATS}
                    series={[
                      { name: "真实 FPS (自相关)", data: ACT_FPS_AUTOCORR, tone: "info" },
                    ]}
                    height={240}
                    valueSuffix=" FPS"
                    beginAtZero={false}
                    yMin={9}
                    yMax={18}
                    referenceLines={[
                      { value: 12.64, label: "均值 12.64 FPS", tone: "success" },
                      { value: 10.75, label: "S6 带宽谷底 10.75", tone: "danger" },
                    ]}
                    fill
                  />
                  <LineChart
                    categories={ACT_CATS}
                    series={[
                      { name: "单帧耗时 (ms)", data: ACT_FT_MS, tone: "warning" },
                    ]}
                    height={170}
                    valueSuffix=" ms"
                    beginAtZero={false}
                    yMin={55}
                    yMax={102}
                    referenceLines={[{ value: 79.1, label: "均 79.1 ms", tone: "neutral" }]}
                  />
                  <Text size="small" tone="tertiary">
                    算法说明：基于 %V、%C、写带宽、SP 读带宽、ALU 工作率 5 通道标准化 1ms 网格自相关提取精确周期。最慢场景出现在 34s (97ms / 10.3 FPS，重几何+重计算叠加) 与 58–60s (91–93ms / 10.8 FPS，体积计算打满 LPDDR 带宽)；最快场景在 68s (61ms / 16.4 FPS，FP16 计算爆发)。
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          )}

          {timelineView === "stage" && (
            <Card>
              <CardHeader trailing={<Text size="small" tone="tertiary">2s 窗口均值 · 100% 堆叠</Text>}>
                60 秒内 Vertex / Fragment / Compute 三阶段耗时占比演变
              </CardHeader>
              <CardBody>
                <Stack gap={8}>
                  <BarChart
                    categories={ACT_CATS}
                    series={stageSeries2s}
                    height={260}
                    stacked
                    normalized
                    valueSuffix="%"
                  />
                  <Text size="small" tone="tertiary">
                    清楚可见 4 个 Compute 峰值波段（26–28s 开场 33%、32s 29%、56–60s 高潮 30.5%、68s FP16 21.6%）与 3 个纯 Fragment-ALU 主导波段（38–42s、50–54s、62–66s，Fragment 占比 75–79%）。
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          )}

          {timelineView === "bw" && (
            <Card>
              <CardHeader trailing={<Text size="small" tone="tertiary">读带宽与 ALU 效率呈显著跷跷板效应</Text>}>
                DRAM 读写带宽 (GB/s)、ALU 工作率 (%) 与系统内存停顿 (%) 同步曲线
              </CardHeader>
              <CardBody>
                <Stack gap={10}>
                  <LineChart
                    categories={ACT_CATS}
                    series={[
                      { name: "Read Total (GB/s)", data: ACT_RD, tone: "danger" },
                      { name: "Write Total (GB/s)", data: ACT_WR, tone: "info" },
                      { name: "SysMem Stall (%)", data: ACT_SYS_STL, tone: "warning" },
                    ]}
                    height={220}
                    valueSuffix=""
                  />
                  <LineChart
                    categories={ACT_CATS}
                    series={[
                      { name: "% Time ALUs Working (%)", data: ACT_ALU_WK, tone: "success" },
                      { name: "% Texture Pipes Busy (%)", data: ACT_TEX_BSY, tone: "info" },
                    ]}
                    height={190}
                    valueSuffix="%"
                    beginAtZero={false}
                    yMin={30}
                    yMax={75}
                  />
                  <Text size="small" tone="tertiary">
                    关键现象：56–60s 读带宽飙升至 23.9 GB/s (SysMem Stall 4.97%) 时，ALU 工作率被压低至 38.8%；而 64–66s 读带宽降至 10.1 GB/s 时，ALU 工作率跃升至 48.2%（带宽与 ALU 效率呈镜像反转）。
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          )}

          {timelineView === "geom" && (
            <Card>
              <CardHeader trailing={<Text size="small" tone="tertiary">识别几何高峰与 t=68s FP16 特异通道</Text>}>
                三角形吞吐 (M/s)、顶点取指停顿 (%) 与半精度 FP16 指令速率 (GInstr/s)
              </CardHeader>
              <CardBody>
                <Stack gap={10}>
                  <LineChart
                    categories={ACT_CATS}
                    series={[
                      { name: "Pre-clipped Polygons (M/s)", data: ACT_POLY_M, tone: "info" },
                      { name: "Half FP16 Instr (G/s)", data: ACT_HALF_G, tone: "success" },
                      { name: "Vertex Fetch Stall (%)", data: ACT_VTX_STL, tone: "warning" },
                    ]}
                    height={250}
                    valueSuffix=""
                  />
                  <Text size="small" tone="tertiary">
                    亮点捕获：(1) t=68–69s 半精度 FP16 指令突增 3 倍至 42.8 G/s（单帧内 Compute 通道 FP16 占比达 44.4%、331 G/s），为特定屏幕后处理/降噪计算；(2) t=70–78s 顶点取指停顿冲至全测最高 19.4%（三角形 147M/s），是考察华为顶点缓存与几何吞吐的黄金片段。
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          )}

          {/* 11-Scene Reference Table */}
          <Stack gap={8}>
            <H2>11 个典型测试场景特征拆解 (25.4s – 85.25s)</H2>
            <Table
              headers={["场景段", "自相关 FPS", "V / F / C (%)", "ALU 工作", "Tex 忙碌 / 停顿", "读/写带宽 (GB/s)", "SysStl / Bus", "主瓶颈类型"]}
              columnAlign={["left", "right", "center", "right", "right", "right", "right", "left"]}
              rowTone={["danger", "warning", "info", "neutral", "success", "danger", "success", "info", "warning", "neutral", "warning"]}
              striped
              rows={[
                ["S1 开场体积揭示 (25.4–29.5s)", "13.9", "9 / 60 / 31", "41.3%", "65.6% / 23.1%", "20.3 / 3.9", "3.7% / 24.7%", "计算+纹理带宽重载"],
                ["S2 几何与计算叠加 (29.5–37.5s)", "12.0", "16 / 61 / 23", "37.4%", "57.4% / 20.2%", "17.8 / 3.7", "3.2% / 21.8%", "多维混合重压 (34s 最低 10.3 FPS)"],
                ["S3 片元着色高峰 1 (37.5–43.5s)", "14.6", "14 / 72 / 14", "43.8%", "57.2% / 18.1%", "13.7 / 4.4", "1.6% / 17.3%", "FP32 片元着色主导"],
                ["S4 中段综合光照 (43.5–50.0s)", "12.2", "14 / 67 / 19", "39.5%", "56.9% / 18.7%", "15.9 / 3.8", "2.0% / 19.0%", "纹理延迟 + 顶点停顿 (14%)"],
                ["S5 片元 ALU 高峰 2 (50.0–55.0s)", "11.8", "15 / 74 / 11", "43.8%", "54.8% / 15.4%", "11.8 / 3.9", "1.0% / 14.6%", "FP32 ALU 峰值 (54s 达 603 G/s)"],
                ["S6 带宽极限高潮 (55.0–61.0s)", "11.1", "13 / 60 / 27", "38.9%", "62.8% / 23.5%", "21.7 / 3.4", "4.5% / 26.2%", "全测最重 DRAM 带宽瓶颈 (峰 65 GB/s)"],
                ["S7 片元 ALU 高峰 3 (61.0–68.0s)", "12.5", "16 / 75 / 10", "45.0%", "54.9% / 15.5%", "11.8 / 4.1", "1.2% / 14.9%", "最高片元占比 (79%) & 高 ALU 效率"],
                ["S8 FP16 计算脉冲 (68.0–70.0s)", "16.4", "15 / 64 / 22", "41.5%", "51.9% / 13.7%", "12.5 / 4.5", "1.0% / 15.7%", "全测最快；Half FP16 暴增 3x"],
                ["S9 几何与顶点压力 (70.0–78.5s)", "13.1", "17 / 74 / 10", "41.3%", "52.0% / 16.2%", "12.3 / 4.0", "1.2% / 15.3%", "顶点取指停顿峰值 (17.5–20.1%)"],
                ["S10 尾声计算回升 (78.5–82.0s)", "12.0", "14 / 70 / 17", "38.4%", "57.7% / 21.2%", "16.3 / 3.9", "2.0% / 19.5%", "计算带宽与纹理停顿二次抬头"],
                ["S11 终局几何冲刺 (82.0–85.25s)", "13.0", "17 / 75 / 8", "40.9%", "51.6% / 15.4%", "11.3 / 4.0", "0.9% / 14.2%", "最高平均三角形率 (153.2 M/s)"],
              ]}
            />
          </Stack>
        </Stack>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: SINGLE-FRAME X-RAY                                            */}
      {/* ==================================================================== */}
      {activeTab === "xray" && (
        <Stack gap={18}>
          <Row align="center" justify="space-between" wrap gap={8}>
            <H2>毫秒级单帧渲染管线透视 (1.16ms 采样重构 Render Graph)</H2>
            <Row gap={8}>
              <Pill active={frameChoice === "f57"} onClick={() => setFrameChoice("f57")}>
                t=57.0s 带宽极限帧 (89.6 ms)
              </Pill>
              <Pill active={frameChoice === "f65"} onClick={() => setFrameChoice("f65")}>
                t=65.0s 片元 ALU 主导帧 (83.4 ms)
              </Pill>
            </Row>
          </Row>

          <Card>
            <CardHeader
              trailing={
                <Row gap={12} align="center">
                  <Row gap={4} align="center"><Swatch color="pink" /><Text size="small">Vertex</Text></Row>
                  <Row gap={4} align="center"><Swatch color="blue" /><Text size="small">Fragment</Text></Row>
                  <Row gap={4} align="center"><Swatch color="red" /><Text size="small">Compute</Text></Row>
                  <Row gap={4} align="center"><Swatch color="green" /><Text size="small">ALU%</Text></Row>
                  <Row gap={4} align="center"><Swatch color="cyan" /><Text size="small">Tex%</Text></Row>
                  <Row gap={4} align="center"><Swatch color="orange" /><Text size="small">Rd GB/s</Text></Row>
                </Row>
              }
            >
              {frameChoice === "f57"
                ? "单帧解剖 #1：t=57.019s – 57.109s (89.6 ms · 11.16 FPS · 中段 20ms 体积计算打爆总线)"
                : "单帧解剖 #2：t=65.007s – 65.091s (83.4 ms · 11.99 FPS · 片元 PBR 达 89% ALU 满载)"}
            </CardHeader>
            <CardBody>
              <Stack gap={10}>
                <FrameXRaySvg
                  samples={frameChoice === "f57" ? FRAME_57 : FRAME_65}
                  totalMs={frameChoice === "f57" ? 89.6 : 83.4}
                  title={frameChoice === "f57" ? "Frame at t=57s" : "Frame at t=65s"}
                />
                <Callout
                  tone={frameChoice === "f57" ? "danger" : "info"}
                  title={frameChoice === "f57" ? "t=57s 帧内瓶颈直击：39–60ms 体积计算将 LPDDR5X 推至 100%" : "t=65s 帧内特征：全屏光照 ALU 89% 满载 + 片上缓存高命中"}
                >
                  <Text size="small">
                    {frameChoice === "f57"
                      ? "39.7ms 至 59.5ms 连续 19.8ms 处于 100% Compute 状态，纹理读带宽一路爬升 49.2 → 63.9 GB/s，GPU 总线忙碌度触及 100%，Shaders Stalled 飙升至 31–40%，导致 ALU 工作率被压榨至 10–19%。对比 t=65s 该计算段仅耗时 3ms，单个体积计算通道的膨胀直接贡献了 +17ms 帧耗差异。"
                      : "42–50ms 与 56–67ms 两段全屏光照通道中，ALU 工作率连续稳定在 82–89%、Shaders Stalled 仅 0–2%、读带宽仅 4.2–6.0 GB/s（L2 命中率 98%），展现了 Adreno TBDR+GMEM/L2 的极佳局部性；但 0–11ms 顶点 Binning 阶段 ALU 仅 4–7%、停顿率高达 27–41%。"}
                  </Text>
                </Callout>
              </Stack>
            </CardBody>
          </Card>

          {/* 6-Stage RenderPass Anatomy Table */}
          <Stack gap={8}>
            <H2>Steel Nomad Light 典型单帧 6 阶段渲染图 (Render Graph) 还原</H2>
            <Table
              headers={["帧内阶段", "t=57s 耗时", "t=65s 耗时", "硬件计数器指纹", "主要硬件制约"]}
              columnAlign={["left", "right", "right", "left", "left"]}
              rowTone={["warning", "neutral", "success", "danger", "info", "warning"]}
              rows={[
                ["1. 阴影/几何 Binning (Vertex)", "9.6 ms", "12.0 ms", "%V=100%, Polys 730–1,150M/s, ShBusy 30–47%, ShStall 27–41%", "固定功能几何前端 (1.0–1.25 tri/clk) 饥饿着色器"],
                ["2. 主场景 G-Buffer (Fragment)", "21.0 ms", "27.5 ms", "%F=99%, ALUWk 40–55%, VtxStl 25–30%, L2 Miss 41%, 面积 43px", "微三角形 Quad 浪费 + 材质纹理 L2 缺失与二次顶点取指"],
                ["3. 延迟 PBR 光照 1 (Fullscreen F)", "8.5 ms", "9.5 ms", "%F=100%, ALUWk 58–83%, TexBsy 80–87%, L2 Miss 1.8%", "FP32 算力与纹理管线双高，片上缓存极佳"],
                ["4. 体积雾/GI 光照 (Compute)", "20.5 ms", "3.0 ms", "%C=100%, Rd 49–64 GB/s (99% TexRd), Bus 53–100%, ALUWk 10–24%", "全测头号带宽杀手；直接决定场景帧率下限"],
                ["5. 透明/反射/后处理 (Fullscreen F)", "19.5 ms", "25.0 ms", "%F=100%, 前段 ALUWk 82–89% (Stall 1%) → 后段 TexBsy 94–100%", "前段纯 FP32 ALU 瓶颈，后段 TMU 纹理管线 100% 饱和"],
                ["6. 帧尾剔除/写回 (Compute)", "5.5 ms", "4.5 ms", "%C=80–100%, Wr 12–19 GB/s, SP Read 突刺 1.1–1.9 GB/s, L2 Miss 85%", "GPU-Driven Indirect/Hi-Z 剔除 + SSBO 随机读写"],
              ]}
            />
          </Stack>

          {/* Per-Frame Resource Budget */}
          <Card>
            <CardHeader trailing={<Text size="small" tone="tertiary">按 1440p (2560×1440) · 均值 12.50–12.64 FPS 积分</Text>}>
              单帧总工作量账本 (Per-Frame Workload Footprint — 跨 SoC 对比不变量)
            </CardHeader>
            <CardBody>
              <Grid columns={4} gap={14}>
                <Stat value="1,525.6 MB" label="单帧总 DRAM 流量 (读1211/写315)" tone="danger" />
                <Stat value="39.71 B" label="单帧片元+计算指令 (FP32占92%)" tone="info" />
                <Stat value="9.69 M" label="单帧三角形 (顶点复用率 70.7%)" tone="warning" />
                <Stat value="88.80 M" label="单帧着色片元 (1440p 下 24.1x)" tone="success" />
              </Grid>
              <Divider style={{ margin: "12px 0" }} />
              <Text size="small" tone="secondary">
                分辨率实证：全屏通道多边形面积均值 `1,842,538 px`（恰为 `2560×1440 ÷ 2 = 1,843,200` 像素，匹配度 99.96%），最大值 `7,369,280 px`（恰为超大单三角形 `2×2560×1440 = 7,372,800` 像素，匹配度 99.95%）。单帧 DRAM 读构成：纹理读 `1,050.0 MB (86.7%)`、GMEM/命令流等 `90.8 MB (7.5%)`、顶点读 `63.8 MB (5.3%)`、SP/SSBO 读 `6.3 MB (0.5%)`。
              </Text>
            </CardBody>
          </Card>
        </Stack>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: BOTTLENECKS, BW KNEE & ROOFLINE                               */}
      {/* ==================================================================== */}
      {activeTab === "roofline" && (
        <Stack gap={18}>
          {/* Empirical Roofline */}
          <Card>
            <CardHeader trailing={<Text size="small" tone="tertiary">全部上限均由实测计数器反推 · 点击气泡切换解读</Text>}>
              Adreno 750 实测 Roofline 模型：8 类子负载的算力/带宽定位
            </CardHeader>
            <CardBody>
              <Stack gap={12}>
                <RooflineSvg selectedId={selectedRoof} onSelect={setSelectedRoof} />
                <Row
                  gap={12}
                  align="center"
                  justify="space-between"
                  wrap
                  style={{
                    background: theme.fill.tertiary,
                    padding: "10px 14px",
                    borderRadius: theme.radius.md,
                  }}
                >
                  <Stack gap={2}>
                    <Row gap={8} align="center">
                      <Swatch color={roofSelected.color} />
                      <Text weight="semibold">{roofSelected.label}</Text>
                      <Text size="small" tone="tertiary">占活跃时长 {roofSelected.share}%</Text>
                    </Row>
                    <Text size="small" tone="secondary">
                      主导制约：{roofSelected.bound} · OI = {roofSelected.oi} Instr/B · 吞吐 = {roofSelected.gInstr} GInstr/s · 总带宽 = {roofSelected.bw} GB/s
                    </Text>
                  </Stack>
                  <Row gap={14}>
                    <Stat value={`${roofSelected.aluCap}%`} label="ALU 容量" />
                    <Stat value={`${roofSelected.tex}%`} label="Tex 忙碌" />
                    <Stat value={`${roofSelected.bus}%`} label="Bus 忙碌" tone={roofSelected.bus > 40 ? "danger" : undefined} />
                    <Stat value={`${roofSelected.sysStl}%`} label="内存停顿" tone={roofSelected.sysStl > 5 ? "danger" : undefined} />
                  </Row>
                </Row>
              </Stack>
            </CardBody>
          </Card>

          {/* Memory Bandwidth Saturation Knee */}
          <Card>
            <CardHeader trailing={<Text size="small" tone="tertiary">50 GB/s 处出现 5.5x 系统内存停顿悬崖</Text>}>
              DRAM 带宽拐点曲线 (0–65 GB/s 分桶)：停顿激增与 ALU 效率塌陷
            </CardHeader>
            <CardBody>
              <Stack gap={10}>
                <LineChart
                  categories={BW_CATS}
                  series={[
                    { name: "GPU Bus Busy (%)", data: BW_BUS, tone: "info" },
                    { name: "Tex Fetch Stall (%)", data: BW_TEX_STL, tone: "warning" },
                    { name: "SysMem Stall (%)", data: BW_SYS_STL, tone: "danger" },
                    { name: "ALU Working (%)", data: BW_ALU_WK, tone: "success" },
                  ]}
                  height={250}
                  valueSuffix="%"
                />
                <BarChart
                  categories={BW_CATS}
                  series={[{ name: "活跃时间占比 (%)", data: BW_SHARE, tone: "neutral" }]}
                  height={130}
                  valueSuffix="%"
                  showValues
                />
                <Text size="small" tone="tertiary">
                  关键拐点：总带宽在 0–45 GB/s（占活跃时长 89.4%）时，`SysMem Stall` 温和维持在 0.2%–4.6%；一旦跨过 50 GB/s（5.5% 时长，几乎 100% 为 Compute 通道），`SysMem Stall` 呈非线性暴涨 `2.17% → 11.88% → 17.58% → 32.24%`，`L1 Miss` 飙升至 `69.0%`，`ALU Working` 暴跌至 `13.4%`。在 Bus≥90% 区间实测持续总带宽上限为 `63.7–65.3 GB/s`（达 LPDDR5X-8533 理论峰值的 95.6%）。
                </Text>
              </Stack>
            </CardBody>
          </Card>

          {/* Cache & Precision Contrast + Correlation */}
          <Grid columns={2} gap={16} align="start">
            <Card>
              <CardHeader trailing={<Text size="small" tone="tertiary">纯片元 vs 纯计算对比</Text>}>
                指令精度结构 (FP32 / FP16 / EFU) 与纹理过滤分布
              </CardHeader>
              <CardBody>
                <Stack gap={12}>
                  <BarChart
                    categories={["纯片元 (%F>=95)", "G-Buffer 几何", "全屏 PBR 光照", "纯计算 (%C>=95)", "t=68s FP16 脉冲"]}
                    series={[
                      { name: "FP32 Full (%)", data: [93.6, 93.3, 95.2, 63.2, 52.3], tone: "info" },
                      { name: "FP16 Half (%)", data: [2.7, 4.3, 0.4, 30.7, 41.3], tone: "success" },
                      { name: "EFU 超越函数 (%)", data: [3.7, 2.4, 4.4, 6.1, 6.4], tone: "warning" },
                    ]}
                    height={210}
                    stacked
                    normalized
                    valueSuffix="%"
                  />
                  <Text size="small" tone="secondary">
                    纹理过滤特征：全局活跃期 Nearest 57.1% / Linear 32.3% / Anisotropic 9.8%；其中 G-Buffer 几何含 26.2% 各向异性过滤，而高带宽 Compute 通道 88.8% 为线性/三线性采样（体素/3D 纹理插值，对 TMU 带宽与 L1 容量极敏感）。
                  </Text>
                </Stack>
              </CardBody>
            </Card>

            <Card>
              <CardHeader trailing={<Text size="small" tone="tertiary">n = 47,391 活跃样本 Pearson r</Text>}>
                核心性能指标强相关关系 (|r| Top Pairs)
              </CardHeader>
              <CardBody style={{ padding: 0 }}>
                <Table
                  framed={false}
                  headers={["指标对", "相关系数 r", "微架构因果解释"]}
                  columnAlign={["left", "right", "left"]}
                  rowTone={["danger", "warning", "danger", "danger", "success", "warning", "info", "info"]}
                  rows={[
                    ["Bus Busy ↔ Read BW", "+0.954", "读带宽几乎完全决定总线拥塞度"],
                    ["Shaders Busy ↔ %Vtx", "-0.889", "顶点通道因几何前端受限严重拉低着色器占用"],
                    ["Bus Busy ↔ %Compute", "+0.834", "高带宽冲击高度集中在 Compute 通道"],
                    ["SysMem Stall ↔ Bus Busy", "+0.807", "总线趋于饱和直接引爆系统内存停顿"],
                    ["ALU Working ↔ %Frag", "+0.802", "算力变现几乎完全由片元阶段贡献"],
                    ["Shaders Stalled ↔ ALUCap", "-0.794", "着色器停顿是吞噬 ALU 容量的第一杀手"],
                    ["Tex Busy ↔ L2 Miss", "-0.696", "L2 高命中(全屏通道)才能持续喂饱 TMU"],
                    ["Tex Fetch Stall ↔ Read BW", "+0.633", "外存纹理流式读取拉长取指返回延迟"],
                  ]}
                />
              </CardBody>
            </Card>
          </Grid>
        </Stack>
      )}

      {/* ==================================================================== */}
      {/* TAB 5: HUAWEI DIAGNOSTIC PLAYBOOK & FULL 54-COUNTER REFERENCE        */}
      {/* ==================================================================== */}
      {activeTab === "huawei" && (
        <Stack gap={18}>
          <Callout
            tone="info"
            title="从 OnePlus 12 (Adreno 750) 基线提炼华为 GPU (Kirin / Maleoon) 6 维排查路线图"
          >
            <Text size="small">
              3DMark Steel Nomad Light 在同分辨率 (2560×1440) 下对任意手机提交完全相同的每帧工作量账本（9.69M 三角形、88.8M 片元、39.7B 指令、1.53 GB DRAM 基准流量）。因此，采集华为手机的 SNL 硬件计数器后，只要沿以下 6 个维度与本基线逐项比对，即可在分钟级定位真实差距是来自频率策略、内存带宽、片上缓存、FP32 算力、几何分块还是驱动编译。
            </Text>
          </Callout>

          {/* 6-Dimension Diagnostic Playbook */}
          <Stack gap={8}>
            <H2>华为 GPU 性能差距 6 维归因矩阵</H2>
            <Table
              headers={["诊断维度", "OnePlus 12 (Adreno 750) 基线标杆", "华为手机重点核查信号", "若劣于基线，说明什么根因？"]}
              columnAlign={["left", "left", "left", "left"]}
              rowTone={["danger", "info", "warning", "warning", "success", "neutral"]}
              rows={[
                [
                  "1. DVFS 与热稳态",
                  "102ms 爬坡至 903 MHz，60s 全程 0 降频，真实利用率 ~100%",
                  "检查 gpufreq 轨迹与 Clocks/s 是否在 20–40s 内掉频；检查帧间有无 GPU Idle 气泡",
                  "若掉频 → 温控/能效墙受限；若满频但有气泡 → CPU/Vulkan 驱动提交瓶颈",
                ],
                [
                  "2. FP32 算力与精度墙",
                  "纯片元 93.6% FP32 (峰值 1,078–1,158 G/s)，全屏 PBR 阶段 ALU 工作率 77–89%",
                  "对比 S5/S7 纯片元高潮段帧耗时及 FP32 vs FP16 发射率、ALU 有效利用率",
                  "SNL 几乎不能靠 FP16 翻倍取巧；若 S5/S7 掉帧重 → FP32 FMA 规模或着色器编译器指令调度劣势",
                ],
                [
                  "3. 内存带宽与拐点悬崖",
                  "持续带宽上限 65.3 GB/s，50 GB/s 以上才现停顿悬崖；单帧流量 1,526 MB",
                  "死盯 S1 (26s) 与 S6 (56–60s) 体积计算段：实测峰值带宽、Bus Busy、L2 缺失、帧耗暴涨幅度",
                  "若华为实测 DRAM 上限仅 40–48 GB/s 或无等效纹理压缩(UBWC/AFBC)，S6 悬崖占比将从 5.5% 扩至 20%+，成最大丢分点",
                ],
                [
                  "4. TBDR 片上缓存 & 纹理管线",
                  "全屏 PBR/后处理 L2 缺失仅 1.8–3.2%，TMU 忙碌达 90%，G-Buffer L2 缺失 40.8%",
                  "核查全屏阶段外存写回/读回是否异常升高（Tile Buffer/GMEM 溢出或 RenderPass 拆分过多）",
                  "若全屏通道 L2 缺失>15% 或写带宽显著高于 315 MB/帧 → TBDR Tile 合并/Load-Store 策略或 L2 容量/替换策略缺陷",
                ],
                [
                  "5. 几何前端 & 微三角形处理",
                  "14.3% 帧时在顶点 Binning；前端 0.82–1.25 tri/clk，复用率 70.7%；G-Buffer 面积中位 43px",
                  "对比 S9 (70–78s) 与 S11 (82–85s) 顶点阶段占比、多边形/时钟、Vertex Fetch Stall、Helper Lane 浪费",
                  "若顶点占比>22% 或 S9 帧时骤增 → Tiler/几何引擎每周期三角形吞吐偏低或顶点属性布局未优化",
                ],
                [
                  "6. 驱动编译与寄存器溢出",
                  "SP Memory Read 片元期≈0 (仅 C3 剔除脉冲 1.8 GB/s)；I-Cache Miss 仅 0.25% (预热期 0.54%)",
                  "检查片元期是否存在持续 Local/Private Memory 读写 (Register Spilling) 及波前占用率 (Occupancy)",
                  "若片元期出现 >0.5 GB/s 的 Local/SP 读或 I-Cache Miss >1% → 华为着色器编译器寄存器分配与指令排布存在重大优化空间",
                ],
              ]}
            />
          </Stack>

          {/* Collapsible Deep Methodology Checklist */}
          <CollapsibleSection
            title="开展华为 vs 一加 12 同场景对标测试时的采集规范建议 (点击展开)"
            leading={<Swatch color="blue" />}
            count={4}
          >
            <Stack gap={6} style={{ paddingTop: 6 }}>
              <Text size="small">
                1. <Text weight="semibold">对齐采样配置与未挂工具基准分</Text>：先记录两台机器不挂 APA 的 3DMark SNL 裸跑分数与单帧曲线，再记录挂 APA 后的分数，量化各自 Profiling 开销（一加 12 本轮 860Hz×54 项约引入 15–25% 开销）。
              </Text>
              <Text size="small">
                2. <Text weight="semibold">对齐场景时间戳而非绝对时间</Text>：不同机器加载耗时不同（一加 12 加载+预热耗时 25.4s），横向对比时应以“DVFS 爬坡后正式渲染第 0s”为基准零点对齐 S1–S11 场景段，并用时间加权均值剔除加载与退场。
              </Text>
              <Text size="small">
                3. <Text weight="semibold">警惕厂商计数器口径差异</Text>：如本报告揭示的 Adreno `GPU % Util` (INT32_MAX 分母) 与 `ALU/Frag` (混入 Compute)；对比 Maleoon 计数器时，优先使用物理守恒量——`总 DRAM 读写字节/帧`、`每秒三角形与片元数`、`各阶段时间占比` 与 `实测峰值带宽/算力 Roofline`。
              </Text>
              <Text size="small">
                4. <Text weight="semibold">增补 3 个高价值联动维度</Text>：后续采集华为机器时，建议同步拉取 `GPU 功耗/整机电流 (mW)`、`SoC/壳温曲线` 与 `SurfaceFlinger Present/FrameTimeline`，结合本基线的 `1,526 MB/帧` 与 `39.7B 指令/帧`，直接计算 `能效比 (FPS/W)` 与 `每瓦带宽效率`。
              </Text>
            </Stack>
          </CollapsibleSection>

          <Divider />

          {/* Interactive Searchable/Filterable Full Counter Baseline Catalog */}
          <Stack gap={10}>
            <Row align="center" justify="space-between" wrap gap={8}>
              <H2>活跃期核心 GPU 计数器基线速查表 (25.40s – 85.25s 时间加权)</H2>
              <Row gap={6} wrap>
                {["All", "System", "Shader", "Texture", "Memory", "Geometry", "Compute"].map((cat) => (
                  <Pill
                    key={cat}
                    size="sm"
                    active={counterCat === cat}
                    onClick={() => setCounterCat(cat)}
                  >
                    {cat}
                  </Pill>
                ))}
              </Row>
            </Row>
            <Table
              headers={["分类", "计数器名称", "单位", "时间加权均值", "P50 中位", "P95", "P99", "工程解读与对标要点"]}
              columnAlign={["left", "left", "center", "right", "right", "right", "right", "left"]}
              rowTone={filteredCounters.map((c) => c.tone)}
              striped
              stickyHeader
              rows={filteredCounters.map((c) => [
                c.cat,
                c.name,
                c.unit,
                c.twMean,
                c.p50,
                c.p95,
                c.p99,
                c.note,
              ])}
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
