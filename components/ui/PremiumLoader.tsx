"use client";

export default function PremiumLoader({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={`spinner-container ${className}`}>
      <div className="orbit"></div>
      <div className="orbit"></div>
      <div className="orbit"></div>
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      <div className="particle particle-4"></div>
      <div className="core"></div>

      <style jsx>{`
        .spinner-container {
          position: relative;
          width: 200px;
          height: 200px;
          animation: rotate 10s linear infinite;
        }

        .orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 180px;
          height: 180px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.1);
          animation: pulse 2s ease-in-out infinite;
        }

        .orbit:nth-child(1) {
          width: 180px;
          height: 180px;
        }

        .orbit:nth-child(2) {
          width: 140px;
          height: 140px;
          animation-delay: 0.3s;
        }

        .orbit:nth-child(3) {
          width: 100px;
          height: 100px;
          animation-delay: 0.6s;
        }

        .particle {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          box-shadow: 0 0 40px currentColor;
        }

        .particle-1 {
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background: pink;
          color: pink;
          animation: orbit1 3s linear infinite;
        }

        .particle-2 {
          top: 50%;
          right: 0;
          transform: translateY(-50%);
          background: lightblue;
          color: lightblue;
          animation: orbit2 2.5s linear infinite;
        }

        .particle-3 {
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background: lightgreen;
          color: lightgreen;
          animation: orbit3 3.5s linear infinite;
        }

        .particle-4 {
          top: 50%;
          left: 0;
          transform: translateY(-50%);
          background: orange;
          color: orange;
          animation: orbit4 2.8s linear infinite;
        }

        .core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background: wheat;
          border-radius: 50%;
          box-shadow:
            0 0 30px rgba(255, 255, 255, 0.5),
            inset 0 0 20px rgba(255, 255, 255, 0.3);
          animation: coreGlow 2s ease-in-out infinite alternate;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.6;
          }
        }

        @keyframes orbit1 {
          from {
            transform: translateX(-50%) rotate(0deg) translateX(90px)
              rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg) translateX(90px)
              rotate(-360deg);
          }
        }

        @keyframes orbit2 {
          from {
            transform: translateY(-50%) rotate(0deg) translateX(70px)
              rotate(0deg);
          }
          to {
            transform: translateY(-50%) rotate(360deg) translateX(70px)
              rotate(-360deg);
          }
        }

        @keyframes orbit3 {
          from {
            transform: translateX(-50%) rotate(0deg) translateX(50px)
              rotate(0deg);
          }
          to {
            transform: translateX(-50%) rotate(360deg) translateX(50px)
              rotate(-360deg);
          }
        }

        @keyframes orbit4 {
          from {
            transform: translateY(-50%) rotate(0deg) translateX(70px)
              rotate(0deg);
          }
          to {
            transform: translateY(-50%) rotate(360deg) translateX(70px)
              rotate(-360deg);
          }
        }

        @keyframes coreGlow {
          0% {
            box-shadow:
              0 0 30px rgba(255, 255, 255, 0.5),
              inset 0 0 20px rgba(255, 255, 255, 0.3);
          }
          100% {
            box-shadow:
              0 0 60px rgba(255, 255, 255, 0.8),
              inset 0 0 30px rgba(255, 255, 255, 0.6);
          }
        }
      `}</style>
    </div>
  );
}
