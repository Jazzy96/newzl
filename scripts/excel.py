# -*- coding: utf-8 -*-
import pandas as pd
from datetime import datetime, timedelta
import pytz
import subprocess

def convert_column_to_nz_time(input_file, output_file, column_index=5):
    """
    Convert timestamps and format columns in Excel file
    """
    # 读取 Excel 文件
    df = pd.read_excel(input_file)
    
    # 将第 5、6 列转换为数字格式
    df.iloc[:, 4] = pd.to_numeric(df.iloc[:, 4], errors='coerce')
    
    # 获取时间列名
    column_name = df.columns[column_index]
    
    # 创建时区对象
    china_tz = pytz.timezone('Asia/Shanghai')
    
    # 确保时间戳列是数值类型
    df[column_name] = df[column_name].astype('int64')
    
    # 转换纳秒时间戳为datetime
    df[column_name] = pd.to_datetime(df[column_name], unit='ns')
    
    # 设置时区并转换格式
    df[column_name] = (df[column_name]
                      .dt.tz_localize(china_tz)
                      .dt.strftime('%Y-%m-%d %H:%M'))
    
    # 打印几个样本检查格式
    print("转换后的时间格式样本：")
    print(df[column_name].head())
    
    # 保存到新的 Excel 文件
    df.to_excel(output_file, index=False)

# 使用示例
if __name__ == "__main__":
    input_file = "data/wifi_data.xlsx"
    output_file = "data/wifi_data_converted.xlsx"
    
    try:
        convert_column_to_nz_time(input_file, output_file)
        print("转换完成！新文件已保存为:", output_file)
        
        # 移除 Node.js 脚本调用，让 API 路由来处理
        # subprocess.run(['node', 'scripts/process-excel.js'])
    except Exception as e:
        print("转换过程中出现错误:", str(e))
