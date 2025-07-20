"use client";

import { useState, useEffect } from 'react';
import { 
  FaReact, 
  FaJs, 
  FaHtml5, 
  FaCss3Alt, 
  FaPython, 
  FaJava, 
  FaDatabase, 
  FaCode,
  FaGithub,
  FaTerminal,
  FaServer,
  FaCloud
} from 'react-icons/fa';
import { SiTypescript, SiNextdotjs, SiTailwindcss, SiNodedotjs } from 'react-icons/si';

const icons = [
  { icon: FaReact, color: '#61DAFB', size: 24 },
  { icon: FaJs, color: '#F7DF1E', size: 24 },
  { icon: FaHtml5, color: '#E34F26', size: 24 },
  { icon: FaCss3Alt, color: '#1572B6', size: 24 },
  { icon: FaPython, color: '#3776AB', size: 24 },
  { icon: FaJava, color: '#ED8B00', size: 24 },
  { icon: FaDatabase, color: '#336791', size: 24 },
  { icon: FaCode, color: '#007ACC', size: 24 },
  { icon: FaGithub, color: '#181717', size: 24 },
  { icon: FaTerminal, color: '#4A90E2', size: 24 },
  { icon: FaServer, color: '#00D4AA', size: 24 },
  { icon: FaCloud, color: '#FF6B35', size: 24 },
  { icon: SiTypescript, color: '#3178C6', size: 24 },
  { icon: SiNextdotjs, color: '#000000', size: 24 },
  { icon: SiTailwindcss, color: '#06B6D4', size: 24 },
  { icon: SiNodedotjs, color: '#339933', size: 24 },
];

interface IconPosition {
  left: number;
  top: number;
  delay: number;
  duration: number;
}

export function AnimatedBackground() {
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Generate random positions only on client side
    const positions = icons.map((_, index) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: index * 2,
      duration: 15 + Math.random() * 10,
    }));
    
    setIconPositions(positions);
  }, []);

  if (!isClient) {
    return null; // Don't render anything on server side
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((iconData, index) => {
        const IconComponent = iconData.icon;
        const position = iconPositions[index];
        
        if (!position) return null;
        
        return (
          <div
            key={index}
            className="absolute animate-float"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
              animationDelay: `${position.delay}s`,
              animationDuration: `${position.duration}s`,
              opacity: 0.1,
            }}
          >
            <IconComponent 
              size={iconData.size} 
              color={iconData.color}
              className="drop-shadow-lg"
            />
          </div>
        );
      })}
    </div>
  );
} 