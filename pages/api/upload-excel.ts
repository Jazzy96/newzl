import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

// 禁用默认的 body 解析，因为我们要处理文件上传
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  const form = formidable({
    uploadDir: path.join(process.cwd(), 'uploads'),
    filename: () => 'wifi_data.xlsx',
  });

  // 确保上传目录存在
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir, { recursive: true });
  }

  try {
    // 解析文件
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    // 执行 Python 脚本
    exec('python3 scripts/excel.py', (error, stdout, stderr) => {
      if (error) {
        console.error(`执行错误: ${error}`);
        return res.status(500).json({ error: '处理文件时出错' });
      }
      if (stderr) {
        console.error(`脚本错误: ${stderr}`);
      }
      console.log(`Python脚本输出: ${stdout}`);
      
      // 修改：传递正确的文件路径给 Node.js 脚本
      const uploadedFilePath = path.join(process.cwd(), 'uploads', 'wifi_data.xlsx');
      exec(`node scripts/process-excel.js "${uploadedFilePath}"`, (jsError, jsStdout, jsStderr) => {
        if (jsError) {
          console.error(`JS执行错误: ${jsError}`);
          return res.status(500).json({ error: 'JS处理文件时出错' });
        }
        if (jsStderr) {
          console.error(`JS脚本错误: ${jsStderr}`);
        }
        console.log(`JS脚本输出: ${jsStdout}`);
        res.status(200).json({ message: '文件上传并处理成功' });
      });
    });

  } catch (error) {
    console.error('上传处理错误:', error);
    res.status(500).json({ error: '文件上传失败' });
  }
} 
