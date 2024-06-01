document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const canvas = document.getElementById('binaryCanvas');
        const ctx = canvas.getContext('2d');

        function resizeCanvas() {
            const container = document.querySelector('.binary-background');
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const fontSize = 16;
        const columns = canvas.width / fontSize + 5*fontSize;
        const drops = Array.from({ length: columns }, () => Math.random() * canvas.height / fontSize);
        let walk = 0.02;
        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#02106b';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = Math.random() > 0.5 ? '0' : '1';
                const y = drops[i] * fontSize;
                const x = (i-5) * fontSize + y * walk;

                ctx.fillText(text, x, y);

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }


        setInterval(draw, 50);
    }, 1000);
});
