import React, { useState, useEffect } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WifiSignalChart() {
  const [data, setData] = useState([]);
  const [colors, setColors] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // 获取数据和颜色配置
    Promise.all([
      fetch('/api/wifi-data'),
      fetch('/api/device-colors')
    ])
      .then(([dataRes, colorsRes]) => Promise.all([
        dataRes.json(), 
        colorsRes.json()
      ]))
      .then(([data, colors]) => {
        setData(data);
        setColors(colors);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

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

    const renamedFile = new File(
      [file],
      'wifi_data.xlsx',
      { type: file.type }
    );

    const formData = new FormData();
    formData.append('file', renamedFile);

    try {
      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`上传失败: ${response.status} ${errorText}`);
      }

      // 重新获取数据和颜色配置
      const [newDataRes, newColorsRes] = await Promise.all([
        fetch('/api/wifi-data'),
        fetch('/api/device-colors')
      ]);

      if (!newDataRes.ok || !newColorsRes.ok) {
        throw new Error('获取新数据失败');
      }

      const [newData, newColors] = await Promise.all([
        newDataRes.json(),
        newColorsRes.json()
      ]);

      setData(newData);
      setColors(newColors);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error details:', error);
      alert(`文件上传失败: ${error.message}`);
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
            （RSSI > -65dBm 信号良好）
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
                  domain={[-90, -75]}
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