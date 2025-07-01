import React, { useState, useRef, useEffect } from 'react';
import slideshowstyles from './slideshowstyles.modules.css';

function Slide({ index, imageUrl, slideRef, onToggle, totalSlides }) {
  return (
    <div 
      ref={slideRef}
      className={`${slideshowstyles.mySlides} ${slideshowstyles.fade}`}
    >
      <div className={slideshowstyles.slideItemHeader}>
        <button 
          className={`${slideshowstyles.toggleButton}`}
          onClick={onToggle}
        >
          ☰
        </button>
        <span className={slideshowstyles.slideNumbertext}>
          {index + 1} / {totalSlides}
        </span>
      </div>
      <img 
        src={imageUrl} 
        style={{ 
          display: 'block', 
          marginLeft: 'auto', 
          marginRight: 'auto' 
        }}
        alt={`Slide ${index+1}`}
      />
    </div>
  );
}

function ListViewItem({ index, imageUrl, caption, totalSlides, onToggle, itemRef }) {
  return (
    <div className={slideshowstyles.listItem} ref={itemRef}>
      <div className={slideshowstyles.listItemHeader}>
        <button 
          className={slideshowstyles.toggleButton}
          onClick={() => onToggle(index)}
        >
          ⊞
        </button>
        <span className={slideshowstyles.listNumbertext}>
          {index + 1} / {totalSlides}
        </span>
      </div>
      <img 
        src={imageUrl} 
        style={{ 
          display: 'block', 
          marginLeft: 'auto', 
          marginRight: 'auto',
          maxWidth: '100%',
          height: 'auto'
        }} 
        alt={`Image ${index+1}`}
      />
      {caption && (
        <div className={slideshowstyles.listCaption}>
          {caption}
        </div>
      )}
    </div>
  );
}

function Caption({ caption, captionRef }) {
  if (caption) {
    return (
      <div ref={captionRef} className={slideshowstyles.slideCaption}>{caption}</div>
    );
  }
}

