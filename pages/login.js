import React from 'react'
import {getProviders,signIn} from 'next-auth/react'; 
function login({providers}) {
    return (
        <div className="flex flex-col justify-center items-center bg-black min-h-screen w-full">
            <h1 className='text-white text-3xl lg:6xl align-text-center mb-2'>
                Musify. Your One Stop Destination for Music.
            </h1>
           <img className ="w-48 mb-5 mt-10" src="https://links.papareact.com/9xl" alt="img"/>
           {Object.values(providers).map((provider)=>{
               return(
                   <div key={provider.name} className=''>
                       <button className='bg-[#18d860] p-5 rounded-full text-white' onClick={()=>signIn(provider.id,{callbackUrl:"/"})}>Log in with {provider.name}</button>
                   </div>
               );
           })}
        </div>
    )
}

export default login

export async function getServerSideProps(){
    const providers = await getProviders();
    return{
        props:{
            providers,
        }
    }
}