import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import dynamic from 'next/dynamic'
import styles from '../styles/Home.module.css'

export default function Home() {

  const DynamicComponentWithNoSSR = dynamic(
    () => import('../components/PlotCSR'),
    { ssr: false }
    )

    return (  
      <DynamicComponentWithNoSSR />
    );
}
