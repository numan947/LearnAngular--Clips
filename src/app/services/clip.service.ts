import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, QuerySnapshot } from '@angular/fire/compat/firestore';
import { IClip } from '../models/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, combineLatest, map, of, switchMap } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
// AngularFirestore -> Communicates with Firestore, AngularFirestoreCollection -> Represents a collection of documents in a Firestore database. The AngularFirestoreCollection is generic, meaning that we can specify a type for the documents in the collection.

@Injectable({
  providedIn: 'root'
})
export class ClipService {
  public clipsCollection: AngularFirestoreCollection<IClip>;
  pageClips: IClip[] = [];

  constructor(
    private db: AngularFirestore,
    private auth: AngularFireAuth,
    private storage: AngularFireStorage
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
    const query = this.clipsCollection.ref.orderBy('timestamp', 'desc').limit(6);
    const {length} = this.pageClips;
    if
    const snapshot = await query.get();
    return snapshot.docs;
  }

}
