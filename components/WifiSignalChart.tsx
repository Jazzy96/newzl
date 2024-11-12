import React, { useState } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { processExcelFile } from '@/utils/excelProcessor';

// 修改数据点接口定义
interface DataPoint {
  time: string;
  "0004A (5G)"?: number;
  "0004A (2.4G)"?: number;
  "00383 (5G)"?: number;
  "00383 (2.4G)"?: number;
  [key: string]: string | number | undefined; // 允许其他可能的键
}

interface ColorMap {
  [key: string]: string;
}

// 为默认数据添加类型注解
const defaultData: DataPoint[] = [
  {
    "time": "06:25:50",
    "0004A (5G)": -36
  },
  {
    "time": "06:26:19",
    "0004A (5G)": -60
  },
  {
    "time": "06:26:50",
    "0004A (5G)": -77
  },
  {
    "time": "06:27:19",
    "0004A (5G)": -67
  },
  {
    "time": "06:27:50",
    "0004A (5G)": -67
  },
  {
    "time": "06:28:19",
    "0004A (5G)": -67
  },
  {
    "time": "06:28:50",
    "0004A (5G)": -67
  },
  {
    "time": "06:29:19",
    "0004A (5G)": -74
  },
  {
    "time": "06:29:50",
    "0004A (5G)": -70
  },
  {
    "time": "06:30:19",
    "0004A (5G)": -70
  },
  {
    "time": "06:30:50",
    "0004A (5G)": -70
  },
  {
    "time": "06:31:19",
    "0004A (5G)": -70
  },
  {
    "time": "06:31:50",
    "0004A (5G)": -70
  },
  {
    "time": "06:32:19",
    "0004A (5G)": -70
  },
  {
    "time": "06:32:50",
    "0004A (5G)": -68
  },
  {
    "time": "06:33:19",
    "0004A (5G)": -69
  },
  {
    "time": "06:33:50",
    "0004A (5G)": -71
  },
  {
    "time": "06:34:19",
    "0004A (5G)": -73
  },
  {
    "time": "06:34:50",
    "0004A (5G)": -69
  },
  {
    "time": "06:35:19",
    "0004A (5G)": -71
  },
  {
    "time": "06:35:50",
    "0004A (5G)": -72
  },
  {
    "time": "06:36:19",
    "0004A (5G)": -76
  },
  {
    "time": "06:36:50",
    "0004A (5G)": -71
  },
  {
    "time": "06:37:19",
    "0004A (5G)": -74
  },
  {
    "time": "06:37:50",
    "0004A (5G)": -73
  },
  {
    "time": "06:38:19",
    "0004A (5G)": -71
  },
  {
    "time": "06:38:50",
    "0004A (5G)": -72
  },
  {
    "time": "06:39:19",
    "0004A (5G)": -72
  },
  {
    "time": "06:45:50",
    "0004A (5G)": -77
  },
  {
    "time": "06:46:19",
    "0004A (5G)": -73
  },
  {
    "time": "06:46:50",
    "0004A (5G)": -76
  },
  {
    "time": "06:47:19",
    "0004A (5G)": -72
  },
  {
    "time": "06:47:50",
    "0004A (5G)": -85
  },
  {
    "time": "06:48:19",
    "0004A (5G)": -71
  },
  {
    "time": "06:48:50",
    "0004A (5G)": -76
  },
  {
    "time": "06:49:19",
    "0004A (5G)": -72
  },
  {
    "time": "06:51:19",
    "0004A (2.4G)": -81
  },
  {
    "time": "06:51:50",
    "0004A (2.4G)": -71
  },
  {
    "time": "06:52:19",
    "0004A (2.4G)": -71
  },
  {
    "time": "06:52:50",
    "0004A (5G)": -68
  },
  {
    "time": "06:53:19",
    "0004A (5G)": -72
  },
  {
    "time": "06:53:50",
    "0004A (2.4G)": -75
  },
  {
    "time": "06:54:19",
    "0004A (5G)": -64
  },
  {
    "time": "06:54:50",
    "0004A (5G)": -68
  },
  {
    "time": "06:55:19",
    "0004A (5G)": -74
  },
  {
    "time": "06:55:50",
    "0004A (2.4G)": -73
  },
  {
    "time": "06:56:19",
    "0004A (5G)": -69
  },
  {
    "time": "06:56:50",
    "0004A (5G)": -73
  },
  {
    "time": "06:57:19",
    "0004A (2.4G)": -67
  },
  {
    "time": "06:57:50",
    "0004A (2.4G)": -72
  },
  {
    "time": "06:58:19",
    "0004A (2.4G)": -72
  },
  {
    "time": "06:58:50",
    "0004A (5G)": -75
  },
  {
    "time": "06:59:12",
    "00383 (5G)": -37
  },
  {
    "time": "06:59:42",
    "00383 (5G)": -25
  },
  {
    "time": "07:00:12",
    "00383 (5G)": -31
  },
  {
    "time": "07:00:42",
    "00383 (5G)": -45
  },
  {
    "time": "07:01:12",
    "00383 (5G)": -45
  },
  {
    "time": "07:01:42",
    "00383 (5G)": -30
  },
  {
    "time": "07:02:12",
    "00383 (5G)": -34
  },
  {
    "time": "07:02:42",
    "00383 (5G)": -82
  },
  {
    "time": "07:02:50",
    "0004A (5G)": -78
  },
  {
    "time": "07:03:19",
    "0004A (5G)": -72
  },
  {
    "time": "07:03:50",
    "0004A (5G)": -69
  },
  {
    "time": "07:04:19",
    "0004A (5G)": -74
  },
  {
    "time": "07:04:50",
    "0004A (2.4G)": -64
  },
  {
    "time": "07:05:19",
    "0004A (2.4G)": -62
  },
  {
    "time": "07:05:50",
    "0004A (2.4G)": -73
  },
  {
    "time": "07:06:19",
    "0004A (2.4G)": -72
  },
  {
    "time": "07:06:50",
    "0004A (2.4G)": -69
  },
  {
    "time": "07:07:19",
    "0004A (5G)": -73
  },
  {
    "time": "07:07:49",
    "0004A (5G)": -71
  },
  {
    "time": "07:08:19",
    "0004A (5G)": -78
  },
  {
    "time": "07:08:42",
    "00383 (5G)": -52
  },
  {
    "time": "07:09:12",
    "00383 (5G)": -59
  },
  {
    "time": "07:09:42",
    "00383 (5G)": -53
  },
  {
    "time": "07:10:12",
    "00383 (5G)": -44
  },
  {
    "time": "07:10:42",
    "00383 (5G)": -45
  },
  {
    "time": "07:11:12",
    "00383 (5G)": -51
  },
  {
    "time": "07:11:42",
    "00383 (5G)": -51
  },
  {
    "time": "07:12:12",
    "00383 (5G)": -47
  },
  {
    "time": "07:12:42",
    "00383 (5G)": -55
  },
  {
    "time": "07:13:12",
    "00383 (5G)": -46
  },
  {
    "time": "07:13:42",
    "00383 (5G)": -47
  },
  {
    "time": "07:14:12",
    "00383 (5G)": -59
  },
  {
    "time": "07:14:42",
    "00383 (5G)": -59
  },
  {
    "time": "07:15:12",
    "00383 (5G)": -57
  },
  {
    "time": "07:15:42",
    "00383 (5G)": -57
  },
  {
    "time": "07:16:12",
    "00383 (5G)": -57
  },
  {
    "time": "07:16:42",
    "00383 (5G)": -54
  },
  {
    "time": "07:17:12",
    "00383 (5G)": -51
  },
  {
    "time": "07:17:50",
    "0004A (2.4G)": -83
  },
  {
    "time": "07:28:59",
    "00383 (5G)": -46
  },
  {
    "time": "07:29:29",
    "00383 (5G)": -50
  },
  {
    "time": "07:29:59",
    "00383 (5G)": -41
  },
  {
    "time": "07:30:29",
    "00383 (5G)": -39
  },
  {
    "time": "07:30:59",
    "00383 (5G)": -55
  },
  {
    "time": "07:33:52",
    "00383 (5G)": -49
  },
  {
    "time": "07:34:22",
    "00383 (5G)": -57
  },
  {
    "time": "07:34:52",
    "00383 (5G)": -62
  },
  {
    "time": "07:35:22",
    "00383 (5G)": -51
  },
  {
    "time": "07:35:52",
    "00383 (5G)": -46
  },
  {
    "time": "07:36:22",
    "00383 (5G)": -62
  },
  {
    "time": "07:36:52",
    "00383 (5G)": -49
  },
  {
    "time": "07:37:22",
    "00383 (5G)": -65
  },
  {
    "time": "07:37:52",
    "00383 (5G)": -56
  },
  {
    "time": "07:38:22",
    "00383 (5G)": -62
  },
  {
    "time": "07:38:52",
    "00383 (5G)": -57
  },
  {
    "time": "07:39:22",
    "00383 (5G)": -48
  },
  {
    "time": "07:39:52",
    "00383 (5G)": -47
  },
  {
    "time": "07:40:22",
    "00383 (5G)": -70
  },
  {
    "time": "07:40:52",
    "00383 (5G)": -66
  },
  {
    "time": "07:41:22",
    "00383 (5G)": -75
  },
  {
    "time": "07:41:52",
    "00383 (5G)": -67
  },
  {
    "time": "07:42:22",
    "00383 (5G)": -44
  },
  {
    "time": "07:42:52",
    "00383 (5G)": -47
  },
  {
    "time": "07:43:22",
    "00383 (5G)": -47
  },
  {
    "time": "07:43:52",
    "00383 (5G)": -53
  },
  {
    "time": "07:44:22",
    "00383 (5G)": -52
  },
  {
    "time": "07:44:52",
    "00383 (5G)": -53
  },
  {
    "time": "07:45:22",
    "00383 (5G)": -47
  },
  {
    "time": "07:45:52",
    "00383 (5G)": -54
  },
  {
    "time": "07:46:22",
    "00383 (5G)": -48
  },
  {
    "time": "07:46:52",
    "00383 (5G)": -59
  },
  {
    "time": "07:47:22",
    "00383 (5G)": -48
  },
  {
    "time": "07:47:52",
    "00383 (5G)": -47
  },
  {
    "time": "07:48:22",
    "00383 (5G)": -54
  },
  {
    "time": "07:48:52",
    "00383 (5G)": -53
  },
  {
    "time": "07:49:22",
    "00383 (5G)": -49
  },
  {
    "time": "07:49:52",
    "00383 (5G)": -46
  },
  {
    "time": "07:50:22",
    "00383 (5G)": -45
  },
  {
    "time": "07:50:52",
    "00383 (5G)": -54
  },
  {
    "time": "07:51:22",
    "00383 (5G)": -57
  },
  {
    "time": "07:51:52",
    "00383 (5G)": -54
  },
  {
    "time": "07:52:22",
    "00383 (5G)": -66
  },
  {
    "time": "07:52:52",
    "00383 (5G)": -64
  },
  {
    "time": "07:53:22",
    "00383 (5G)": -63
  },
  {
    "time": "07:53:52",
    "00383 (5G)": -62
  },
  {
    "time": "07:54:22",
    "00383 (5G)": -61
  },
  {
    "time": "07:54:52",
    "00383 (5G)": -58
  },
  {
    "time": "07:55:22",
    "00383 (5G)": -58
  },
  {
    "time": "07:55:52",
    "00383 (5G)": -52
  },
  {
    "time": "07:56:22",
    "00383 (5G)": -49
  },
  {
    "time": "07:56:52",
    "00383 (5G)": -53
  },
  {
    "time": "07:57:22",
    "00383 (5G)": -48
  },
  {
    "time": "07:57:52",
    "00383 (5G)": -56
  },
  {
    "time": "07:58:22",
    "00383 (5G)": -53
  },
  {
    "time": "07:58:52",
    "00383 (5G)": -64
  },
  {
    "time": "07:59:22",
    "00383 (5G)": -59
  },
  {
    "time": "07:59:52",
    "00383 (5G)": -57
  },
  {
    "time": "08:00:22",
    "00383 (5G)": -56
  },
  {
    "time": "08:00:52",
    "00383 (5G)": -56
  },
  {
    "time": "08:01:22",
    "00383 (5G)": -56
  },
  {
    "time": "08:01:52",
    "00383 (5G)": -62
  },
  {
    "time": "08:02:22",
    "00383 (5G)": -71
  },
  {
    "time": "08:02:52",
    "00383 (5G)": -66
  },
  {
    "time": "08:03:22",
    "00383 (5G)": -53
  },
  {
    "time": "08:03:52",
    "00383 (5G)": -50
  },
  {
    "time": "08:04:22",
    "00383 (5G)": -63
  },
  {
    "time": "08:04:52",
    "00383 (5G)": -48
  },
  {
    "time": "08:05:22",
    "00383 (5G)": -52
  },
  {
    "time": "08:05:52",
    "00383 (5G)": -58
  },
  {
    "time": "08:06:22",
    "00383 (5G)": -71
  },
  {
    "time": "08:06:52",
    "00383 (5G)": -49
  },
  {
    "time": "08:07:22",
    "00383 (5G)": -47
  },
  {
    "time": "08:07:52",
    "00383 (5G)": -48
  },
  {
    "time": "08:08:22",
    "00383 (5G)": -53
  },
  {
    "time": "08:08:52",
    "00383 (5G)": -64
  },
  {
    "time": "08:09:22",
    "00383 (5G)": -53
  },
  {
    "time": "08:09:52",
    "00383 (5G)": -55
  },
  {
    "time": "08:10:22",
    "00383 (5G)": -60
  },
  {
    "time": "08:10:52",
    "00383 (5G)": -53
  },
  {
    "time": "08:11:22",
    "00383 (5G)": -53
  },
  {
    "time": "08:11:52",
    "00383 (5G)": -53
  },
  {
    "time": "08:12:22",
    "00383 (5G)": -56
  },
  {
    "time": "08:12:52",
    "00383 (5G)": -51
  },
  {
    "time": "08:13:22",
    "00383 (5G)": -57
  },
  {
    "time": "08:13:52",
    "00383 (5G)": -50
  },
  {
    "time": "08:14:22",
    "00383 (5G)": -54
  },
  {
    "time": "08:14:52",
    "00383 (5G)": -50
  },
  {
    "time": "08:15:22",
    "00383 (5G)": -48
  },
  {
    "time": "08:15:52",
    "00383 (5G)": -52
  },
  {
    "time": "08:16:22",
    "00383 (5G)": -53
  },
  {
    "time": "08:16:52",
    "00383 (5G)": -53
  },
  {
    "time": "08:17:22",
    "00383 (5G)": -53
  },
  {
    "time": "08:17:52",
    "00383 (5G)": -58
  },
  {
    "time": "08:18:22",
    "00383 (5G)": -47
  },
  {
    "time": "08:18:52",
    "00383 (5G)": -47
  },
  {
    "time": "08:19:22",
    "00383 (5G)": -48
  },
  {
    "time": "08:19:52",
    "00383 (5G)": -53
  },
  {
    "time": "08:20:22",
    "00383 (5G)": -48
  },
  {
    "time": "08:20:52",
    "00383 (5G)": -47
  },
  {
    "time": "08:21:22",
    "00383 (5G)": -59
  },
  {
    "time": "08:21:52",
    "00383 (5G)": -54
  },
  {
    "time": "08:22:22",
    "00383 (5G)": -57
  },
  {
    "time": "08:22:52",
    "00383 (5G)": -56
  },
  {
    "time": "08:23:22",
    "00383 (5G)": -56
  },
  {
    "time": "08:23:52",
    "00383 (5G)": -47
  },
  {
    "time": "08:24:22",
    "00383 (5G)": -56
  },
  {
    "time": "08:24:52",
    "00383 (5G)": -60
  },
  {
    "time": "08:25:22",
    "00383 (5G)": -48
  },
  {
    "time": "08:25:52",
    "00383 (5G)": -48
  },
  {
    "time": "08:26:22",
    "00383 (5G)": -47
  },
  {
    "time": "08:26:52",
    "00383 (5G)": -31
  },
  {
    "time": "08:27:22",
    "00383 (5G)": -75
  },
  {
    "time": "08:27:52",
    "00383 (5G)": -60
  },
  {
    "time": "08:28:22",
    "00383 (5G)": -66
  },
  {
    "time": "08:28:52",
    "00383 (5G)": -66
  },
  {
    "time": "08:29:22",
    "00383 (5G)": -65
  },
  {
    "time": "08:29:52",
    "00383 (5G)": -72
  },
  {
    "time": "08:30:22",
    "00383 (5G)": -67
  },
  {
    "time": "08:30:52",
    "00383 (5G)": -69
  },
  {
    "time": "08:31:22",
    "00383 (5G)": -71
  },
  {
    "time": "08:31:52",
    "00383 (5G)": -65
  },
  {
    "time": "08:32:22",
    "00383 (5G)": -70
  },
  {
    "time": "08:32:52",
    "00383 (5G)": -67
  },
  {
    "time": "08:33:22",
    "00383 (5G)": -69
  },
  {
    "time": "08:33:52",
    "00383 (5G)": -64
  },
  {
    "time": "08:34:22",
    "00383 (5G)": -70
  },
  {
    "time": "08:34:52",
    "00383 (5G)": -70
  },
  {
    "time": "08:35:22",
    "00383 (5G)": -63
  },
  {
    "time": "08:35:52",
    "00383 (5G)": -64
  },
  {
    "time": "08:36:22",
    "00383 (5G)": -66
  },
  {
    "time": "08:36:52",
    "00383 (5G)": -63
  },
  {
    "time": "08:37:22",
    "00383 (5G)": -62
  },
  {
    "time": "08:37:52",
    "00383 (5G)": -61
  },
  {
    "time": "08:38:22",
    "00383 (5G)": -69
  },
  {
    "time": "08:38:52",
    "00383 (5G)": -73
  },
  {
    "time": "08:39:22",
    "00383 (5G)": -64
  },
  {
    "time": "08:39:52",
    "00383 (5G)": -79
  },
  {
    "time": "08:40:19",
    "0004A (5G)": -72
  },
  {
    "time": "08:40:22",
    "00383 (5G)": -79
  },
  {
    "time": "08:40:50",
    "0004A (5G)": -82
  },
  {
    "time": "08:40:52",
    "00383 (5G)": -79
  },
  {
    "time": "08:41:19",
    "0004A (5G)": -78
  },
  {
    "time": "08:41:22",
    "00383 (5G)": -79
  },
  {
    "time": "08:41:50",
    "0004A (2.4G)": -67
  },
  {
    "time": "08:41:52",
    "00383 (5G)": -79
  },
  {
    "time": "08:42:19",
    "0004A (2.4G)": -78
  },
  {
    "time": "08:42:22",
    "00383 (5G)": -79
  },
  {
    "time": "08:42:50",
    "0004A (2.4G)": -72
  },
  {
    "time": "08:42:52",
    "00383 (5G)": -79
  },
  {
    "time": "08:43:19",
    "0004A (2.4G)": -70
  },
  {
    "time": "08:43:22",
    "00383 (5G)": -79
  },
  {
    "time": "08:43:50",
    "0004A (5G)": -71
  },
  {
    "time": "08:43:52",
    "00383 (5G)": -79
  },
  {
    "time": "08:44:19",
    "0004A (2.4G)": -68
  },
  {
    "time": "08:44:22",
    "00383 (5G)": -79
  },
  {
    "time": "08:44:50",
    "0004A (2.4G)": -75
  },
  {
    "time": "08:44:52",
    "00383 (5G)": -79
  },
  {
    "time": "08:45:19",
    "0004A (2.4G)": -78
  },
  {
    "time": "08:45:22",
    "00383 (5G)": -79
  },
  {
    "time": "08:45:50",
    "0004A (2.4G)": -67
  },
  {
    "time": "08:45:52",
    "00383 (5G)": -79
  },
  {
    "time": "08:46:19",
    "0004A (2.4G)": -67
  },
  {
    "time": "08:46:22",
    "00383 (5G)": -79
  },
  {
    "time": "08:46:50",
    "0004A (5G)": -76
  },
  {
    "time": "08:46:52",
    "00383 (5G)": -79
  },
  {
    "time": "08:47:19",
    "0004A (5G)": -69
  },
  {
    "time": "08:47:22",
    "00383 (5G)": -79
  },
  {
    "time": "08:47:50",
    "0004A (5G)": -76
  },
  {
    "time": "08:47:52",
    "00383 (5G)": -79
  },
  {
    "time": "08:48:19",
    "0004A (2.4G)": -68
  },
  {
    "time": "08:48:22",
    "00383 (5G)": -79
  },
  {
    "time": "08:48:50",
    "0004A (2.4G)": -69
  },
  {
    "time": "08:48:52",
    "00383 (5G)": -79
  },
  {
    "time": "08:49:19",
    "0004A (2.4G)": -67
  },
  {
    "time": "08:49:49",
    "0004A (5G)": -68
  },
  {
    "time": "08:50:19",
    "0004A (5G)": -66
  },
  {
    "time": "08:50:50",
    "0004A (5G)": -84
  },
  {
    "time": "08:51:19",
    "0004A (2.4G)": -65
  },
  {
    "time": "08:51:50",
    "0004A (2.4G)": -66
  },
  {
    "time": "08:52:19",
    "0004A (5G)": -67
  },
  {
    "time": "08:52:50",
    "0004A (5G)": -75
  },
  {
    "time": "08:53:19",
    "0004A (5G)": -83
  },
  {
    "time": "08:53:50",
    "0004A (2.4G)": -69
  },
  {
    "time": "08:54:19",
    "0004A (2.4G)": -75
  },
  {
    "time": "08:54:50",
    "0004A (5G)": -76
  },
  {
    "time": "08:55:19",
    "0004A (2.4G)": -65
  },
  {
    "time": "08:55:50",
    "0004A (2.4G)": -67
  },
  {
    "time": "08:56:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "08:56:50",
    "0004A (2.4G)": -67
  },
  {
    "time": "08:57:19",
    "0004A (2.4G)": -73
  },
  {
    "time": "08:57:50",
    "0004A (2.4G)": -74
  },
  {
    "time": "08:58:19",
    "0004A (2.4G)": -74
  },
  {
    "time": "08:58:50",
    "0004A (2.4G)": -72
  },
  {
    "time": "08:59:19",
    "0004A (2.4G)": -75
  },
  {
    "time": "08:59:50",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:00:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:00:50",
    "0004A (2.4G)": -72
  },
  {
    "time": "09:01:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:01:50",
    "0004A (2.4G)": -70
  },
  {
    "time": "09:02:19",
    "0004A (2.4G)": -69
  },
  {
    "time": "09:02:49",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:03:19",
    "0004A (2.4G)": -70
  },
  {
    "time": "09:03:50",
    "0004A (2.4G)": -69
  },
  {
    "time": "09:04:19",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:04:50",
    "0004A (2.4G)": -72
  },
  {
    "time": "09:05:19",
    "0004A (2.4G)": -69
  },
  {
    "time": "09:05:49",
    "0004A (2.4G)": -71
  },
  {
    "time": "09:06:19",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:06:50",
    "0004A (2.4G)": -71
  },
  {
    "time": "09:07:19",
    "0004A (2.4G)": -70
  },
  {
    "time": "09:07:50",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:08:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:08:50",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:09:19",
    "0004A (2.4G)": -80
  },
  {
    "time": "09:09:50",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:10:19",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:10:50",
    "0004A (2.4G)": -71
  },
  {
    "time": "09:11:19",
    "0004A (2.4G)": -68
  },
  {
    "time": "09:11:50",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:12:19",
    "0004A (2.4G)": -72
  },
  {
    "time": "09:12:50",
    "0004A (2.4G)": -68
  },
  {
    "time": "09:13:19",
    "0004A (2.4G)": -58
  },
  {
    "time": "09:13:49",
    "0004A (2.4G)": -61
  },
  {
    "time": "09:14:19",
    "0004A (2.4G)": -64
  },
  {
    "time": "09:14:49",
    "0004A (2.4G)": -63
  },
  {
    "time": "09:15:19",
    "0004A (2.4G)": -63
  },
  {
    "time": "09:15:50",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:16:19",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:16:49",
    "0004A (2.4G)": -80
  },
  {
    "time": "09:17:19",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:17:50",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:18:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:18:50",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:19:19",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:19:50",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:20:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:20:50",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:21:19",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:21:50",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:22:19",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:22:50",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:23:19",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:23:50",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:24:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:24:50",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:25:19",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:25:50",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:26:19",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:26:50",
    "0004A (2.4G)": -83
  },
  {
    "time": "09:27:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:27:50",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:28:19",
    "0004A (2.4G)": -79
  },
  {
    "time": "09:28:50",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:29:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:29:50",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:30:19",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:30:50",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:31:19",
    "0004A (2.4G)": -83
  },
  {
    "time": "09:31:50",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:32:19",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:32:50",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:33:19",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:33:49",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:34:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:34:50",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:35:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:35:50",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:36:19",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:36:50",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:37:19",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:37:50",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:38:19",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:38:50",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:39:19",
    "0004A (2.4G)": -81
  },
  {
    "time": "09:39:50",
    "0004A (2.4G)": -79
  },
  {
    "time": "09:40:19",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:40:50",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:41:19",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:41:50",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:42:19",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:42:50",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:43:19",
    "0004A (2.4G)": -72
  },
  {
    "time": "09:43:49",
    "0004A (2.4G)": -71
  },
  {
    "time": "09:44:19",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:44:50",
    "0004A (2.4G)": -79
  },
  {
    "time": "09:45:19",
    "0004A (2.4G)": -81
  },
  {
    "time": "09:45:50",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:46:19",
    "0004A (2.4G)": -80
  },
  {
    "time": "09:46:50",
    "0004A (2.4G)": -83
  },
  {
    "time": "09:47:19",
    "0004A (2.4G)": -79
  },
  {
    "time": "09:47:49",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:48:19",
    "0004A (2.4G)": -70
  },
  {
    "time": "09:48:50",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:49:19",
    "0004A (2.4G)": -73
  },
  {
    "time": "09:49:50",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:50:19",
    "0004A (2.4G)": -77
  },
  {
    "time": "09:50:50",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:51:19",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:51:50",
    "0004A (2.4G)": -80
  },
  {
    "time": "09:52:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:52:50",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:53:19",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:53:50",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:54:19",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:54:50",
    "0004A (2.4G)": -73
  },
  {
    "time": "09:55:19",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:55:50",
    "0004A (2.4G)": -79
  },
  {
    "time": "09:56:19",
    "0004A (2.4G)": -74
  },
  {
    "time": "09:56:50",
    "0004A (2.4G)": -76
  },
  {
    "time": "09:57:19",
    "0004A (2.4G)": -75
  },
  {
    "time": "09:57:50",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:58:19",
    "0004A (2.4G)": -78
  },
  {
    "time": "09:58:50",
    "0004A (2.4G)": -72
  },
  {
    "time": "09:59:19",
    "0004A (2.4G)": -72
  },
  {
    "time": "09:59:50",
    "0004A (2.4G)": -74
  },
  {
    "time": "10:00:19",
    "0004A (2.4G)": -77
  },
  {
    "time": "10:00:50",
    "0004A (2.4G)": -80
  },
  {
    "time": "10:01:19",
    "0004A (2.4G)": -74
  },
  {
    "time": "10:01:50",
    "0004A (2.4G)": -78
  }
]

