import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IClip } from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  modalId = "editClip";

  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  clipId = new FormControl('', {
    nonNullable: true
  });

  title = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  editForm = new FormGroup({
    title: this.title,
    id: this.clipId
  });
  
  showAlert: boolean = false;
  alertColor: string = 'blue';
  alertMsg: string = 'Please wait while we update your clip!';
  inSubmission: boolean = false;

  async submit() {
    if(!this.activeClip)
      return;

    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait while we update your clip!';

    try{
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    }catch(error){
      console.log(error);
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'There was an error updating your clip!';
      return;
    }

    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);
    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg= 'Your clip was updated successfully!';
  }

  constructor(
    private modal: ModalService,
    private clipService: ClipService
    
    ) { }


  ngOnChanges(): void {
    if (!this.activeClip)
      return;
    
    this.showAlert = false;
    this.inSubmission = false;
    this.title.setValue(this.activeClip.title);
    this.clipId.setValue(this.activeClip.docId ?? '');
  }

  ngOnDestroy(): void {
    this.modal.unregister(this.modalId);
  }
  ngOnInit(): void {
    this.modal.register(this.modalId);
  }
}
