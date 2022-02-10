import { getSession } from 'next-auth/react'
import Head from 'next/head'
import { useRecoilState } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Center from '../components/Center'
import Player from '../components/Player'
import Sidebar from '../components/Sidebar'

export default function Home() {
  const [playlist,setPlaylist] = useRecoilState(playlistState);
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Hertz</title>
        <link rel="icon" href="/favicon.ico" />
       <link rel='preconnect' href='https://fonts.gstatic.com'/>
               <link
                  href='https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap'
                  rel='stylesheet'
               />
      </Head>
    <main className="flex" style={{fontFamily:''}}>
      <Sidebar/>
      <Center/>
    </main>
    {playlist&&<div className="sticky bottom-0">
      <Player/>
         </div>}
    </div>
  )
}

export async function getServerSideProps(context){
  const session = await getSession(context);
  return{
    props : {
      session,
    },
  };
}