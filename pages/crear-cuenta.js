import styled from '@emotion/styled';
import Layout from '../components/layouts/Layout';
import React, {useState} from 'react';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import { css } from '@emotion/react';
import Router from 'next/router';

import firebase from '../firebase';

//validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';



const STATE_INICIAL = {
    nombre: '',
    email: '',
    password: ''
}



export default function CrearCuenta() {



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
  } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores;

  async function crearCuenta() {
    try {
        firebase.registrar(nombre, email, password);
        Router.push('/');
    } catch (error) {
        console.error('Hubo un error al crear usuario', error);
        guardarError(error.message);
    }
  }

  return (
    <div>
      <Layout>
        <>
            <h1
                css={css`
                    text-align: center;
                    margin-top: 5rem;
                `}
            >Crear Cuenta</h1>
            <Formulario
                onSubmit={handleSubmit}
            >
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
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder='Tu email'
                        name='email'
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>

                {errores.nombre && <Error>{errores.email}</Error>}

                <Campo>
                    <label htmlFor="password">password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder='Tu password'
                        name='password'
                        value={password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>

                {errores.nombre && <Error>{errores.password}</Error>}

                {error && <Error>{error}</Error>}

                <InputSubmit
                    type="submit"
                    value="Crear Cuenta"
                />
            </Formulario>
        </>
      </Layout>
    </div>
  )
}
