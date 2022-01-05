import styled from '@emotion/styled';
import Layout from '../components/layouts/Layout';
import React, {useEffect, useState, useContext} from 'react';
import { FirebaseContext } from '../firebase';
import { collection, getDocs, query } from "firebase/firestore";
import DetallesProducto from '../components/layouts/DetallesProducto';






export default function Home() {


  const [ productos, guardarProductos ] = useState([]);
  const { firebase } = useContext(FirebaseContext);
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



  return (
    <div>
      <Layout>
        <div className='listado-productos'>
          <div className='contenedor'>
            <ul className='bg-white'>
              {productos.map(producto => (
                <DetallesProducto
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}
