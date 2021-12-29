import app from 'firebase/compat/app';
import firebaseConfig from "./config";
import {getAuth, createUserWithEmailAndPassword, updateProfile} from 'firebase/auth';
import { initializeApp } from 'firebase/app';

class Firebase {
    constructor(){
        // if(!app.apps.length) {
        //     app.initializeApp(firebaseConfig);
        // }

        // this.auth = getAuth();
        initializeApp(firebaseConfig);
        this.auth = getAuth();
    }

    async registrar(nombre, email, password) {
        console.log('Entra a registrar');
        const nuevoUsuario = await createUserWithEmailAndPassword(this.auth, email, password);

        return await updateProfile(nuevoUsuario.user, {
            displayName: nombre
        });
    }
}

const firebase = new Firebase();
export default firebase;