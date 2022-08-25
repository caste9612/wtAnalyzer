import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import { CuvetteContext } from '../lib/context';
import { useContext, useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'

export default function Home() {

  const { cuvettes, setCuvettes } = useContext(CuvetteContext);

  const DynamicComponentWithNoSSR = dynamic(
    () => import('../components/PlotCSR'),
    { ssr: false }
    )

    return (  
      <div>
      <DynamicComponentWithNoSSR />
      cuvettes lenght: {cuvettes? cuvettes.length : cuvettes}
      </div>
    );
}
