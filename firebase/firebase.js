import app from 'firebase/compat/app';
import firebaseConfig from "./config";
import {getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signOut} from 'firebase/auth';
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

    //metodo para registrar
    async registrar(nombre, email, password) {
        console.log('Entra a registrar');
        const nuevoUsuario = await createUserWithEmailAndPassword(this.auth, email, password);

        return await updateProfile(nuevoUsuario.user, {
            displayName: nombre
        });
    }

    //metodo para iniciar sesion
    async login(email, password){
        return await signInWithEmailAndPassword(this.auth, email, password);
    }

    //cierra la sesion del usuario
    async cerrarSesion() {
        await signOut(this.auth);
    }
}

const firebase = new Firebase();
export default firebase;