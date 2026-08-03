// --- Theme Logic ---
const themeToggleBtn = document.getElementById('theme-toggle');
const rootTheme = document.documentElement;

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    rootTheme.classList.add('dark');
} else {
    rootTheme.classList.remove('dark');
}

themeToggleBtn?.addEventListener('click', () => { 
    rootTheme.classList.toggle('dark'); 
    if (rootTheme.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// --- Navigation & ScrollSpy ---
const nav = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    // Navbar styling
    if (window.scrollY > 50) {
        nav?.classList.add('shadow-lg', 'bg-white/80', 'dark:bg-slate-900/80', 'backdrop-blur-md'); 
        nav?.classList.remove('glass');
    } else {
        nav?.classList.remove('shadow-lg', 'bg-white/80', 'dark:bg-slate-900/80', 'backdrop-blur-md'); 
        nav?.classList.add('glass');
    }

    // ScrollSpy
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 250)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('text-brand-500', 'font-bold');
        if (current && link.getAttribute('href').includes(current)) {
            link.classList.add('text-brand-500', 'font-bold');
            link.classList.remove('text-slate-500', 'dark:text-slate-400');
        } else {
            link.classList.add('text-slate-500', 'dark:text-slate-400');
        }
    });
});

// --- Mobile Menu ---
const mobileMenuButton = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const dropdownLinks = document.querySelectorAll(".dropdown-links .nav-link");

mobileMenuButton?.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.toggle("hidden");
    mobileMenuButton.setAttribute("aria-expanded", String(!isHidden));
});

dropdownLinks.forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu?.classList.add("hidden");
        mobileMenuButton?.setAttribute("aria-expanded", "false");
    });
});

// --- Typewriter Effect ---
const textToType = "Junior Web Developer & Student Project Builder";
const typewriterElement = document.getElementById('typewriter');
let typeIndex = 0;

function typeWriter() {
    if (typewriterElement && typeIndex < textToType.length) {
        typewriterElement.innerHTML += textToType.charAt(typeIndex);
        typeIndex++;
        setTimeout(typeWriter, 100);
    }
}
setTimeout(typeWriter, 800);

// --- Particles ---
function createParticles() {
    const container = document.getElementById('particles-js');
    if(!container) return;
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.style.cssText = `position:absolute; width:${Math.random() * 4 + 2}px; height:${Math.random() * 4 + 2}px; background:#64748b; border-radius:50%; top:${Math.random() * 100}%; left:${Math.random() * 100}%; opacity:${Math.random() * 0.15 + 0.05}; animation:float ${Math.random() * 30 + 40}s linear infinite;`;
        container.appendChild(p);
    }
}
createParticles();
document.head.appendChild(Object.assign(document.createElement("style"), { innerText: "@keyframes float { 0% { transform: translateY(0) translateX(0); } 50% { transform: translateY(-100px) translateX(50px); } 100% { transform: translateY(0) translateX(0); } }" }));
