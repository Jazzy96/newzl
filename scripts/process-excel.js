const xlsx = require('xlsx');
const fs = require('fs/promises');

async function processExcel(filePath) {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    // 获取所有唯一的设备名
    const devicesSet = new Set();
    jsonData.forEach(row => {
      const deviceName = row.serial_no.slice(-5);
      devicesSet.add(deviceName);
    });

    // 生成设备颜色映射
    const colorMapping = {};
    const devices = Array.from(devicesSet);
    
    if (devices.length <= 2) {
      // 两个设备及以下使用固定的红蓝色
      devices.forEach((device, index) => {
        if (index === 0) {
          // 第一个设备使用蓝色
          colorMapping[`${device} (2.4G)`] = 'hsl(210, 70%, 80%)'; // 淡蓝色
          colorMapping[`${device} (5G)`] = 'hsl(210, 70%, 40%)';   // 深蓝色
        } else {
          // 第二个设备使用红色
          colorMapping[`${device} (2.4G)`] = 'hsl(0, 70%, 80%)';   // 淡红色
          colorMapping[`${device} (5G)`] = 'hsl(0, 70%, 40%)';     // 深红色
        }
      });
    } else {
      // 超过两个设备时使用动态颜色分配
      devices.forEach((device, index) => {
        const hue = index * (360 / devices.length);
        colorMapping[`${device} (2.4G)`] = `hsl(${hue}, 70%, 80%)`; // 淡色
        colorMapping[`${device} (5G)`] = `hsl(${hue}, 70%, 40%)`;   // 深色
      });
    }

    // 处理数据
    const processedData = jsonData.reduce((acc, row) => {
      try {
        const { serial_no, band, create_time, signal } = row;
        const deviceName = serial_no.slice(-5);
        const key = `${deviceName} (${band})`;
        
        // 转换 Excel 日期格式
        let timeStr;
        if (typeof create_time === 'number') {
          // Excel日期是从1900年1月1日开始的天数
          const excelDate = new Date((create_time - 25569) * 86400 * 1000);
          timeStr = excelDate.toISOString().replace('T', ' ').slice(0, 19);
        } else {
          timeStr = String(create_time || '');
        }
        
        if (!timeStr) {
          console.warn('Warning: Empty create_time found');
          return acc;
        }
        
        const [date, time] = timeStr.split(' ');
        
        if (!time) {
          console.warn('Warning: Invalid time format:', timeStr);
          return acc;
        }
        
        if (!acc[timeStr]) {
          acc[timeStr] = { 
            time: time,
            fullTime: timeStr
          };
        }
        
        if (acc[timeStr][key]) {
          const currentCount = acc[timeStr][`${key}_count`] || 1;
          const currentTotal = acc[timeStr][key] * currentCount;
          acc[timeStr][key] = Math.round((currentTotal + parseInt(signal)) / (currentCount + 1));
          acc[timeStr][`${key}_count`] = currentCount + 1;
        } else {
          acc[timeStr][key] = parseInt(signal);
          acc[timeStr][`${key}_count`] = 1;
        }
      } catch (error) {
        console.error('Error processing row:', error);
      }
      
      return acc;
    }, {});

    // 清理临时计数字段
    Object.values(processedData).forEach(entry => {
      Object.keys(entry).forEach(key => {
        if (key.endsWith('_count')) {
          delete entry[key];
        }
      });
    });

    // 修改排序逻辑，使用完整时间戳进行排序
    const chartData = Object.values(processedData).sort((a, b) => {
      const timeA = new Date(a.fullTime);
      const timeB = new Date(b.fullTime);
      return timeA - timeB;
    });

    // 在输出前删除 fullTime 字段
    chartData.forEach(entry => {
      delete entry.fullTime;
    });

    // 将颜色映射也写入到配置文件
    await fs.writeFile('deviceColors.json', JSON.stringify(colorMapping, null, 2));
    await fs.writeFile('processedData.json', JSON.stringify(chartData, null, 2));
    console.log('Data and color mapping processed and saved');
  } catch (error) {
    console.error('Error processing Excel file:', error);
  }
}

// 修改：从命令行参数获取文件路径
const filePath = process.argv[2] || 'data/wifi_data.xlsx';
processExcel(filePath);
