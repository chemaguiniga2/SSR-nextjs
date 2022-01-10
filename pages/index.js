import styled from '@emotion/styled';
import Layout from '../components/layouts/Layout';
import React from 'react';
import DetallesProducto from '../components/layouts/DetallesProducto';
import useProductos from '../hooks/useProductos';







export default function Home() {


  const { productos } = useProductos('votos');


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
