import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';
import { Injectable } from '@nestjs/common';
// import { Readable } from 'stream';

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
          resolve(outputImagePath);
        })
        .on('error', (err) => {
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

  async convertGifToMp4(
    gifPath: string,
    outputPath: string,
  ): Promise<{
    message: string;
    filePath: string;
    size: number; // File size in bytes
    metadata: {
      format: string; // File format, e.g., 'mp4'
      duration: number; // Duration in seconds
      videoCodec: string | undefined; // Video codec, e.g., 'h264'
      audioCodec: string | undefined; // Audio codec, e.g., 'aac'
      resolution: {
        width: number | undefined; // Video width in pixels
        height: number | undefined; // Video height in pixels
      };
    };
  }> {
    return new Promise((resolve, reject) => {
      ffmpeg(gifPath)
        .output(outputPath)
        .on('end', () => {
          ffmpeg.ffprobe(outputPath, (err, metadata) => {
            if (err) {
              reject({ message: 'Error retrieving file metadata', error: err });
              return;
            }
            const fileStats = fs.statSync(outputPath);

            resolve({
              message: 'File converted successfully!',
              filePath: outputPath,
              size: fileStats.size, // File size in bytes
              metadata: {
                format: metadata.format.format_name,
                duration: metadata.format.duration,
                videoCodec: metadata.streams.find(
                  (s) => s.codec_type === 'video',
                )?.codec_name,
                audioCodec: metadata.streams.find(
                  (s) => s.codec_type === 'audio',
                )?.codec_name,
                resolution: {
                  width: metadata.streams.find((s) => s.codec_type === 'video')
                    ?.width,
                  height: metadata.streams.find((s) => s.codec_type === 'video')
                    ?.height,
                },
              },
            });
          });
        })
        .on('error', (err) => {
          console.error('Error during conversion:', err);
          reject(err);
        })
        .run();
    });
  }

  async watermarkAndConvertVideoToMp4(
    filePath: string,
    outputPath: string,
  ): Promise<{
    message: string;
    filePath: string;
    size: number; // File size in bytes
    metadata: {
      format: string; // File format, e.g., 'mp4'
      duration: number; // Duration in seconds
      videoCodec: string | undefined; // Video codec, e.g., 'h264'
      audioCodec: string | undefined; // Audio codec, e.g., 'aac'
      resolution: {
        width: number | undefined; // Video width in pixels
        height: number | undefined; // Video height in pixels
      };
    };
  }> {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(filePath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-vf', // Apply a video filter
          `drawtext=text='morabi.io':fontcolor=gray:fontsize=30:x=10:y=H-th-10`, // Text filter options
        ])
        .output(outputPath)
        .on('end', async () => {
          fs.unlink(filePath, () => {});
          ffmpeg.ffprobe(outputPath, (err, metadata) => {
            if (err) {
              reject({ message: 'Error retrieving file metadata', error: err });
              return;
            }
            const fileStats = fs.statSync(outputPath);
            resolve({
              message: 'File converted successfully!',
              filePath: outputPath,
              size: fileStats.size, // File size in bytes
              metadata: {
                format: metadata.format.format_name,
                duration: metadata.format.duration,
                videoCodec: metadata.streams.find(
                  (s) => s.codec_type === 'video',
                )?.codec_name,
                audioCodec: metadata.streams.find(
                  (s) => s.codec_type === 'audio',
                )?.codec_name,
                resolution: {
                  width: metadata.streams.find((s) => s.codec_type === 'video')
                    ?.width,
                  height: metadata.streams.find((s) => s.codec_type === 'video')
                    ?.height,
                },
              },
            });
          });
        })
        .on('error', (err) => {
          console.error('Error during conversion9898:', err);
          fs.unlink(filePath, () => {});
          reject(err);
        })
        .run();
    });
  }
}
