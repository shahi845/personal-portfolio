const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const statusDiv = document.getElementById('formStatus');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('span');

        btnText.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        try {
            const data = Object.fromEntries(formData.entries());
            const API_BASE = (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
                ? 'http://localhost:3000'
                : '';

            const res = await fetch(`${API_BASE}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                statusDiv.className = 'rounded-lg p-4 mb-4 text-sm font-medium bg-green-500/10 text-green-500 border border-green-500/20';
                statusDiv.textContent = 'Message sent successfully!';
                contactForm.reset();
            } else {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || `Server returned ${res.status}`);
            }
        } catch (error) {
            statusDiv.className = 'rounded-lg p-4 mb-4 text-sm font-medium bg-red-500/10 text-red-500 border border-red-500/20';
            statusDiv.textContent = error.message || 'Error sending message. Please try again.';
        } finally {
            statusDiv.classList.remove('hidden');
            btnText.textContent = 'Send Message';
            submitBtn.disabled = false;
            setTimeout(() => statusDiv.classList.add('hidden'), 5000);
        }
    });
}
