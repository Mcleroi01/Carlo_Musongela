import React, { useEffect, useState } from "react";

export function MouseFollower() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      animationFrameId = requestAnimationFrame(() => {
        setMousePosition({ x: clientX, y: clientY });
      });

      setIsMoving(true);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMoving(false);
      }, 100);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {/* Main cursor dot */}
      <div
        className="pointer-events-none fixed w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-teal-400 shadow-lg shadow-purple-500/50 mix-blend-screen transition-opacity duration-300 z-40"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          opacity: isMoving ? 1 : 0.5,
        }}
      />

      {/* Outer glow ring */}
      <div
        className="pointer-events-none fixed w-8 h-8 rounded-full border-2 border-purple-400/30 mix-blend-screen transition-all duration-200 z-40"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          opacity: isMoving ? 0.6 : 0.2,
        }}
      />

      {/* Large blur effect */}
      <div
        className="pointer-events-none fixed w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-teal-500/20 blur-2xl mix-blend-screen transition-all duration-300 z-30"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          opacity: isMoving ? 0.4 : 0.1,
        }}
      />

      {/* Hide default cursor */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
