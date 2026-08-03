// --- Project Filtering ---
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.remove('active', 'text-brand-500', 'border-brand-500', 'shadow-[0_0_10px_rgba(59,130,246,0.3)]');
            b.classList.add('text-slate-500');
        });
        
        btn.classList.add('active', 'text-brand-500', 'border-brand-500', 'shadow-[0_0_10px_rgba(59,130,246,0.3)]');
        btn.classList.remove('text-slate-500');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.classList.contains(filterValue)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// --- Case Study Modal ---
const caseStudyData = {
    'portfolio': {
        title: 'Personal Portfolio',
        problem: 'The previous iteration of the portfolio lacked professional credibility and felt cluttered with sections that overstated skills and experience.',
        goals: 'Create a portfolio that clearly communicates actual skills and projects with an accessible, modern design.',
        architecture: 'Built with pure HTML, JavaScript and Tailwind CSS. Refactored into modular CSS and JS files to improve maintainability.',
        challenges: 'Balancing visual density and performance. Heavy use of backdrop filters and mesh gradients required careful optimization.',
        solution: 'Simplified the content to honest claims, removed marketing buzzwords, split code into separate files.',
        lessons: 'Credibility matters more than self-promotion. A simpler and more honest portfolio communicates better than an overclaimed one.',
        stack: ['HTML5', 'TailwindCSS', 'JavaScript', 'Node.js'],
        live: 'https://shahidportfolio.mshahid3845.workers.dev',
        code: 'https://github.com/shahi845/shahidportfolio'
    },
    'calculator': {
        title: 'Interactive Web Calculator',
        problem: 'Standard browser calculators do not handle proper operator precedence for complex expressions.',
        goals: 'Build a responsive browser calculator with correct math precedence and keyboard support.',
        architecture: 'Written in Vanilla JavaScript with DOM-based state management. Uses an expression parser for operator precedence.',
        challenges: 'Handling edge cases like negative numbers, decimal precision, and sequential operations required careful logic.',
        solution: 'Built a browser-based calculator with operator precedence, keyboard support and responsive controls.',
        lessons: 'Gained understanding of expression parsing and careful handling of floating-point edge cases in JavaScript.',
        stack: ['Vanilla JS', 'CSS3', 'HTML5'],
        live: 'https://e-calculator.mshahid3845.workers.dev/',
        code: 'https://github.com/shahi845/e-calculator'
    },
    'faraid': {
        title: "Fara'id Calculator",
        problem: 'Existing Islamic inheritance calculators often lack the ability to customize for specific madhabs and struggle with fractional mathematics.',
        goals: 'Build a JavaScript inheritance engine for multiple madhabs with fraction handling and a clear output for heirs.',
        architecture: 'Designed a rule-based Pipeline architecture in JavaScript. Each inheritance rule (Awl, Radd, Hajb) is processed as a distinct step, making the logic readable and testable.',
        challenges: 'Translating classical jurisprudential rules into strict mathematical logic required intensive research and systematic testing.',
        solution: 'Built a JavaScript inheritance engine with fraction handling, heir blocking, awl and radd logic. Supports Shafi\'i, Hanafi, Maliki and Hanbali modes with case-specific tests. Madhhab-specific testing is ongoing.',
        lessons: 'Learned the Pipeline design pattern for sequential rule processing and working with exact fractions in JavaScript.',
        stack: ['JavaScript', 'Data Structures', 'PDF-Lib'],
        live: 'https://inheritancecalculator.mshahid3845.workers.dev',
        code: 'https://github.com/shahi845/faraid-calculator'
    }
};

const modal = document.getElementById('caseStudyModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const openModalBtns = document.querySelectorAll('.open-modal-btn');

openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-project');
        const data = caseStudyData[projectId];
        if (data) {
            document.getElementById('modalTitle').textContent = data.title;
            document.getElementById('modalProblem').textContent = data.problem;
            document.getElementById('modalGoals').textContent = data.goals;
            document.getElementById('modalArchitecture').textContent = data.architecture;
            document.getElementById('modalChallenges').textContent = data.challenges;
            document.getElementById('modalSolution').textContent = data.solution;
            document.getElementById('modalLessons').textContent = data.lessons;
            
            const stackContainer = document.getElementById('modalStack');
            stackContainer.innerHTML = data.stack.map(tech => `<span class="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-mono font-bold">${tech}</span>`).join('');
            
            document.getElementById('modalLiveLink').href = data.live;
            document.getElementById('modalCodeLink').href = data.code;
            
            modal.showModal();
            document.body.style.overflow = 'hidden';
        }
    });
});

closeModalBtn?.addEventListener('click', () => {
    modal.close();
    document.body.style.overflow = '';
});

modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.close();
        document.body.style.overflow = '';
    }
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.open) {
        modal.close();
        document.body.style.overflow = '';
    }
});

// --- GitHub Repos Fetch ---
async function fetchGitHubRepos() {
    const container = document.getElementById("github-repos");
    if (!container) return; // Fix: Only run if container exists
    
    container.innerHTML = Array(3).fill('<div class="h-32 rounded-xl skeleton"></div>').join('');
    try {
        const res = await fetch("https://api.github.com/users/shahi845/repos?sort=updated&per_page=6");
        if (res.ok) {
            const repos = await res.json();
            container.innerHTML = "";
            repos.forEach(repo => {
                container.innerHTML += `
      <div class="glass glass-card p-4 rounded-xl flex flex-col h-full" data-aos="fade-up">
        <h3 class="font-bold text-lg mb-1">${repo.name}</h3>
        <p class="text-xs text-slate-500 mb-2 flex-1">${repo.description || "No description provided."}</p>
        <div class="flex gap-4 text-xs font-mono text-slate-400">
          <span>${repo.language || 'Unknown'}</span>
          <span>⭐ ${repo.stargazers_count}</span>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="text-brand-500"><i class="fas fa-external-link-alt"></i> Link</a>
        </div>
      </div>`;
            });
        }
    } catch (err) { container.innerHTML = ""; }
}
fetchGitHubRepos();
