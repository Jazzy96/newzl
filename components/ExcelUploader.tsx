import { processExcelFile } from '../utils/excelProcessor';

export function ExcelUploader() {
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { chartData, colorMapping } = await processExcelFile(file);
      // 使用处理后的数据更新你的图表
      console.log('处理完成', { chartData, colorMapping });
    } catch (error) {
      console.error('处理文件时出错:', error);
    }
  };

  return (
    <input
      type="file"
      accept=".xlsx,.xls"
      onChange={handleFileUpload}
    />
  );
} 