import * as XLSX from 'xlsx';

interface ProcessedData {
  time: string;
  [key: string]: any;
}

export async function processExcelFile(file: File): Promise<{
  chartData: ProcessedData[];
  colorMapping: Record<string, string>;
}> {
  // 读取文件
  const data = await readFileAsArrayBuffer(file);
  const workbook = XLSX.read(data, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // 处理时区转换
  const processedJsonData = jsonData.map((row: any) => ({
    ...row,
    create_time: convertToLocalTime(row.create_time)
  }));

  // 获取唯一设备
  const devicesSet = new Set();
  processedJsonData.forEach((row: any) => {
    const deviceName = row.serial_no.slice(-5);
    devicesSet.add(deviceName);
  });

  // 生成颜色映射
  const colorMapping = generateColorMapping(Array.from(devicesSet));

  // 处理数据
  const processedData = processJsonData(processedJsonData);

  return {
    chartData: processedData,
    colorMapping
  };
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
    reader.onerror = (e) => reject(e);
    reader.readAsArrayBuffer(file);
  });
}

function convertToLocalTime(timestamp: number): string {
  if (typeof timestamp === 'number') {
    // 处理 Excel 时间戳
    const date = new Date((timestamp - 25569) * 86400 * 1000);
    return date.toISOString().replace('T', ' ').slice(0, 19);
  }
  return String(timestamp || '');
}

function generateColorMapping(devices: string[]): Record<string, string> {
  const colorMapping: Record<string, string> = {};
  
  if (devices.length <= 2) {
    devices.forEach((device, index) => {
      if (index === 0) {
        colorMapping[`${device} (2.4G)`] = 'hsl(210, 70%, 80%)';
        colorMapping[`${device} (5G)`] = 'hsl(210, 70%, 40%)';
      } else {
        colorMapping[`${device} (2.4G)`] = 'hsl(0, 70%, 80%)';
        colorMapping[`${device} (5G)`] = 'hsl(0, 70%, 40%)';
      }
    });
  } else {
    devices.forEach((device, index) => {
      const hue = index * (360 / devices.length);
      colorMapping[`${device} (2.4G)`] = `hsl(${hue}, 70%, 80%)`;
      colorMapping[`${device} (5G)`] = `hsl(${hue}, 70%, 40%)`;
    });
  }
  
  return colorMapping;
}

function processJsonData(jsonData: any[]): ProcessedData[] {
  const processed = jsonData.reduce((acc: Record<string, any>, row: any) => {
    try {
      const { serial_no, band, create_time, signal } = row;
      const deviceName = serial_no.slice(-5);
      const key = `${deviceName} (${band})`;
      
      if (!create_time) return acc;
      
      const [date, time] = create_time.split(' ');
      
      if (!time) return acc;
      
      if (!acc[create_time]) {
        acc[create_time] = { 
          time,
          fullTime: create_time
        };
      }
      
      if (acc[create_time][key]) {
        const currentCount = acc[create_time][`${key}_count`] || 1;
        const currentTotal = acc[create_time][key] * currentCount;
        acc[create_time][key] = Math.round((currentTotal + parseInt(signal)) / (currentCount + 1));
        acc[create_time][`${key}_count`] = currentCount + 1;
      } else {
        acc[create_time][key] = parseInt(signal);
        acc[create_time][`${key}_count`] = 1;
      }
    } catch (error) {
      console.error('Error processing row:', error);
    }
    return acc;
  }, {});

  // 清理并排序数据
  return Object.values(processed)
    .map(entry => {
      const newEntry = { ...entry };
      Object.keys(newEntry).forEach(key => {
        if (key.endsWith('_count')) delete newEntry[key];
      });
      delete newEntry.fullTime;
      return newEntry;
    })
    .sort((a: any, b: any) => {
      const timeA = new Date(a.fullTime || '');
      const timeB = new Date(b.fullTime || '');
      return timeA.getTime() - timeB.getTime();
    });
} 