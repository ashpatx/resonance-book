document.addEventListener('DOMContentLoaded', () => {
    const book = document.querySelector('.book');
    const cover = document.querySelector('.cover');
    const pages = document.querySelectorAll('.page');
    const backCover = document.querySelector('.back-cover');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentPage = 0;
    const totalPages = pages.length;

    function updateBook() {
        cover.style.transform = currentPage === 0 ? 'rotateY(0)' : 'rotateY(-180deg)';
        cover.style.zIndex = currentPage === 0 ? 5 : 1;

        pages.forEach((page, index) => {
            if (index < currentPage) {
                page.style.transform = 'rotateY(-180deg)';
                page.style.zIndex = totalPages - index + 1;
            } else {
                page.style.transform = 'rotateY(0)';
                page.style.zIndex = totalPages - index;
            }
        });

        backCover.style.transform = currentPage === totalPages ? 'rotateY(-180deg)' : 'rotateY(0)';
        backCover.style.zIndex = currentPage === totalPages ? 5 : 1;

        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === totalPages;
    }

    function flipNext() {
        if (currentPage < totalPages) {
            currentPage++;
            updateBook();
        }
    }

    function flipPrev() {
        if (currentPage > 0) {
            currentPage--;
            updateBook();
        }
    }

    nextBtn.addEventListener('click', flipNext);
    prevBtn.addEventListener('click', flipPrev);

    // Initialize book
    updateBook();

    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            flipNext();
        } else if (e.key === 'ArrowLeft') {
            flipPrev();
        }
    });

    // Save content when user stops typing
    let saveTimeout;
    pages.forEach(page => {
        const content = page.querySelector('.page-content');
        content.addEventListener('input', () => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                localStorage.setItem(`page_${page.id}`, content.innerHTML);
            }, 1000);
        });
    });

    // Load saved content
    pages.forEach(page => {
        const content = page.querySelector('.page-content');
        const savedContent = localStorage.getItem(`page_${page.id}`);
        if (savedContent) {
            content.innerHTML = savedContent;
        }
    });

    // Delete functionality with tearing animation
    pages.forEach(page => {
        const deleteBtn = page.querySelector('.delete-btn');
        const content = page.querySelector('.page-content');
        
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this page\'s content?')) {
                page.classList.add('tearing');
                setTimeout(() => {
                    content.innerHTML = '';
                    localStorage.removeItem(`page_${page.id}`);
                    page.classList.remove('tearing');
                }, 500);
            }
        });
    });

    // Image upload functionality
    pages.forEach(page => {
        const uploadInput = page.querySelector('.upload-input');
        const content = page.querySelector('.page-content');

        uploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Uploaded image';
                    content.appendChild(img);
                    localStorage.setItem(`page_${page.id}`, content.innerHTML);
                };
                reader.readAsDataURL(file);
            }
        });
    });
});

