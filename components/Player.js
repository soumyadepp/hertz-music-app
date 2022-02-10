import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, SwitchHorizontalIcon, VolumeOffIcon, VolumeUpIcon } from "@heroicons/react/outline";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useState,useEffect, useCallback } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify"

function Player() {
    const spotifyApi = useSpotify();
    const {data:session,status} = useSession();
    const [currentTrackId,setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying,setIsPlaying] = useRecoilState(isPlayingState);
    const [volume,setVolume] = useState(50);
    const songInfo = useSongInfo();
    const fetchCurrentSong = () =>{
        if(!songInfo){
            spotifyApi.getMyCurrentPlayingTrack().then(data=>{
                console.log("Now Playing : ", data.body?.item);
                setCurrentTrackId(data.body?.item?.id);
                spotifyApi.getMyCurrentPlaybackState().then((data)=>{
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }
    const handlePlayPause=()=>{
        spotifyApi.getMyCurrentPlayingTrack().then((data)=>{
            if(data.body.is_playing){
                spotifyApi.pause();
                setIsPlaying(false);
            }
            else{
                spotifyApi.play();
                setIsPlaying(true);
            }
        })
    }
    const adjustVolume = (volume) => {
        spotifyApi.setVolume(volume);
    }
    useEffect(() => {
        if(spotifyApi.getAccessToken() && !currentTrackId){
            fetchCurrentSong();
            setVolume(50);
        }
    }, [currentTrackIdState,spotifyApi,session])
    useEffect(()=>{
        if(volume > 0 && volume < 100){
            adjustVolume(volume);
        }
    },[volume]);
    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3">
            <div className="flex space-x-4 items-center">
               {songInfo?.album?.images&&<img className="hidden md:inline h-10 w-10" src ={songInfo?.album?.images?.[0]?.url} />}
             <div>
                <h3>{songInfo?.name}</h3>
                <p className="text-gray-500">{songInfo?.artists?.[0]?.name}</p>
            </div>
            </div>
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="w-6 h-6 cursor-pointer hover:scale-125 transition transform duration-100" onClick={()=>spotifyApi.setShuffle(true)}/>
                <RewindIcon className="w-6 h-6 cursor-pointer hover:scale-125 transition transform duration-100"/>
                {isPlaying&&<PauseIcon onClick={handlePlayPause} className="w-12 h-12 cursor-pointer hover:scale-125 transition transform duration-100"/>}
                {!isPlaying&&<PlayIcon onClick={handlePlayPause} className="w-12 h-12 cursor-pointer hover:scale-125 transition transform duration-100"/>}
                <FastForwardIcon className="w-6 h-6 cursor-pointer hover:scale-125 transition transform duration-100"/>
                <ReplyIcon className="w-6 h-6 cursor-pointer hover:scale-125 transition transform duration-100"/>
            </div>
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
               <VolumeOffIcon onClick={()=>volume > 0 ? setVolume(Number(volume - 10)) : setVolume(volume)} className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100"/>
                <input className="w-14 md:w-28"type="range" value={volume} onChange={e => setVolume(Number(e.target.value))} min={0} max={100}/>
                 <VolumeUpIcon onClick={()=>volume < 100 ? setVolume(Number(volume + 10)) : setVolume(volume)} className="w-5 h-5 cursor-pointer hover:scale-125 transition transform duration-100"/>
            </div>
        </div>
    )
}

export default Player
