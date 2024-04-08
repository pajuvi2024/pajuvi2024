import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, DocumentReference } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UserI } from '../models/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';
import { filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  obtenerProductos() {
    throw new Error('Method not implemented.');
  }

  constructor(private firestore: AngularFirestore) { }


// para crear un  documento 
  crearDoc(){
    this.firestore.collection('Usuario')
  }


  createDoc(data: any, path: string, id: string){
    const collection = this.firestore.collection(path);
    return collection.doc(id).set(data);
  }

  getCollection(){
    console.log('Estoy por leer una coleccion')
    this.firestore.collection('Usuario').valueChanges().subscribe((res) =>{
      console.log('res ->', res)
    })
  }
  getDoc(path: string, id: string): Observable<UserI | null> {
    return this.firestore.collection(path).doc<UserI>(id).get().pipe(
      filter((snapshot: any): snapshot is DocumentSnapshot<UserI> => snapshot.exists),
      map((snapshot: DocumentSnapshot<UserI>) => {
        return { id: snapshot.id, ...snapshot.data() } as UserI;
      })
    );
  }
  
getDoc2(path: string, id: string){
  this.firestore.collection(path).doc(id).valueChanges()
}

updateDoc(docPath: string, data: any): Promise<void> {
  return this.firestore.doc(docPath).update(data);
}


buscarProductos(): Observable<any[]> {
  // Aquí reemplaza la ruta de la colección por la que tienes en tu base de datos
  return this.firestore.collection('/usuarios/').valueChanges();
}



}
