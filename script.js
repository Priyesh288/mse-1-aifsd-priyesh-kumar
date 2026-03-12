document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const navLinks = document.querySelectorAll('.nav-links li');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Remove active class from all links
            navLinks.forEach(item => item.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show corresponding tab content
            const tabId = link.getAttribute('data-tab');
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // Add animation to numbers on load
    const numbers = document.querySelectorAll('.stat-number');
    numbers.forEach(num => {
        const target = parseInt(num.innerText);
        let count = 0;
        const duration = 1000; // 1 second
        const increment = target / (duration / 16); // 60fps

        const updateCounter = () => {
            count += increment;
            if (count < target) {
                num.innerText = Math.ceil(count);
                requestAnimationFrame(updateCounter);
            } else {
                num.innerText = target;
            }
        };

        updateCounter();
    });

    // Notification bell animation
    const bellIcon = document.querySelector('.fa-bell');
    if(bellIcon) {
        setInterval(() => {
            bellIcon.classList.add('fa-shake');
            setTimeout(() => {
                bellIcon.classList.remove('fa-shake');
            }, 1000);
        }, 10000);
    }
    
    // Initial fetch of books
    fetchBooks();
    
    // Form submit listener
    const bookForm = document.getElementById('bookForm');
    if(bookForm) {
        bookForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newBook = {
                title: document.getElementById('title').value,
                author: document.getElementById('author').value,
                isbn: document.getElementById('isbn').value,
                genre: document.getElementById('genre').value,
                publisher: document.getElementById('publisher').value,
                totalCopies: parseInt(document.getElementById('totalCopies').value) || 1,
                status: document.getElementById('status').value
            };

            try {
                const response = await fetch('http://localhost:5000/books', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newBook)
                });

                if (response.ok) {
                    bookForm.reset();
                    toggleForm();
                    fetchBooks(); // Refresh list
                } else {
                    const data = await response.json();
                    alert(data.error || 'Failed to add book');
                }
            } catch (err) {
                console.error(err);
                alert('Server error while adding book');
            }
        });
    }
});

// Toggle Add Book Form Visibility
function toggleForm() {
    const addBookPanel = document.getElementById('addBookPanel');
    if(addBookPanel.style.display === 'none') {
        addBookPanel.style.display = 'block';
    } else {
        addBookPanel.style.display = 'none';
    }
}

// Fetch Books from Backend
async function fetchBooks() {
    try {
        const response = await fetch('http://localhost:5000/books');
        const books = await response.json();
        
        const tbody = document.getElementById('bookTableBody');
        const countBadge = document.getElementById('bookCountBadge');
        const totalCount = document.getElementById('totalBooksCount');
        
        if (books.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No books found.</td></tr>';
            countBadge.innerText = '0';
            totalCount.innerText = '0';
            return;
        }

        // Update counts
        countBadge.innerText = books.length;
        if(totalCount) {
            animateNumber(totalCount, books.length);
        }

        tbody.innerHTML = ''; // Clear current
        
        books.forEach(book => {
            const tr = document.createElement('tr');
            
            const statusClass = book.status === 'Available' ? 'active' : 'pending';
            
            tr.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.isbn}</td>
                <td><span class="status ${statusClass}">${book.status}</span></td>
                <td>
                    <button class="btn-action btn-delete" onclick="deleteBook('${book._id}')" title="Delete Book">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
    } catch (err) {
        console.error(err);
        const tbody = document.getElementById('bookTableBody');
        if(tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: red;">Failed to load data from server.</td></tr>';
        }
    }
}

// Delete Book
async function deleteBook(id) {
    if(!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        const response = await fetch(`http://localhost:5000/books/${id}`, {
            method: 'DELETE'
        });
        
        if(response.ok) {
            fetchBooks(); // Refresh data
        } else {
            alert('Failed to delete book');
        }
    } catch (err) {
        console.error(err);
        alert('Server error while deleting book');
    }
}

// Number animation helper function
function animateNumber(element, target) {
    let count = parseInt(element.innerText) || 0;
    if(count === target) return;
    
    const duration = 1000;
    const increment = Math.max(1, (target - count) / (duration / 16));

    const updateCounter = () => {
        count += increment;
        if ((increment > 0 && count < target) || (increment < 0 && count > target)) {
            element.innerText = Math.ceil(count);
            requestAnimationFrame(updateCounter);
        } else {
            element.innerText = target;
        }
    };

    updateCounter();
}
