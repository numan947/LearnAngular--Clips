import firebase from 'firebase/compat/app';

/**
 * @description: This is a data model for a clip. It is used in the upload component and the clip service. Also we use this for downloading clips from the database.
 * @param uid: string	- the uid of the user who uploaded the clip
 * @param title: string	- the title of the clip
 * @param displayName: string	- the display name of the user who uploaded the clip
 * @param fileName: string	- the file name of the clip
 * @param url: string	- the url of the clip
 * @param timestamp: firebase.firestore.FieldValue	- the timestamp of the clip
 */

export interface IClip{
	uid:string,
	title:string,
	displayName:string,
	fileName:string,
	url:string,
	timestamp:firebase.firestore.FieldValue,
	docId?:string,
	screenshotUrl:string,
	screenshotFileName:string
}