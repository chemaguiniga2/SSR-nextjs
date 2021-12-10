import Link from 'next/link';
import React from 'react';
import Buscar from '../ui/Buscar';
import Navegacion from './Navegacion';


const Header = () => {
    return (
        <header>
            <div>
                <div>
                    <p>P</p>

                    <Buscar />
                    <Navegacion />
                </div>
                <div>
                    <p>Hola</p>
                    <button type="button">Cerrar Sesion</button>

                    <Link href="/">Login</Link>
                    <Link href="/">Crear Cuenta</Link>
                </div>
            </div>
        </header>
    );
}
 
export default Header;