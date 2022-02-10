import { ChevronDownIcon } from '@heroicons/react/outline';
import { useSession } from 'next-auth/react'
import React, { useEffect,useState } from 'react'
import {shuffle} from 'lodash';
import { useRecoilState, useRecoilValue } from 'recoil';
import {playlistIdState, playlistState } from '../atoms/playlistAtom';
import Spotify from 'next-auth/providers/spotify';
import useSpotify from '../hooks/useSpotify';
import Songs from './Songs';
import { signOut } from 'next-auth/react';
import { isPlayingState } from '../atoms/songAtom';
const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
]
function Center() {
    const {data:session} = useSession();
    const [color,setColor] = useState(null);
    const spotifyApi = useSpotify();
    const [headerColor,setHeaderColor] = useState('transparent');
    const playlistId = useRecoilValue(playlistIdState);
    const  [playlist,setPlaylist] = useRecoilState(playlistState);
    const [isPlaying,setIsPlaying] = useRecoilState(isPlayingState);
    useEffect(()=>{
        setColor(shuffle(colors).pop());
        if(spotifyApi.getAccessToken()){
              spotifyApi.getPlaylist(playlistId).then((data)=>{
            setPlaylist(data.body);
        }).catch((err)=>{console.log('something went wrong')})
        }
    },[spotifyApi,playlistId])
    const logOut =()=>{
        if(isPlaying == true){
            setIsPlaying(false);
            spotifyApi.pause();
        }
        signOut();
    }
    return (
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
           <header className='absolute top-5 right-8'>
               <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2 font-bold text-white" onClick={()=>signOut()}>
                   {session?.user.image&&<img className="rounded-full w-10 h-10" src={session?.user.image} alt="" onClick={logOut}/>}
                   {!session?.user.image && <img className='rounded-full w-10 h-10' src ="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" alt=""/>}
               <h2 className="text-sm">{session?.user.name}</h2>
               <ChevronDownIcon className='h-5 w-5'/>
               </div>
           </header>
           <section className={`flex items-center  space-x-7 bg-gradient-to-b ${color} h-80 text-white to-black p-8 w-full`}>
               {playlist&&<div className='flex item-center space-x-7'><img
               className ="object-cover h-48 w-48 shadow-2xl ml-10" 
               src = {playlist?.images?.[0]?.url} alt=""/>
               <div className='flex-col items-center'>
                   <p>PLAYLIST</p>
                   <h1 className='text-7xl font-bold text-white'>{playlist.name.toUpperCase()}</h1>
                   <h1 className='text-md text-gray-300 mt-2'>{playlist.description}</h1>
               </div>
               </div>}
           </section>
           <div>
               <Songs/>
           </div>
        </div>
    )
}

export default Center
