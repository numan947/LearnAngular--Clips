import { Component, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { combineLatest, last, switchMap, forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { v4 as uuid } from 'uuid';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { IClip } from 'src/app/models/clip.model';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {


  alertMsg: string = 'Please wait while we upload your clip!';
  showAlert: boolean = false;
  alertColor: string = 'blue';
  inSubmission: boolean = false;
  percentage: number = 0;
  showPercentage: boolean = false;
  task?: AngularFireUploadTask;
  screenshotTask?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot: string = '';

  isDragOver: boolean = false;
  file: File | null = null;
  nextStep: boolean = false;

  title = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  uploadForm = new FormGroup({
    title: this.title
  });

  user: firebase.User | null = null;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService

  ) {
    this.auth.user.subscribe(user => { this.user = user; });
    this.ffmpegService.init();
  }


  ngOnDestroy(): void {
    this.task?.cancel();
  }


  async storeFile($event: Event) {

    if (this.ffmpegService.isRunning)
      return;

    this.isDragOver = false;
    this.file = ($event as DragEvent).dataTransfer ?
      ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
      ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      this.file = null;
      this.nextStep = false;
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0];

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  async uploadFile() {
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait while we upload your clip!';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromUrl(this.selectedScreenshot);
    const screenshotPath = `screenshots/${clipFileName}.png`;

    this.task = this.storage.upload(clipPath, this.file);
    this.screenshotTask= this.storage.upload(screenshotPath, screenshotBlob);
    const clipRef = this.storage.ref(clipPath);
    const screenshotRef = this.storage.ref(screenshotPath);

    combineLatest([this.task.percentageChanges(), this.screenshotTask.percentageChanges()]).subscribe(e=>{
      if(e[0] && e[1]){
        this.percentage = (e[0] + e[1]) / 200;
      }
      else{
        return;
      }
    });

    forkJoin([this.task.snapshotChanges(), this.screenshotTask.snapshotChanges()]).pipe(
      switchMap(() => forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()]))
    ).subscribe({
      next: async (urls) => {
        const [clipUrl, screenshotUrl] = urls;
        const clip:IClip = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url: clipUrl,
          screenshotUrl: screenshotUrl,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          screenshotFileName: `${clipFileName}.png`
        };

        const clipDocRef = await this.clipService.createClip(clip);

        this.alertColor = 'green';
        this.alertMsg = 'Your clip has been uploaded!';
        this.inSubmission = true;
        this.showPercentage = false;

        setTimeout(() => {
          this.router.navigate(['/clip', clipDocRef.id]);
        }, 1000);
      },
      error: (error) => {
        this.uploadForm.enable();
        this.alertColor = 'red';
        this.alertMsg = 'There was an error uploading your clip!';
        this.inSubmission = false;
        this.showPercentage = false;
        console.log(error);
      }
    });
  }


  selectImage(si: string) {
    this.selectedScreenshot = si;
  }

}
