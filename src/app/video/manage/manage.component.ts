import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IClip } from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {
  
  videoOrder: string = '1'; // 1 = descending order, 2 = ascending order

  sort$: BehaviorSubject<string>;

  clips: IClip[] = [];
  activeClip: IClip | null = null;


  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject<string>(this.videoOrder);
  }


  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = (params['sort'] === '2' ? '2' : '1');
      this.sort$
    });

    this.clipService.getUserClips(this.sort$).subscribe((clips) => {
      this.clips = [];
      clips.forEach((clip) => {
        this.clips.push({
          ...clip.data(),
          docId: clip.id
        });
      });
    });
  }

  sort(event: Event) {
    const { value } = (event.target as HTMLSelectElement);
    console.log(value);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value
      }
    });
  }

  openModal($event: Event, clip: IClip) {
    $event.preventDefault();
    this.activeClip = clip;
    this.modal.toggleModal('editClip');
  }

  update($event: IClip) {
    if (!this.activeClip)
      return;
    const index = this.clips.findIndex((clip) => clip.docId === this.activeClip?.docId);
    this.clips[index] = $event;
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();
    $event.stopPropagation();

    this.clipService.deleteClip(clip);

    this.clips.forEach((element, index) => {
      if (element.docId === clip.docId)
        this.clips.splice(index, 1);
    });
  }

  copyToCliboard($event: Event, arg1: string|undefined) {
    console.log("copyToCliboard")
    $event.preventDefault();
    if(!arg1)
      return;
    const url = `${location.origin}/clip/${arg1}`
    navigator.clipboard.writeText(url);

    alert('Copied to clipboard');
  }

}
