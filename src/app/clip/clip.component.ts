import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import videojs from 'video.js';
import { IClip } from '../models/clip.model';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers:[DatePipe]
})
export class ClipComponent implements OnInit{
  clip?:IClip;
  @ViewChild('videoPlayer', {static:true}) target?:ElementRef;
  player?:videojs.Player

  
  constructor(public route:ActivatedRoute) {}
  
  
  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);
    this.route.data.subscribe(data => {
      this.clip = data['clip'] as IClip;
      this.player?.src(this.clip?.url);
      this.player?.play();
    });
  }


  
}
