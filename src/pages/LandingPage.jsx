import React, { useRef } from 'react'
import{ useGSAP } from '@gsap/react'
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useEffect } from 'react';

gsap.registerPlugin(useGSAP,ScrollTrigger)

const LandingPage = () => {
  const containerRef=useRef();
  const colRef =useRef(null);
  const textRef = useRef(null);

  useGSAP(()=>{
    gsap.to(colRef.current,{
    x:600,
    y:200,
    rotate:360,
    duration:2,
    scale: 1,
    
    });
     gsap.from(textRef.current,{
      opacity:0,
      scale:1,
      duration:1.5,
      scrollTrigger:{
        trigger:textRef.current,
        start:"top 50%",
        end:"top 10%",
        markers:true
      
      }
     })
  },)
  return (
    <div className='w-[100%] min-h-screen bg-white'>
      <div>
         <img ref={colRef}  src="https://static.vecteezy.com/system/resources/thumbnails/036/573/453/small_2x/a-can-of-coca-cola-drink-isolated-free-png.png"
       alt=""
      className='w-[20%]' />
      </div>
     <br />
   <p className='text-black text-5xl'>hello</p>
      </div>
    
  )
}

export default LandingPage
