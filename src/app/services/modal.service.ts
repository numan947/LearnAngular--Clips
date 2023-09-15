import { visitAll } from '@angular/compiler';
import { Injectable } from '@angular/core';


interface IModal{
  id:string,
  visible:boolean
}




@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals:IModal[] = [];
  
  constructor() {}

  register(id:string)
  {
    this.modals.push({
      id:id,
      visible:false
    });
  }

  unregister(id:string)
  {
    this.modals = this.modals.filter(e=>e.id!==id);
  }

  isModalOpen(id:string):boolean{
    return Boolean(this.modals.find((e)=>{return e.id === id})?.visible);
  }
  toggleModal(id:string){
    const modal = this.modals.find((e)=>{return e.id === id});
    if(modal){
      modal.visible = !modal.visible;
    }
  }


}
