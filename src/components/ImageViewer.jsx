import { useState, useEffect, useRef } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
} from "react-icons/fa";

import img1 from "../assets/img1.png";
import img2 from "../assets/img2.png";
import img3 from "../assets/img3.png";
import img4 from "../assets/img4.png";
import img5 from "../assets/img5.png";

const imageList = [img1, img2, img3, img4, img5];

export default function ImageViewer() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const thumbsContainerRef = useRef(null);

  const goToNext = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex === imageList.length - 1) return 0;
      return prevIndex + 1;
    });
  };

  const goToPrevious = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex === 0) return imageList.length - 1;
      return prevIndex - 1;
    });
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "ArrowRight") goToNext();
      if (event.key === "ArrowLeft") goToPrevious();
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      goToNext();
    }, 3000);

    return () => clearInterval(timer);
  }, [autoPlay]);

  useEffect(() => {
    const container = thumbsContainerRef.current;

    if (container && container.children[activeIndex]) {
      container.children[activeIndex].scrollIntoView({
        behavior: "smooth",
        inline: "center",
      });
    }
  }, [activeIndex]);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="relative w-full max-w-5xl bg-black rounded-2xl shadow-2xl p-6">
        <img
          src={imageList[activeIndex]}
          alt="preview"
          className="w-full max-h-[500px] object-contain rounded-xl transition duration-300 hover:scale-105"
        />

        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full hover:bg-orange-500"
        >
          <FaChevronLeft />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full hover:bg-orange-500"
        >
          <FaChevronRight />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/60 px-4 py-2 rounded-full text-sm">
          <span>
            {activeIndex + 1} / {imageList.length}
          </span>

          <button onClick={() => setAutoPlay(!autoPlay)}>
            {autoPlay ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>

      <div
        ref={thumbsContainerRef}
        className="w-full max-w-5xl mt-6 overflow-x-auto"
      >
        <div className="flex gap-4">
          {imageList.map((image, index) => {
            const isActive = index === activeIndex;

            return (
              <img
                key={index}
                src={image}
                alt={`thumb-${index}`}
                onClick={() => setActiveIndex(index)}
                className={`w-32 h-20 object-cover rounded-lg cursor-pointer transition 
                  ${
                    isActive
                      ? "border-4 border-orange-500 scale-110"
                      : "opacity-60 hover:opacity-100"
                  }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}