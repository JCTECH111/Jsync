import React from "react";
import "./SoundWaveLoader.css"; // Custom CSS for animations

function SoundWaveLoader() {
  return (
    <div className="flex items-center justify-center space-x-1">
      <div className="bar bar1"></div>
      <div className="bar bar2"></div>
      <div className="bar bar3"></div>
      <div className="bar bar4"></div>
      <div className="bar bar5"></div>
    </div>
  );
}

export default SoundWaveLoader;
