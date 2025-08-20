'use client';

import { useEffect, useRef } from 'react';

interface ConfettiProps {
  width: number;
  height: number;
}

export default function Confetti({ width, height }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || width === 0 || height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const particleCount = 150;
    const colors = [
      '#5865F2', // Discord blue
      '#FFFFFF',
      '#99AAB5',
      '#7289DA',
      '#2C2F33',
      '#EB459E', // Pink
      '#57F287', // Green
    ];

    class Particle {
      x: number;
      y: number;
      color: string;
      size: number;
      velocity: { x: number; y: number };
      gravity: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      shape: 'circle' | 'square' | 'triangle';

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height - height;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 10 + 5;
        this.velocity = {
          x: Math.random() * 6 - 3,
          y: Math.random() * 3 + 2,
        };
        this.gravity = 0.1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
        this.opacity = 1;
        this.shape = ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as
          | 'circle'
          | 'square'
          | 'triangle';
      }

      update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.rotation += this.rotationSpeed;

        if (this.y > height) {
          this.opacity -= 0.02;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        if (this.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (this.shape === 'square') {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else if (this.shape === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);

        // Remove particles that are no longer visible
        if (particle.opacity <= 0) {
          particles.splice(index, 1);
        }
      });

      // Add new particles if needed
      if (particles.length < particleCount / 2) {
        for (let i = 0; i < 5; i++) {
          particles.push(new Particle());
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height]);

  return (
    <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-10" />
  );
}
