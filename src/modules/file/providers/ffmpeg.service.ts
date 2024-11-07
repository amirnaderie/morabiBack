import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FFmpegService {
  async generatePoster(
    videoPath: string,
    timestamp: number,
    outputDir: string,
    outputName: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const outputImagePath = path.join(outputDir, `${outputName}.jpeg`);

      ffmpeg(videoPath)
        .on('end', () => {
          console.log('Screenshot taken successfully');
          resolve(outputImagePath);
        })
        .on('error', (err) => {
          console.error('Error taking screenshot:', err);
          reject(err);
        })
        .screenshots({
          timestamps: [timestamp], // Timestamp in seconds (e.g., 5 for 5th second)
          filename: `${outputName}.jpeg`, // The filename pattern
          folder: outputDir, // Output folder
          size: '640x360', // Image size (optional)
        });
    });
  }
}
