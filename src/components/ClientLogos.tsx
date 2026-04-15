import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ClientLogosProps {
  className?: string;
}

const ClientLogos: React.FC<ClientLogosProps> = ({ className = "" }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  // Liste des logos clients
  const clientLogos = [
    "https://orangedigitalcenter.sn/logoffodc.png",
    "https://media.licdn.com/dms/image/v2/D4D03AQECI7h6Nxg1jw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1703869945302?e=2147483647&v=beta&t=YMFOORDFd8RytsC-T3jXse_j7AAQM-AwY0mWzkGqMIc",
    "https://blueenergy.co.id/static/media/Logo.1e4f0f040501f2956eda.png",
    "https://newtech-rdc.net/images/logo.png",
  ];

  // Animation de défilement horizontal
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    let frame: number;
    let pos = 0;
    const speed = 0.8; // Vitesse de défilement (pixels par frame)
    let isPaused = false;
    let hoverTimeout: NodeJS.Timeout;

    const pauseOnHover = () => {
      isPaused = true;
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        isPaused = false;
      }, 1000);
    };

    const animate = () => {
      if (isPaused) {
        frame = requestAnimationFrame(animate);
        return;
      }

      pos += speed;
      if (pos >= el.scrollWidth / 2) {
        pos = 0;
      }
      el.scrollLeft = pos;
      frame = requestAnimationFrame(animate);
    };

    // Démarrer l'animation
    frame = requestAnimationFrame(animate);

    // Gestion du survol
    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(hoverTimeout);
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Dupliquer les logos pour un effet de défilement fluide
  const logos = [...clientLogos, ...clientLogos];

  return (
    <section className={`  ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8  sm:mx-4 lg:mx-8 xl:mx-16 2xl:mx-32">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            Our Clients
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 my-4 mx-auto"></div>
          <p className="text-gray-600 text-center">
            Companies that trust our services"
          </p>
        </div>

        <div
          ref={rowRef}
          className="overflow-hidden w-full py-6 cursor-grab active:cursor-grabbing"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",
          }}
        >
          <div className="flex gap-8 md:gap-12 w-max">
            {logos.map((src, i) => (
              <motion.div
                key={i}
                className="flex-shrink-0 flex items-center justify-center h-16 md:h-20 w-32 md:w-40"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img
                  src={src}
                  alt={`Client Logo ${i + 1}`}
                  className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;
