import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import styled from '@emotion/styled';
import Layout from '../components/layouts/Layout';




export default function Populares() {

  const Heading = styled.h1`
    color: red;
  `;

  return (
    <div>
      <Layout>
        <Heading>Populares</Heading>
      </Layout>
    </div>
  )
}
