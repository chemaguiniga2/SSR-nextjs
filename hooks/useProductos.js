import React, { useState, useEffect, useContext } from 'react';
import { collection, getDocs, query } from "firebase/firestore";
import { FirebaseContext } from '../firebase';



const useProductos = orden => {

    const [productos, guardarProductos] = useState([]);
    //context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);
    const { db } = firebase;

    useEffect(() => {
        const querySnapshot = async () => {
        
            const res = await getDocs(collection(db, "productos"));
            const resultado = res.docs.map(doc => {
              return {
                id: doc.id,
                ...doc.data()
              }
            });
            guardarProductos(resultado);
    
          }
          querySnapshot();
    }, []);

    return { productos }

}

export default useProductos;