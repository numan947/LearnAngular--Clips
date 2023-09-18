import { Component, OnDestroy } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { v4 as uuid} from 'uuid';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy{

  alertMsg:string = 'Please wait while we upload your clip!';
  showAlert:boolean = false;
  alertColor:string = 'blue';
  inSubmission:boolean = false;
  percentage:number = 0;
  showPercentage:boolean = false;
  task?:AngularFireUploadTask;

  isDragOver:boolean = false;
  file:File | null = null;
  nextStep:boolean = false;

  title = new FormControl('', {
    nonNullable: true,
    validators:[
      Validators.required, 
      Validators.minLength(3)
    ]
  });

  uploadForm = new FormGroup({
    title: this.title
  });

  user:firebase.User | null = null;

  constructor(
    private storage:AngularFireStorage, 
    private auth:AngularFireAuth,
    private clipService:ClipService,
    private router:Router
    
    ) {
    auth.user.subscribe(user=>{this.user = user;})
  }
  
  
  ngOnDestroy(): void {
    this.task?.cancel();
  }


  storeFile($event: Event) {
    this.isDragOver = false;
    this.file =  ($event as DragEvent).dataTransfer ? 
                 ($event as DragEvent).dataTransfer?.files.item(0) ?? null : 
                 ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if(!this.file || this.file.type !== 'video/mp4') {
      this.file = null;
      this.nextStep = false; 
      return;
    }
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  uploadFile(){
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait while we upload your clip!';
    this.inSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    this.task.percentageChanges().subscribe((percentage) => {
      this.percentage = (percentage as number ?? 0)/100.0;
    });

    this.task.snapshotChanges().pipe(
      last(), 
      switchMap(()=>clipRef.getDownloadURL())
      ).subscribe({
      next: async (url) => {

        const clip = {
          uid:this.user?.uid as string,
          displayName:this.user?.displayName as string,
          title:this.title.value,
          fileName:`${clipFileName}.mp4`,
          url:url,
          timestamp:firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const clipDocRef = await this.clipService.createClip(clip);

        this.alertColor = 'green';
        this.alertMsg = 'Your clip has been uploaded!';
        this.inSubmission = true;
        this.showPercentage = false;

        setTimeout(()=>{
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

}
