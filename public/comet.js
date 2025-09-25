document.addEventListener("DOMContentLoaded", () => {
    const canvas1 = document.getElementById("canvas1");
    const canvas2 = document.getElementById("canvas2");
  
    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");
  
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;
  
    const STAR_DENSITY = 5 * 10e7;
    const GRAVITATIONAL_CONSTANT = 6.6743e-11;
  
    let STAR_COUNT = Math.floor(window.innerWidth / 30);
    const MAX_STAR_RADIUS = 10;
    const MIN_STAR_RADIUS = 1;
    const MAX_STAR_VELOCITY = 1.25;
    const MIN_STAR_VELOCITY = -1.25;
    const COMET_SPEED = 2.5;
    const MAX_COMET_RADIUS = 4;
    const COMET_FRICTION = 0.995;
    let TAIL_LENGTH_FACTOR = 5;
    let TAIL_FALLOFF_SPEED = 0.3;
    let maxTailLength = 50;
  
    let stars = [];
    let bursts = [];
    let mouseX = 0;
    let mouseY = 0;
    let bigStar = null;
    let ENABLE_BIG_STAR = false;
    // Color controls
    let colorBaseHue = 200; // base hue near deepskyblue
    let colorHueVariance = 10; // small variance around base hue
    let colorSaturation = 100; // percent
    let colorLightness = 60; // percent
    // Mode + effects
    let crazyMode = false;
    let shockwaveSizeMultiplier = 1;
    let top = 0;
    const MAX_BURSTS = 24;
  
    function random(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    function randomLow(min, max, lambda = 5) {
      const u = Math.random();
      const randomValue = -Math.log(1 - u) / lambda;
      const scaledValue = Math.floor(randomValue * (max - min + 1));
      return Math.min(scaledValue, max - min) + min;
    }
  
    function distanceBetweenStars(star1, star2) {
      const dx = star2.x - star1.x;
      const dy = star2.y - star1.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    function mergeStars(star1, star2) {
      const totalMass = star1.radius ** 3 + star2.radius ** 3;
      const totalMomentumX = star1.vx * star1.radius ** 3 + star2.vx * star2.radius ** 3;
      const totalMomentumY = star1.vy * star1.radius ** 3 + star2.vy * star2.radius ** 3;
  
      const mergedRadius = Math.cbrt(totalMass);
  
      const largerStar = star1.radius >= star2.radius ? star1 : star2;
      const smallerStar = star1 === largerStar ? star2 : star1;
  
      star1.radius = mergedRadius;
      star1.vx = totalMomentumX / mergedRadius ** 3;
      star1.vy = totalMomentumY / mergedRadius ** 3;
      star1.x = largerStar.x;
      star1.y = largerStar.y;
  
      if (!star1.isBigStar && star1.radius >= MAX_STAR_RADIUS) {
        star1.radius = MAX_STAR_RADIUS;
      } else if (star1.isBigStar) {
        star1.radius = 15;
      }
  
      if (star1.radius >= MAX_STAR_RADIUS / 2) {
        star1.isFront = false;
      }
  
      stars = stars.filter(star => star !== smallerStar);
      // spawn some orange circles (simple sparks)
      const combinedRadius = star1.radius + star2.radius;
      spawnBursts(largerStar.x, largerStar.y, combinedRadius);
      addNewStar();
    }
  
    function addNewStar() {
      if (stars.length > STAR_COUNT) return;
  
      const side = Math.floor(Math.random() * 4);
      let x, y, vx, vy;
  
      switch (side) {
        case 0:
          x = random(0, canvas1.width);
          y = -20;
          vx = random(MIN_STAR_VELOCITY, MAX_STAR_VELOCITY);
          vy = random(0, MAX_STAR_VELOCITY);
          break;
        case 1:
          x = canvas1.width + 20;
          y = random(0, canvas1.height);
          vx = random(MIN_STAR_VELOCITY, 0);
          vy = random(MIN_STAR_VELOCITY, MAX_STAR_VELOCITY);
          break;
        case 2:
          x = random(0, canvas1.width);
          y = canvas1.height + 20;
          vx = random(MIN_STAR_VELOCITY, MAX_STAR_VELOCITY);
          vy = random(MIN_STAR_VELOCITY, 0);
          break;
        case 3:
          x = -20;
          y = random(0, canvas1.height);
          vx = random(0, MAX_STAR_VELOCITY);
          vy = random(MIN_STAR_VELOCITY, MAX_STAR_VELOCITY);
          break;
      }
  
      stars.push({
        x,
        y,
        radius: randomLow(MIN_STAR_RADIUS, MAX_STAR_RADIUS),
        vx,
        vy,
        tailLength: 0,
        isFront: random(0, 1) > 0.5,
        color: randomStarColor(),
      });
    }
  
    function createStars() {
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: random(0, canvas1.width),
          y: random(0, canvas1.height),
          radius: randomLow(MIN_STAR_RADIUS, MAX_STAR_RADIUS),
          vx: random(MIN_STAR_VELOCITY, MAX_STAR_VELOCITY),
          vy: random(MIN_STAR_VELOCITY, MAX_STAR_VELOCITY),
          isFront: random(0, 1) > 0.5,
          color: randomStarColor(),
        });
      }
  
      if (!('ontouchstart' in window) && ENABLE_BIG_STAR) {
        stars.push({
          x: canvas1.width / 2,
          y: canvas1.height / 2,
          radius: 15,
          vx: 0,
          vy: 0,
          tailLength: 0,
          isFront: false,
          isBigStar: true,
          color: randomStarColor(),
        });
      }
  
      if (ENABLE_BIG_STAR) {
        bigStar = stars[stars.length - 1];
      }
    }
  
    function drawStars() {
      ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  
      stars.forEach(star => {
        const ctx = star.isFront ? ctx2 : ctx1;
        ctx.beginPath();
        ctx.arc(star.x, star.y - top, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color || "deepskyblue";
        ctx.fill();
        ctx.closePath();
      });
      // draw simple orange spark circles
      bursts.forEach(b => {
        if (b.alpha <= 0) return;
        ctx1.beginPath();
        ctx1.arc(b.x, b.y - top, b.radius, 0, Math.PI * 2);
        ctx1.fillStyle = `rgba(255, 140, 0, ${b.alpha})`;
        ctx1.fill();
      });
    }
  
    function updateStars() {
      stars.forEach(star => {
        if (star.isBigStar && ENABLE_BIG_STAR) {
          star.x = mouseX;
          star.y = mouseY;
        } else {
          star.x += star.vx;
          star.y += star.vy;
  
          if (star.x < -100 || star.x > canvas1.width + 100 || star.y < -100 || star.y > canvas1.height + 100) {
            stars = stars.filter(s => s !== star);
            addNewStar();
          }
  
          const m1 = (4 / 3) * Math.PI * Math.pow(star.radius, 3) * STAR_DENSITY;
          stars.forEach(otherStar => {
            if (star !== otherStar) {
              const r = distanceBetweenStars(star, otherStar);
              const m2 = (4 / 3) * Math.PI * Math.pow(otherStar.radius, 3) * STAR_DENSITY;
              const F = (GRAVITATIONAL_CONSTANT * (m1 * m2)) / r ** 2;
              star.vx += (F * (otherStar.x - star.x)) / r / m1;
              star.vy += (F * (otherStar.y - star.y)) / r / m1;
            }
          });
        }
      });
  
      stars.forEach(star => {
        stars.forEach(otherStar => {
          if (star !== otherStar) {
            const r = distanceBetweenStars(star, otherStar);
            const combinedRadius = star.radius + otherStar.radius;
  
            if (r <= combinedRadius && !star.merging && !otherStar.merging) {
              mergeStars(star, otherStar);
              star.merging = true;
            }
          }
        });
      });
  
      stars.forEach(star => {
        star.merging = false;
        const speed = Math.sqrt(star.vx ** 2 + star.vy ** 2);
        star.speed = speed;
  
        if (speed > COMET_SPEED - 0.25) {
          star.vx *= COMET_FRICTION;
          star.vy *= COMET_FRICTION;
        }
  
        if (speed > COMET_SPEED * 5) {
          star.vx *= 0.7;
          star.vy *= 0.7;
        }
  
        if (speed > COMET_SPEED && star.radius <= MAX_COMET_RADIUS) {
          star.tailLength = speed * TAIL_LENGTH_FACTOR + 3;
        }
  
        if (star.tailLength >= TAIL_FALLOFF_SPEED) {
          const tailLength = star.tailLength;
          star.tailLength -= TAIL_FALLOFF_SPEED;
  
          const tailSpeed = star.speed || Math.sqrt(star.vx ** 2 + star.vy ** 2);
          const normalizedVx = star.vx / tailSpeed;
          const normalizedVy = star.vy / tailSpeed;
  
          const limitedTailLength = Math.min(tailLength, maxTailLength);
          const ctx = star.isFront ? ctx2 : ctx1;
          const gradient = ctx.createLinearGradient(
            star.x,
            star.y - top,
            star.x - limitedTailLength * normalizedVx,
            star.y - top - limitedTailLength * normalizedVy
          );
  
          gradient.addColorStop(0, "rgba(255, 255, 200, 1)");
          gradient.addColorStop(0.3, "rgba(255, 165, 0, 0.9)");
          gradient.addColorStop(0.7, "rgba(255, 69, 0, 0.4)");
          gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
  
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - top);
          ctx.lineTo(
            star.x - limitedTailLength * normalizedVx,
            star.y - top - limitedTailLength * normalizedVy
          );
          ctx.strokeStyle = gradient;
          ctx.lineWidth = star.radius * 2;
          ctx.lineCap = "round";
          ctx.stroke();
        }
      });
      // update bursts (fade out quickly)
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i];
        b.alpha -= 0.03;
        if (b.alpha <= 0) {
          bursts.splice(i, 1);
        }
      }
    }
  
    function animate() {
      drawStars();
      updateStars();
      requestAnimationFrame(animate);
    }
  
    function handleResize() {
      canvas1.width = window.innerWidth;
      canvas1.height = window.innerHeight;
      canvas2.width = window.innerWidth;
      canvas2.height = window.innerHeight;
    }
  
    function handleScroll() {
      top = window.scrollY || window.pageYOffset;
  
      canvas1.style.top = `${top}px`;
      canvas2.style.top = `${top}px`;
      
      if (top > 0 && bigStar && ENABLE_BIG_STAR) {
        bigStar.isBigStar = false;
        const interval = setInterval(() => {
          if (bigStar && bigStar.radius > 10) {
            bigStar.radius -= 0.1;
          } else {
            // delete bigStar;
            if (bigStar) {
              bigStar = null;
            }            
            clearInterval(interval);
          }
        }, 100);
      }
  
      if (top === 0 && ENABLE_BIG_STAR) { //&& !('ontouchstart' in window)) {
        const star = {
          x: canvas1.width / 2,
          y: canvas1.height / 2,
          radius: 15,
          vx: 0,
          vy: 0,
          tailLength: 0,
          isFront: false,
          isBigStar: true,
          color: randomStarColor(),
        };
  
        bigStar = star;
        stars.push(star);
      }
    }
  
    function randomStarColor() {
      if (crazyMode) {
        const hue = Math.floor(Math.random() * 360);
        const sat = 80 + Math.floor(Math.random() * 20);
        const light = 55 + Math.floor(Math.random() * 20);
        return `hsl(${hue}, ${sat}%, ${light}%)`;
      }
      const hue = colorBaseHue + (Math.random() * 2 - 1) * colorHueVariance;
      return `hsl(${hue.toFixed(1)}, ${colorSaturation}%, ${colorLightness}%)`;
    }

    // spawn some orange circles around a point, sized by input
    function spawnBursts(x, y, size) {
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        bursts.push({
          x: x + (Math.random() - 0.5) * size * 1.5,
          y: y + (Math.random() - 0.5) * size * 1.5,
          radius: Math.random() * (5 + size * 0.5),
          alpha: 0.7,
        });
      }
      if (bursts.length > MAX_BURSTS) {
        bursts.splice(0, bursts.length - MAX_BURSTS);
      }
    }

    // Expose simple controls for tweaking in console
    window.cometControls = {
      setColorBaseHue: (h) => { colorBaseHue = Number(h) || colorBaseHue; },
      setColorHueVariance: (v) => { colorHueVariance = Number(v) || colorHueVariance; },
      setColorSaturation: (s) => { colorSaturation = Number(s) || colorSaturation; },
      setColorLightness: (l) => { colorLightness = Number(l) || colorLightness; },
      setTailLengthFactor: (v) => { TAIL_LENGTH_FACTOR = Number(v) || TAIL_LENGTH_FACTOR; },
      setTailFalloff: (v) => { TAIL_FALLOFF_SPEED = Number(v) || TAIL_FALLOFF_SPEED; },
      setMaxTailLength: (v) => { maxTailLength = Number(v) || maxTailLength; },
    };

    // Toggle crazy mode from UI
    window.setCrazyMode = function(enabled) {
      crazyMode = !!enabled;
      ENABLE_BIG_STAR = crazyMode;
      shockwaveSizeMultiplier = crazyMode ? 2 : 1; // double shockwave size in crazy mode
      // Increase star count by 50% to produce more comets
      const baseCount = Math.floor(window.innerWidth / 30);
      STAR_COUNT = Math.floor(baseCount * (crazyMode ? 1.5 : 1));
      // Recolor immediately
      stars.forEach(s => { s.color = randomStarColor(); });
      // If increasing count, top up immediately
      while (stars.length < STAR_COUNT) {
        addNewStar();
      }
      // Manage big star
      if (crazyMode) {
        if (!bigStar) {
          const star = {
            x: canvas1.width / 2,
            y: canvas1.height / 2,
            radius: 15,
            vx: 0,
            vy: 0,
            tailLength: 0,
            isFront: false,
            isBigStar: true,
            color: randomStarColor(),
          };
          bigStar = star;
          stars.push(star);
        } else {
          bigStar.isBigStar = true;
        }
      } else if (bigStar) {
        bigStar.isBigStar = false;
      }
      // No UI-specific side effects here; handled in index.js
    };
  
    createStars();
    animate();
  
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    // UI init handled separately to keep this file focused on canvas effects
  });
  