
import React, { useState } from 'react';
export default function CustomLikeButton() {
   
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div>
      <button onClick={handleLikeClick} className="text-2xl font-bold text-slate-700 ">  
        {isLiked ? '❤️ Liked' : '🤍 Like'}
      </button>
      
    </div>
  );
}
