import React, { useState, useRef, useEffect } from 'react';
import slideshowstyles from './slideshowstyles.modules.css';

function Slide({ index, imageUrl, caption, slideRef }) {
  return (
    <div 
      ref={slideRef}
      className={`${slideshowstyles.mySlides} ${slideshowstyles.fade}`}
    >
      <div className={slideshowstyles.numbertext}>{index + 1} / 3</div>
      <img src={imageUrl} style={{ width:'100%' }} alt={`Slide ${index+1}`}/>
      <div className={slideshowstyles.text}>{caption}</div>
    </div>
  );
}

export default function Slideshow({ slides = [] }) {
  const playpauseRef = useRef(null);
  const mySlideRefs = useRef([]);
  const dotRefs = useRef([]);

  const [slideIndex, setSlideIndex] = useState(1);
  const [autoplay, setAutoPlay] = useState(true);

  useEffect(() => {
    let timeoutId;
    if (autoplay) {
      timeoutId = setTimeout(() => {
        setSlideIndex((prev) => prev + 1);
      }, 2000); 
    }

    return () => clearTimeout(timeoutId);
  }, [slideIndex, autoplay]);

  useEffect(() => {
    showSlides(slideIndex);
  }, [slideIndex]);

  function togglePlay() {
    setAutoPlay((prev) => {
      const newState = !prev;
      if (playpauseRef.current) {
        playpauseRef.current.innerHTML = newState ? '⏸️' : '▶️';
      }
      return newState;
    });
  }

  function plusSlides(n) {
    setSlideIndex((prev) => prev + n);
  }

  function currentSlide(n) {
    setSlideIndex(n)
  }

  function showSlides(n) {
    let newIndex = n;
    const slidesRef = mySlideRefs.current;
    const dots = dotRefs.current;

    let i;
    // let slides = document.getElementsByClassName("mySlides");
    // let dots = document.getElementsByClassName("dot");
    
    if (n > slidesRef.length) newIndex = 1;
    if (n < 1) newIndex = slidesRef.length;

    slidesRef.forEach((slide) => {
      if (slide) slide.style.display = 'none';
    });

    dots.forEach((dot) => {
      if (dot) dot.className = dot.className.replace(' active', '');
    })

    if (slidesRef[newIndex - 1]) {
      slidesRef[newIndex - 1].style.display = 'block';
    }
    if (dots[newIndex - 1]) {
      dots[newIndex - 1].className += ' active';
    }

    if (newIndex !== slideIndex) {
      setSlideIndex(newIndex);
    }
  }
    
  return (
    <>
      <div className={slideshowstyles["slideshow-container"]}>
        {slides.map((slide, index) => (
          <Slide 
            key={index} 
            index={index}
            imageUrl={slide.imageUrl}
            caption={slide.caption}
            slideRef={(el) => (mySlideRefs.current[index] = el)}/>
        ))}

        <a className={slideshowstyles.prev} onClick={() => (plusSlides(-1))}>❮</a>
        <a className={slideshowstyles.next} onClick={() => (plusSlides(1))}>❯</a>
      </div>

      <br/>

      <div style={{textAlign:"center"}}>
        <span 
          ref={playpauseRef}
          className={slideshowstyles.playpause}
          onClick={togglePlay}
        >
          ⏸️
        </span>
        {slides.map((_, index) => (
          <span
            key={index}
            ref={(el) => (dotRefs.current[index] = el)}
            className={slideshowstyles.dot}
            onClick={() => currentSlide(index + 1)}
          ></span>
        ))}
      </div>
    </>
  );
}