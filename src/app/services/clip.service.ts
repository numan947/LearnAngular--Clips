import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { IClip } from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable, combineLatest, map, of, switchMap } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
// AngularFirestore -> Communicates with Firestore, AngularFirestoreCollection -> Represents a collection of documents in a Firestore database. The AngularFirestoreCollection is generic, meaning that we can specify a type for the documents in the collection.

@Injectable({
  providedIn: 'root'
})
export class ClipService implements Resolve<IClip|null>{
  public clipsCollection: AngularFirestoreCollection<IClip>;
  pageClips: IClip[] = [];
  pendingRequest: boolean = false;

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage,
    private router:Router
  ) {
    this.clipsCollection = db.collection<IClip>('clips');
  }


  createClip(data: IClip): Promise<DocumentReference<IClip>> {
    return this.clipsCollection.add(data);
  }

  getUserClips(sort$: BehaviorSubject<string>) {
    return combineLatest([
      this.auth.user, 
      sort$]).pipe(
      switchMap(values => {
        const [user, sort] = values;
        if (!user) {
          return of([]);
        }
        const query = this.clipsCollection.ref.where(
          'uid',
          '==',
          user.uid
        ).orderBy(
          'timestamp', 
          sort === '1' ? 'desc' : 'asc'
          );

        return query.get();
      }),
      map(snapshot => (snapshot as QuerySnapshot<IClip>).docs)
    );
  }

  updateClip(id: string, title: string) {
    return this.clipsCollection.doc(id).update({
      title
    });
  }

  async deleteClip(clip: IClip) {
    const clipRef = this.storage.ref(`clips/${clip.fileName}`);
    const screenshotRef = this.storage.ref(`screenshots/${clip.screenshotFileName}`);
    await clipRef.delete();
    await screenshotRef.delete();
    await this.clipsCollection.doc(clip.docId).delete();
  }


  async getClips(){
    if(this.pendingRequest){
      return;
    }
    this.pendingRequest = true;
    
    let query = this.clipsCollection.ref
                                    .orderBy('timestamp', 'desc')
                                    .limit(6);
    const { length } = this.pageClips;
    
    if(length){
      const lastDocId = this.pageClips[length - 1].docId;
      const lastDoc = await this.clipsCollection.doc(lastDocId)
                                                .get()
                                                .toPromise();
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    
    this.pendingRequest = false;
    
    snapshot.forEach(doc =>{
      this.pageClips.push({
        ...doc.data(),
        docId: doc.id
      } as IClip);
    });
    
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IClip|null| Observable<IClip|null> | Promise<IClip|null> {
    return this.clipsCollection.doc(route.params['id']).get().pipe(map(snapshot=>{
      const data = snapshot.data() as IClip;
      if(!data){
        this.router.navigate(['/']);
        return null;
      }
      return data as IClip;
    })); 
  }
}
