import styled from '@emotion/styled';
import Layout from '../components/layouts/Layout';
import { useRouter } from 'next/router';
import DetallesProducto from '../components/layouts/DetallesProducto';
import useProductos from '../hooks/useProductos';
import React, { useEffect, useState } from 'react';






export default function Buscar() {

  const Heading = styled.h1`
    color: red;
  `;

  const router = useRouter();
  const {query: {q}} = router;

  //todos los productos
  const { productos } = useProductos('creado');
  const [ resultado, guardarResultado ] = useState([]);

  useEffect(() => {
    const busqueda = q.toLowerCase();
    const filtro = productos.filter(producto => {
      return (
       producto.nombre.toLowerCase().includes(busqueda)||
       producto.descripcion.toLowerCase().includes(busqueda)
      )
    })

    guardarResultado(filtro);


  }, [q, productos]);

  return (
    <div>
      <Layout>
        <div className='listado-productos'>
          <div className='contenedor'>
            <ul className='bg-white'>
              {resultado.map(producto => (
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