export default function Slideshow({ slides = [] }) {
  const playpauseRef = useRef(null);
  const slidecountRef = useRef(null);
  const listViewRef = useRef(null);
  const slideshowRef = useRef(null);

  const mySlideRefs = useRef([]);
  const dotRefs = useRef([]);
  const listItemRefs = useRef([]);
  const captionRefs = useRef([]);
  
  const [slideIndex, setSlideIndex] = useState(1);
  const [autoplay, setAutoPlay] = useState(true);
  const [isListView, setIsListView] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (autoplay && !isListView) {
      timeoutId = setTimeout(() => {
        setSlideIndex((prev) => prev + 1);
      }, 2000); 
    }
    return () => clearTimeout(timeoutId);
  }, [slideIndex, autoplay, isListView]);

  useEffect(() => {
    if (!isListView) {
      showSlides(slideIndex);
    }
  }, [slideIndex, isListView]);

  function togglePlay() {
    setAutoPlay((prev) => {
      const newState = !prev;
      if (playpauseRef.current) {
        playpauseRef.current.innerHTML = newState ? '⏸️Pause' : '▶️Play';
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
    const captionsRef = captionRefs.current;
    
    if (n > slidesRef.length) newIndex = 1;
    if (n < 1) newIndex = slidesRef.length;
    
    slidesRef.forEach((slide) => {
      if (slide) slide.style.display = 'none';
    });
    
    dots.forEach((dot) => {
      if (dot) dot.classList.remove(slideshowstyles.active);
    });

    captionsRef.forEach((caption) => {
      if (caption) caption.style.display = 'none';
    });
    
    if (slidesRef[newIndex - 1]) {
      slidesRef[newIndex - 1].style.display = 'block';
    }
    
    if (dots[newIndex - 1]) {
      dots[newIndex - 1].classList.add(slideshowstyles.active);
    }

    if (captionsRef[newIndex - 1]) {
      captionsRef[newIndex - 1].style.display = 'block';
    }
    
    if (slidecountRef.current) {
      slidecountRef.current.innerHTML = (newIndex) + ' / ' + slidesRef.length;
    }
    
    if (newIndex !== slideIndex) {
      setSlideIndex(newIndex);
    }
  }

  function toggleView() {
    const currentIndex = slideIndex;
    setIsListView(prev => {
      const newView = !prev;
      const slideshowElement = slideshowRef.current;

      // 뷰 전환 후 적절한 위치로 스크롤
      setTimeout(() => {
        if (newView) {
          // 슬라이드쇼에서 리스트뷰로 전환
          if (slideshowElement && listItemRefs.current[currentIndex - 1]) {
            const slideshowRect = slideshowElement.getBoundingClientRect();
            
            const targetElement = listItemRefs.current[currentIndex - 1];
            const targetRect = targetElement.getBoundingClientRect();
            const targetScrollTop = window.pageYOffset + targetRect.top;

            const finalScrollPosition = targetScrollTop - slideshowRect.top;
            
            window.scrollTo({ 
              top: finalScrollPosition, 
              behavior: 'smooth' 
            });
          }
        }
      }, 50);
      
      return newView;
    });
  }

  function toggleViewFromList(itemIndex) {
    // 스크롤 위치 계산
    const listItem = listItemRefs.current[itemIndex];
    if (listItem) {
      const itemRect = listItem.getBoundingClientRect();
      
      setSlideIndex(itemIndex + 1);
      setIsListView(false);
      
      // 슬라이드쇼로 전환 후 비슷한 스크롤 위치로 이동
      setTimeout(() => {
        if (slideshowRef.current) {
          const slideshowRect = slideshowRef.current.getBoundingClientRect();
          const targetScrollTop = window.pageYOffset + slideshowRect.top;

          const finalScrollPosition = targetScrollTop - itemRect.top;

          window.scrollTo({ 
            top: finalScrollPosition, 
            behavior: 'smooth' 
          });
        }
      }, 50);
    } else {
      setSlideIndex(itemIndex + 1);
      setIsListView(false);
    }
  }

  if (isListView) {
    return (
      <div ref={listViewRef}>
        {slides.map((slide, index) => (
          <ListViewItem
            key={index}
            index={index}
            imageUrl={slide.imageUrl}
            caption={slide.caption}
            totalSlides={slides.length}
            onToggle={toggleViewFromList}
            itemRef={(el) => (listItemRefs.current[index] = el)}
          />
        ))}
      </div>
    );
  }

  return (
    <div ref={slideshowRef} className={slideshowstyles.slideItem}>
      {slides.map((slide, index) => (
        <Slide 
          key={index} 
          index={index}
          imageUrl={slide.imageUrl}
          caption={slide.caption}
          totalSlides={slides.length}
          onToggle={toggleView}
          slideRef={(el) => (mySlideRefs.current[index] = el)}/>
      ))}

      <div 
        className={slideshowstyles.slideItemHeader} 
        style={{ 
          justifyContent: 'center', 
          padding: '5px' 
        }}
      >
        <div className={slideshowstyles.wrapper}>
          <a className={slideshowstyles.prev} onClick={() => (plusSlides(-1))}>❮</a>
          <span 
            ref={playpauseRef}
            className={slideshowstyles.playpause}
            onClick={togglePlay}
          >
            {autoplay ? '⏸️Pause' : '▶️Play'}
          </span>
          {slides.map((_, index) => (
            <span
              key={index}
              ref={(el) => (dotRefs.current[index] = el)}
              className={slideshowstyles.dot}
              onClick={() => currentSlide(index + 1)}
            ></span>
          ))}
          <span
            ref={slidecountRef}
            className={slideshowstyles.slidecount}
          >
          </span>
          <a className={slideshowstyles.next} onClick={() => (plusSlides(1))}>❯</a>
        </div>
      </div>

      {slides.map((slide, index) => (
        <Caption 
          key={index} 
          caption={slide.caption}
          captionRef={(el) => (captionRefs.current[index] = el)}/>
      ))}
    </div>
  );
}
