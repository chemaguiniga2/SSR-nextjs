import { useRouter } from 'next/router';
import React, { useEffect, useContext, useState } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layouts/404';
import Layout from '../../components/layouts/Layout';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Campo, InputSubmit } from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';


const ContenedorProducto = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;




const Producto = () => {

    //state del componente
    const [ producto, guardarProducto ] = useState({});
    const [ error, guardarError ] = useState(false);
    const [ comentario, guardarComentario ] = useState({});
    const [ consultarDB, guardarConsultarDB ] = useState(true);

    //router para obtener el id inicial
    const router = useRouter();
    const { query: {id} } = router;

    //context de firebase
    const { firebase, usuario } = useContext(FirebaseContext);
    const { db } = firebase;

    useEffect(() => {
        if(id && consultarDB) {
            const obtenerProducto = async () => {
                const docRef = doc(db, 'productos', id);
                const docSnap = await getDoc(docRef);
                if( docSnap.exists() > 0 ) {
                    guardarProducto(docSnap.data());
                    guardarConsultarDB(false);
                } else {
                    guardarError(true);
                    guardarConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    }, [id]);

    if(Object.keys(producto).length === 0 && !error) return 'Cargando..';

    const { comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos, creador, haVotado } = producto;

    //administrar y validar los votos
    const votarProducto = async () => {
        if(!usuario) {
            return router.push('/login');
        }

        //obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;
        console.log(nuevoTotal);

        //verificar si el usuario actual ha votado ya
        if(haVotado.includes(usuario.uid)) return;

        //guardar el id del usuario que ha votado
        const nuevoHaVotado = [ ...haVotado, usuario.uid ];

        //actualizar en la BD
        await updateDoc(doc(db, "productos", id), { votos: nuevoTotal, haVotado: nuevoHaVotado });

        //actualizar el state
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        });

        guardarConsultarDB(true); //hay un voto por lo tanto consultar la bd
        
    }

    //funciones para crear comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    //identifica si el comentario es del creador del producto
    const esCreador = id => {
        if(creador.id) {
            return true;
        }
    }

    const agregarComentario = async e => {
        e.preventDefault();

        if(!usuario) {
            return router.push('/login');
        }

        //informacion extra al comentario
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //tomar copia de comentarios y agregar nuevos
        const nuevosComentarios = [...comentarios, comentario];

        //actualizar la BD
        await updateDoc(doc(db, "productos", id), { comentarios: nuevosComentarios });

        //actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        guardarConsultarDB(true); //hay un comentario por lo tanto consultar la bd
    }

    //funcion que revisa que el creador del producto sea el mismo que está autenticado
    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid) {
            return true;
        }
    }

    //elimina un producto de la bd
    const eliminarProducto = async () => {
        if(!usuario) {
            return router.push('/login');
        }
        if(creador.id !== usuario.uid) {
            return router.push('/');
        }
        try {
            await deleteDoc(doc(db, "productos", id));
            router.push('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <>
                {error ? <Error404 /> : (


                    <div className='contenedor'>
                        <h1
                            css={css`
                                text-align: center;
                                margin-top: 5rem;
                            `}
                        >{nombre}</h1>
                        <ContenedorProducto>
                            <div>
                                <p>Publicado hace: {formatDistanceToNow(new Date(creado), {locale: es})}</p>
                                <p>Publicado por: {creador.nombre} de {empresa}</p>
                                <img src={urlimagen} />
                                <p>{descripcion}</p>

                                { usuario && (
                                    <>
                                        <h2>Agrega tu comentario</h2>
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo>
                                                <input
                                                    type="text"
                                                    name='mensaje'
                                                    onChange={comentarioChange}
                                                />
                                            </Campo>
                                            <InputSubmit
                                            type="submit"
                                            value="Agregar Comentario" 
                                            />
                                        </form>
                                    </>

                                )}

                                <h2
                                    css={css`
                                        margin: 2rem 0;
                                    `}
                                >Comentarios</h2>
                                {comentarios.length === 0 ? "Aun no hay comentarios" : (
                                    <ul>
                                        {comentarios.map((comentario, i) => (
                                            <li
                                                key={`${comentario.usuarioId}-${i}`}
                                                css={css`
                                                    border: 1px solid #e1e1e1;
                                                    padding: 2rem;
                                                `}
                                            >
                                                <p>{comentario.mensaje}</p>
                                                <p>Escrito por:
                                                    <span
                                                        css={css`
                                                            font-weight: bold;
                                                        `}
                                                    >
                                                        {' '}{comentario.usuarioNombre}
                                                    </span>    
                                                </p>
                                                {esCreador(comentario.usuarioId) && 
                                                
                                                <CreadorProducto>Es Creador</CreadorProducto>}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <aside>
                                <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={url}
                                >
                                    Visitar URL
                                </Boton>
                            
                                <div
                                    css={css`
                                        margin-top: 5rem;
                                    `}
                                >
                                    <p css={css`text-align: center;`}>{votos} Votos</p>
                                    {usuario && (

                                    <Boton
                                        onClick={votarProducto}
                                    >
                                        Votar
                                    </Boton>

                                    )}
                                </div>

                            </aside>
                        </ContenedorProducto>
                        { puedeBorrar() &&
                            <Boton
                                onClick={eliminarProducto}
                            >Eliminar producto</Boton>
                        }
                    </div>
                )}
            </>
            
        </Layout>
    );
}
 
export default Producto;