// 默认颜色配置
const defaultColors = {
  "0004A (2.4G)": "hsl(210, 70%, 80%)",
  "0004A (5G)": "hsl(210, 70%, 40%)",
  "00383 (2.4G)": "hsl(0, 70%, 80%)",
  "00383 (5G)": "hsl(0, 70%, 40%)"
};

export default function WifiSignalChart() {
  const [data, setData] = useState<DataPoint[]>(defaultData);
  const [colors, setColors] = useState<ColorMap>(defaultColors);
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.name.endsWith('.xlsx')) {
      alert('请上传 Excel 文件 (.xlsx)');
      return;
    }

    try {
      const { chartData, colorMapping } = await processExcelFile(file);
      setData(chartData);
      setColors(colorMapping);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error details:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : '未知错误';
      alert(`操作失败: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-4">
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          文件上传成功！
        </div>
      )}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          w-full max-w-7xl mx-auto p-8 border-2 border-dashed rounded-lg
          flex items-center justify-center
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          transition-colors duration-200
        `}
      >
        <p className="text-gray-500">
          将 Excel 文件拖放到此处进行数据更新
        </p>
      </div>

      <Card className="w-full max-w-7xl my-8">
        <CardHeader className="pb-2">
          <CardTitle>WiFi 信号强度分析</CardTitle>
          <CardDescription>
            显示终端在一段时间内的RSSI值、2G/5G 频段切换、设备切换
            （RSSI &gt -65dBm 信号良好）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[450px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time" 
                  label={{ value: '时间', position: 'insideBottom', offset: -10 }}
                />
                <YAxis 
                  domain={[-90, -20]}
                  label={{ 
                    value: '信号强度 (dBm)', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle' },
                    offset: 10
                  }}
                />
                <Tooltip />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <ReferenceLine 
                  y={-65} 
                  stroke="red" 
                  strokeDasharray="3 3"
                  label={{ 
                    value: "-65", 
                    position: 'right',
                    fill: 'red',
                    fontSize: 14
                  }}
                />
                {Object.keys(colors).map((key) => (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={colors[key]}
                    strokeWidth={2}
                    dot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
