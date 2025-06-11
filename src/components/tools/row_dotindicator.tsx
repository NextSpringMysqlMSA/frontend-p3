import { useState } from "react";
type imgpath = {
  imgpath: string[];}
const ImageCarousel = ({imgpath}:imgpath) => {
  const images = imgpath;

  const [current, setCurrent] = useState(0);

  return (
<div className="w-full h-full flex flex-col items-center relative overflow-hidden">
  <img
    src={images[current]}
    alt="Preview"
    className="h-80 aspect-video object-contain border rounded-md transition duration-300 ease-in-out"
  />

      {/* 인디케이터 (dots) */}
      <div className="flex mt-4 space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
                setCurrent(index)}}
            className={`w-3 h-3 rounded-full transition-colors duration-300  ${
              current === index 
                ? 'w-6 h-4 bg-customG border-customG'
                : 'w-4 h-4 bg-gray-300 border-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
