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
  
    const STAR_COUNT = Math.floor(window.innerWidth / 30);
    const MAX_STAR_RADIUS = 10;
    const MIN_STAR_RADIUS = 1;
    const MAX_STAR_VELOCITY = 1.25;
    const MIN_STAR_VELOCITY = -1.25;
    const COMET_SPEED = 2.5;
    const MAX_COMET_RADIUS = 4;
    const COMET_FRICTION = 0.995;
    const TAIL_LENGTH_FACTOR = 5;
    const TAIL_FALLOFF_SPEED = 0.3;
    const maxTailLength = 50;
  
    let stars = [];
    let mouseX = 0;
    let mouseY = 0;
    let bigStar = null;
    let top = 0;
  
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
        });
      }
  
      if (!('ontouchstart' in window)) {
        stars.push({
          x: canvas1.width / 2,
          y: canvas1.height / 2,
          radius: 15,
          vx: 0,
          vy: 0,
          tailLength: 0,
          isFront: false,
          isBigStar: true,
        });
      }
  
      bigStar = stars[stars.length - 1];
    }
  
    function drawStars() {
      ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  
      stars.forEach(star => {
        const ctx = star.isFront ? ctx2 : ctx1;
        ctx.beginPath();
        ctx.arc(star.x, star.y - top, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = "deepskyblue"
        ctx.fill();
        ctx.closePath();
      });
    }
  
    function updateStars() {
      stars.forEach(star => {
        if (star.isBigStar) {
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
  
          const speed = Math.sqrt(star.vx ** 2 + star.vy ** 2);
          const normalizedVx = star.vx / speed;
          const normalizedVy = star.vy / speed;
  
          const limitedTailLength = Math.min(tailLength, maxTailLength);
          const ctx = star.isFront ? ctx2 : ctx1;
          const gradient = ctx.createLinearGradient(
            star.x,
            star.y - top,
            star.x - limitedTailLength * normalizedVx,
            star.y - top - limitedTailLength * normalizedVy
          );
  
          gradient.addColorStop(0, "rgba(255, 165, 0, 1)");
          gradient.addColorStop(0.5, "rgba(255, 69, 0, 0.8)");
          gradient.addColorStop(1, "rgba(255, 0, 0, 0)");
  
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - top);
          ctx.lineTo(
            star.x - limitedTailLength * normalizedVx,
            star.y - top - limitedTailLength * normalizedVy
          );
          ctx.strokeStyle = gradient;
          ctx.lineWidth = star.radius * 2;
          ctx.stroke();
        }
      });
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
      
      if (top > 0 && bigStar) {
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
  
      if (top === 0) { //&& !('ontouchstart' in window)) {
        const star = {
          x: canvas1.width / 2,
          y: canvas1.height / 2,
          radius: 15,
          vx: 0,
          vy: 0,
          tailLength: 0,
          isFront: false,
          isBigStar: true,
        };
  
        bigStar = star;
        stars.push(star);
      }
    }
  
    createStars();
    animate();
  
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
  });
  