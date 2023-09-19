import { Injectable } from '@angular/core';
import { FFmpeg, createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {

  isReady: boolean = false;
  private ffmpeg:FFmpeg;


  constructor() {
    this.ffmpeg = createFFmpeg({log:true});
   }

   async init(){
    if(this.isReady)
      return;
    await this.ffmpeg.load();
    this.isReady = true;
   }

   async getScreenshots(file: File) {
    const data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data);


    const seconds = [1,2,3];
    const commands:string[] = [];

    seconds.forEach(second =>{
      commands.push(
          '-i', file.name, // Input 
          // Output options
          '-ss', `00:00:0${second}`, // Seek to 1 second 
          '-frames:v', '1', // Output one image
          '-filter:v','scale=510:-1', // Scale to 510px width, keep aspect ratio
          // Save the file to memory
          `output_${second}.png`
      );
    })

    await this.ffmpeg.run(...commands);

    const screenshots:string[] = [];

    seconds.forEach(second =>{
      const data = this.ffmpeg.FS('readFile', `output_${second}.png`);
      const screenshotBlob = new Blob(
        [data.buffer], 
        { type: 'image/png' }
        );
      const url = URL.createObjectURL(screenshotBlob);
      screenshots.push(url);
    });

    return screenshots;
  }
}
