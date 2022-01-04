import styled from '@emotion/styled';
import Layout from '../components/layouts/Layout';
import React, {useState, useContext} from 'react';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';

import { FirebaseContext } from '../firebase';
import { collection, addDoc } from "firebase/firestore";

//validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';
import { storage } from '../firebase/config';



const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    //imagen: '',
    url: '',
    descripcion: ''
}



export default function NuevoProducto() {

  //state de las imagenes
  const [ nombreimagen, guardarNombre ] = useState('');
  const [ subiendo, guardarSubiendo ] = useState(false);
  const [ progreso, guardarProgreso ] = useState(0);
  const [ urlimagen, guardarUrlImagen ] = useState('');

  const Heading = styled.h1`
    color: red;
  `;

  const [error, guardarError] = useState(false);

  const {
    valores,
    errores,
    submitForm,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearCuenta);

  const { nombre, empresa, imagen, url, descripcion } = valores;

  //hook de routing para redireccionar 
  const router = useRouter();

  // context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);
  const {db} = firebase;

  async function crearCuenta() {

    //si el usuario no esta autenticado llevar a login
    if(!usuario) { 
      return router.push('/login');
    }

    //crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now()
    }

    //insertarlo a la base de datos
    const productos = await addDoc(collection(db, "productos"), (producto));
    
  }

  const handleUploadStart = () => {
      guardarProgreso(0);
      guardarSubiendo(true);
  }

  const handleProgress = progreso => guardarProgreso({ progreso });

  const handleUploadError = error => {
      guardarSubiendo(error);
      console.error(error);
  };

  const handleUploadSuccess = nombre => {
      guardarProgreso(100);
      guardarSubiendo(false);
      guardarNombre(nombre);
      storage
          .ref("productos")
          .child(nombre)
          .getDownloadURL()
          .then(url => {
            console.log(url);
            guardarUrlImagen(url);
          } );
  };

  return (
    <div>
      <Layout>
        <>
            <h1
                css={css`
                    text-align: center;
                    margin-top: 5rem;
                `}
            >Nuevo Producto</h1>
            <Formulario
                onSubmit={handleSubmit}
            >
              <fieldset>
                <legend>Información General</legend>
                <Campo>
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        placeholder='Tu nombre'
                        name='nombre'
                        value={nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>

                {errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                    <label htmlFor="empresa">Empresa</label>
                    <input
                        type="text"
                        id="empresa"
                        placeholder='Nombre de la empresa o compañia'
                        name='empresa'
                        value={empresa}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>

                {errores.empresa && <Error>{errores.empresa}</Error>}

                <Campo>
                    <label htmlFor="imagen">Imagen</label>
                    <FileUploader
                        accept="image/*"
                        id="imagen"
                        name='imagen'
                        randomizeFilename
                        storageRef={storage.ref("productos")}
                        onUploadStart={handleUploadStart}
                        onUploadError={handleUploadError}
                        onUploadSuccess={handleUploadSuccess}
                        onProgress={handleProgress}
                    />
                </Campo>

                {errores.imagen && <Error>{errores.imagen}</Error>}

                <Campo>
                    <label htmlFor="url">Url</label>
                    <input
                        type="url"
                        id="url"
                        placeholder='URL de tu producto'
                        name='url'
                        value={url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>

                {errores.url && <Error>{errores.url}</Error>}
              </fieldset>
              <fieldset>
                <legend>Sobre tu producto</legend>


                <Campo>
                    <label htmlFor="descripcion">Descripcion</label>
                    <textarea
                        id="descripcion"
                        name='descripcion'
                        value={descripcion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>

                {errores.descripcion && <Error>{errores.descripcion}</Error>}
              </fieldset>



              

                <InputSubmit
                    type="submit"
                    value="Crear Producto"
                />
            </Formulario>
        </>
      </Layout>
    </div>
  )
}
