import React, { useEffect, useRef } from 'react';

const MovieCard = ({ movie: { imdbID, Year, Poster, Title, Type } }) => {
  const cardRef = useRef(null);
  const boundsRef = useRef(null); // Use ref to store the bounds

  const rotateToMouse = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const bounds = boundsRef.current; // Get the current bounds

    if (!bounds) return;

    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    // Apply 3D rotation effect
    cardRef.current.style.transform = `
      scale3d(1.07, 1.07, 1.07)
      rotate3d(
        ${center.y / 100},
        ${-center.x / 100},
        0,
        ${Math.log(distance) * 2}deg
      )
    `;

    // Apply glow effect based on mouse position
    cardRef.current.style.background = `
      radial-gradient(
        circle at ${center.x * 2 + bounds.width / 2}px ${center.y * 2 + bounds.height / 2}px,
         #baaead,
        
        rgba(0, 0, 0, 0.1)
      )
    `;
  };

  useEffect(() => {
    const card = cardRef.current;

    const handleMouseEnter = () => {
      // Set the bounds when the mouse enters the card
      boundsRef.current = card.getBoundingClientRect();
      document.addEventListener('mousemove', rotateToMouse);
    };

    const handleMouseLeave = () => {
      document.removeEventListener('mousemove', rotateToMouse);
      card.style.transform = ''; // Reset transform
      card.style.background = ''; // Reset background glow
    };

    if (card) {
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup listeners on unmount
    return () => {
      if (card) {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []); // Empty dependency array ensures it only runs on mount/unmount

  return (
    <div className="movie card" key={imdbID} ref={cardRef}>
      <div>
        <p>{Year}</p>
      </div>

      <div>
        <img
          src={Poster !== 'N/A' ? Poster : 'https://via.placeholder.com/400'}
          alt={Title}
        />
      </div>

      <div className="glow">
        <span>{Type}</span>
        <h3>{Title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
