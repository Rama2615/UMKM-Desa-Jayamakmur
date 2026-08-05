export function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.add('theme-transitioning');
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
            }, 400);
        });
    }
}
