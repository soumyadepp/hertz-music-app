import React, { useEffect,useState } from 'react'
import {HomeIcon,SearchIcon,LibraryIcon, HeartIcon, RssIcon, PlusCircleIcon} from '@heroicons/react/outline';
import {signIn, signOut, useSession} from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';
import { useRecoilRefresher_UNSTABLE, useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { playlistIdState } from '../atoms/playlistAtom';
function Sidebar() {
    const spotifyApi = useSpotify();
    const {data:session,status} = useSession();
    const [playlists,setPlaylists] = useState([]);
    const [playlistId,setPlaylistId] = useRecoilState(playlistIdState);
    const reset = useResetRecoilState(playlistIdState);
    useEffect(()=>{
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data)=>{
                setPlaylists(data.body.items);
            });
        }
    },[session,spotifyApi])

    console.log(session);
    console.log(`You picked playlist ${playlistId}`);
    return (
        <div className="text-gray-500 p-5 text-xs sm:max-w-[12rem] lg:max-w-[15rem] lg:text-sm border-r border-gray-900 overflow-y-scroll scrollbar-hide h-screen hidden md:inline-flex">
            <div className="space-y-4">
<button className="flex justify-center items-center space-x-2 hover:text-white" onClick={()=>window.location.reload()}>
            <HomeIcon className="h-5 w-5"/>
            <p>Home</p>
            </button>
            <button className="flex justify-center items-center space-x-2 hover:text-white">
            <LibraryIcon className="h-5 w-5"/>
            <p>Library</p>
            </button>
            <button className="flex justify-center items-center space-x-2 hover:text-white">
                <SearchIcon className="h-5 w-5"/>
                <p>Search</p>
            </button>
            <hr className='border-top-{0.1px} border-gray-900'/>
            <button className="flex justify-center items-center space-x-2 hover:text-white">
            <PlusCircleIcon  className="h-5 w-5"/>
            <p>Create Playlist</p>
            </button>
            <button className="flex justify-center items-center space-x-2 hover:text-white">
            <HeartIcon className="h-5 w-5 text-blue-600"/>
            <p>Liked Songs</p>
            </button>
            <button className="flex justify-center items-center space-x-2 hover:text-white">
                <RssIcon className="h-5 w-5"/>
                <p>Your Episodes</p>
            </button>
            <hr className='border-top-{0.1px} border-gray-900'/>
            {/*<Playlists/>*/}
           
            {playlists.map((playlist)=>{
                return(
                    <p key={playlist.id} onClick={()=>setPlaylistId(playlist.id)} className='cursor-pointer hover:text-white'>
                        {playlist.name}
                    </p>
                );
            })}
        
            </div>
        </div>
    )
}

export default Sidebar
