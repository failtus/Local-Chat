import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';


import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: FirebaseListObservable<any[]>; // test it for fetch data from database
  displayName;
  loggedUserImg;

  constructor(public navCtrl: NavController, afDB: AngularFireDatabase, private afAuth: AngularFireAuth, private fb: Facebook, private platform: Platform) {
    this.items = afDB.list('/cuisines'); // test it for fetch data from database
    afAuth.authState.subscribe(user => {
      if (!user) {
        this.displayName = null;
        return;
      }
      this.displayName = user.displayName;
      this.loggedUserImg = user.photoURL;
    });
  }

  signInWithFacebook() {
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  }

  signOut() {
    this.afAuth.auth.signOut();
  }

}
