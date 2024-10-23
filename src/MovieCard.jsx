import React, { useEffect, useRef } from 'react';

const MovieCard = ({ movie: { imdbID, Year, Poster, Title, Type } }) => {
  const cardRef = useRef(null);
  let bounds;

  const rotateToMouse = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2,
    };
    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);

    // 3D rotation effect
    cardRef.current.style.transform = `
      scale3d(1.07, 1.07, 1.07)
      rotate3d(
        ${center.y / 100},
        ${-center.x / 100},
        0,
        ${Math.log(distance) * 2}deg
      )
    `;

    // Glow effect based on mouse position
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
    if (card) {
      const handleMouseEnter = () => {
        bounds = card.getBoundingClientRect();
        document.addEventListener('mousemove', rotateToMouse);
      };

      const handleMouseLeave = () => {
        document.removeEventListener('mousemove', rotateToMouse);
        card.style.transform = '';
        card.style.background = ''; // Reset background
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);

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
