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
    
    // Initial fetch of students
    fetchStudents();
    
    // Form submit listener
    const studentForm = document.getElementById('studentForm');
    if(studentForm) {
        studentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const newStudent = {
                name: document.getElementById('name').value,
                roomNo: document.getElementById('roomNo').value,
                course: document.getElementById('course').value,
                status: document.getElementById('status').value
            };

            try {
                const response = await fetch('http://localhost:5000/api/students', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newStudent)
                });

                if (response.ok) {
                    studentForm.reset();
                    toggleForm();
                    fetchStudents(); // Refresh list
                } else {
                    const data = await response.json();
                    alert(data.error || 'Failed to add student');
                }
            } catch (err) {
                console.error(err);
                alert('Server error while adding student');
            }
        });
    }
});

// Toggle Add Student Form Visibility
function toggleForm() {
    const addStudentPanel = document.getElementById('addStudentPanel');
    if(addStudentPanel.style.display === 'none') {
        addStudentPanel.style.display = 'block';
    } else {
        addStudentPanel.style.display = 'none';
    }
}

// Fetch Students from Backend
async function fetchStudents() {
    try {
        const response = await fetch('http://localhost:5000/api/students');
        const students = await response.json();
        
        const tbody = document.getElementById('studentTableBody');
        const countBadge = document.getElementById('studentCountBadge');
        const totalCount = document.getElementById('totalStudentsCount');
        
        if (students.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No students found.</td></tr>';
            countBadge.innerText = '0';
            totalCount.innerText = '0';
            return;
        }

        // Update counts
        countBadge.innerText = students.length;
        if(totalCount) {
            animateNumber(totalCount, students.length);
        }

        tbody.innerHTML = ''; // Clear current
        
        students.forEach(student => {
            const tr = document.createElement('tr');
            
            const statusClass = student.status === 'Active' ? 'active' : 'pending';
            
            tr.innerHTML = `
                <td>${student.name}</td>
                <td>${student.roomNo}</td>
                <td>${student.course}</td>
                <td><span class="status ${statusClass}">${student.status}</span></td>
                <td>
                    <button class="btn-action btn-delete" onclick="deleteStudent('${student._id}')" title="Delete Student">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
    } catch (err) {
        console.error(err);
        const tbody = document.getElementById('studentTableBody');
        if(tbody) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: red;">Failed to load data from server.</td></tr>';
        }
    }
}

// Delete Student
async function deleteStudent(id) {
    if(!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        const response = await fetch(`http://localhost:5000/api/students/${id}`, {
            method: 'DELETE'
        });
        
        if(response.ok) {
            fetchStudents(); // Refresh data
        } else {
            alert('Failed to delete student');
        }
    } catch (err) {
        console.error(err);
        alert('Server error while deleting student');
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
