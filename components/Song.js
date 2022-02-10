import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSpotify from "../hooks/useSpotify"

function Song({order,track}) {
    const [currentTrackId,setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying,setIsPlaying] = useRecoilState(isPlayingState);
    const spotifyApi = useSpotify();
    const playSong = () =>{
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris:[track.track.uri],
        })
    }
    function millisToMinutesAndSeconds(millis){
        const minutes = Math.floor(millis/60000);
        const seconds = ((millis%60000)/1000).toFixed(0);
        return seconds == 60?
        minutes + 1 + ":00"
        :minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
    }
    return (
        <div className="grid grid-cols-2 py-4 px-5 hover:bg-gray-900 cursor-pointer rounded-md" onDoubleClick={playSong}>
            <div className='flex items-center space-x-4 text-gray-500'>
                <p>{order+1}</p>
                <img src={track.track.album.images[0].url} className="h-16 w-16" alt=""/>
                <div>
                    <p className="w-36 lg:w-64 truncate text-white">{track.track.name}</p>
                    <p className="w-40">{track.track.artists[0].name}</p>
                </div>
            
            </div>
            <div className='flex items-center justify-between ml-auto md:ml-0 text-gray-500'>
                <p className="hidden md:inline w-30">{new Date(track.track.album.release_date).toLocaleDateString()}</p>
                <p className="hidden md:inline w-40 truncate">{track.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
            </div>

        </div>
    )
}

export default Song
