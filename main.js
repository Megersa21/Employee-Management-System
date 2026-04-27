// Configuration
const BRAND_NAME = "Dire Dawa University";
const SUB_BRAND = "School of Computing";
const API_URL = "backend/api.php";

// State Management
let employees = JSON.parse(localStorage.getItem('employees_db')) || [
    { id: 1, name: 'Megersa Bekele', email: 'megersa.b@ddu.edu.et', role: 'Department Head', dept: 'Software Engineering', status: 'Active', salary: 15000, payrollStatus: 'Paid' },
    { id: 2, name: 'Mebrahtu Sefie', email: 'mebrahtu.s@ddu.edu.et', role: 'Senior Lecturer', dept: 'Computer Science', status: 'Active', salary: 12000, payrollStatus: 'Pending' },
    { id: 3, name: 'Sisay Melese', email: 'sisay.m@ddu.edu.et', role: 'Assistant Professor', dept: 'Information Technology', status: 'Remote', salary: 13500, payrollStatus: 'Paid' },
    { id: 4, name: 'Mirikat Dawit', email: 'mirikat.d@ddu.edu.et', role: 'Lab Assistant', dept: 'Software Engineering', status: 'Active', salary: 8000, payrollStatus: 'Pending' },
    { id: 5, name: 'Solomon Geta', email: 'solomon.g@ddu.edu.et', role: 'IT Specialist', dept: 'Information Technology', status: 'Active', salary: 9500, payrollStatus: 'Paid' },
];

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Fetch Data (Attempt PHP Backend, fallback to LocalStorage)
async function fetchEmployees() {
    try {
        const response = await fetch(`${API_URL}?action=get_employees`);
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (Array.isArray(data)) {
            employees = data;
            saveToLocal();
        }
    } catch (error) {
        console.warn("Backend not active. Running in Local Database mode.");
        // Data is already in 'employees' from localStorage on init
    }
}

function saveToLocal() {
    localStorage.setItem('employees_db', JSON.stringify(employees));
}

// Stats (Dynamic based on data)
const getStats = () => {
    const totalEmployees = employees.length;
    const avgSalary = employees.reduce((acc, emp) => acc + (parseFloat(emp.salary) || 0), 0) / (totalEmployees || 1);
    const activeCount = employees.filter(e => e.status === 'Active').length;

    return [
        { label: 'Total Faculty', value: totalEmployees, icon: 'users', color: '#154295', trend: '+' + (totalEmployees > 5 ? totalEmployees - 5 : 0), trendUp: true },
        { label: 'Avg Salary', value: '$' + Math.round(avgSalary).toLocaleString(), icon: 'credit-card', color: '#fbb03b', trend: 'Market', trendUp: true },
        { label: 'Active Staff', value: activeCount, icon: 'shield-check', color: '#2e7d32', trend: Math.round((activeCount / totalEmployees) * 100) + '%', trendUp: true },
        { label: 'System Status', value: 'Live', icon: 'server', color: '#06b6d4', trend: 'Optimal', trendUp: true },
    ];
};

const developers = [
    { name: 'Megersa Bekele', role: 'Lead Developer' },
    { name: 'Mebrahtu Sefie', role: 'Backend Architect' },
    { name: 'Sisay Melese', role: 'UI/UX Designer' },
    { name: 'Mirikat Dawit', role: 'Frontend Developer' },
    { name: 'Solomon Geta', role: 'Database Admin' },
];

const departments = [
    { name: 'Software Engineering', lead: 'Megersa Bekele', staff: 12 },
    { name: 'Computer Science', lead: 'Mebrahtu Sefie', staff: 15 },
    { name: 'Information Technology', lead: 'Sisay Melese', staff: 10 },
];

// UI Components
const renderDashboard = () => {
    const statsHtml = getStats().map(s => `
        <div class="card animate-fade">
            <div class="card-header">
                <div class="card-icon" style="background: rgba(${hexToRgb(s.color)}, 0.15); color: ${s.color}">
                    <i data-lucide="${s.icon}"></i>
                </div>
                <div class="trend ${s.trendUp ? 'up' : 'down'}">
                    ${s.trend}
                </div>
            </div>
            <div class="card-value">${s.value}</div>
            <div class="card-label">${s.label}</div>
        </div>
    `).join('');

    return `
        <div class="stats-grid">${statsHtml}</div>
        <div class="content-section animate-fade">
            <div class="section-header">
                <h2>Overview: ${SUB_BRAND}</h2>
                <button class="btn-primary"><i data-lucide="download"></i> Export Report</button>
            </div>
            <div style="height: 300px; display: flex; align-items: center; justify-content: center; color: var(--text-muted); border: 2px dashed var(--border); border-radius: 1rem; flex-direction: column; gap: 1rem;">
                <i data-lucide="bar-chart-3" style="width: 48px; height: 48px;"></i>
                <p>Analytics Overview</p>
            </div>
        </div>
    `;
};

const renderEmployees = (filterDept = null) => {
    const isAdmin = currentUser?.role === 'Administrator';

    const filteredEmployees = filterDept 
        ? employees.filter(e => e.dept === filterDept)
        : employees;

    const tableRows = filteredEmployees.map(emp => `
        <tr class="animate-fade">
            <td>
                <div class="emp-info">
                    <div class="dev-avatar" style="width: 32px; height: 32px; font-size: 0.8rem; margin-bottom: 0;">${emp.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                        <span class="emp-name">${emp.name}</span>
                        <span class="emp-email">${emp.email}</span>
                    </div>
                </div>
            </td>
            <td>${emp.role}</td>
            <td>${emp.dept}</td>
            <td>$${parseFloat(emp.salary || 0).toLocaleString()}</td>
            <td>
                <span class="status-badge status-${emp.status.toLowerCase().replace(' ', '-')}">
                    ${emp.status}
                </span>
            </td>
            <td>
                <div class="actions">
                    ${isAdmin ? `
                        <button class="btn-icon edit-btn" data-id="${emp.id}"><i data-lucide="edit-3"></i></button>
                        <button class="btn-icon delete-btn" data-id="${emp.id}" style="color: #ef4444;"><i data-lucide="trash-2"></i></button>
                    ` : `
                        <button class="btn-icon" title="View Profile"><i data-lucide="eye"></i></button>
                    `}
                </div>
            </td>
        </tr>
    `).join('');

    return `
        <div class="content-section animate-fade">
            <div class="section-header">
                <div>
                    <h2>${filterDept ? `${filterDept} Faculty` : 'Faculty Directory'}</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">${filterDept ? `Viewing all members of ${filterDept}` : 'Manage school staff members'}</p>
                </div>
                <div style="display: flex; gap: 1rem;">
                    ${filterDept ? `<button class="btn-ghost" id="clear-filter-btn">Show All</button>` : ''}
                    ${isAdmin ? `
                        <button class="btn-primary" id="add-staff-btn"><i data-lucide="plus"></i> Add Staff</button>
                    ` : ''}
                </div>
            </div>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Salary</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

const renderSettings = () => {
    return `
        <div class="content-section animate-fade">
            <h2>System Settings</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">Current User: ${currentUser?.username} (${currentUser?.role})</p>
            
            <div style="margin-top: 2rem;">
                <h3 style="margin-bottom: 1rem; border-left: 4px solid var(--primary); padding-left: 1rem;">About Developers</h3>
                <div class="dev-grid">
                    ${developers.map(dev => `
                        <div class="dev-card">
                            <div class="dev-avatar">${dev.name.split(' ').map(n => n[0]).join('')}</div>
                            <span class="dev-name">${dev.name}</span>
                            <span class="dev-role">${dev.role}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <button class="btn-ghost" id="logout-btn" style="margin-top: 3rem; color: #ef4444; border-color: #ef4444;">Sign Out</button>
        </div>
    `;
};

// Utils
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

// Modal Logic
function openModal(emp = null) {
    const modal = document.getElementById('employee-modal');
    const modalCard = modal.querySelector('.modal-card');
    if (modalCard) modalCard.scrollTop = 0;

    const title = document.getElementById('modal-title');
    const form = document.getElementById('employee-form');

    if (emp) {
        title.textContent = "Edit Staff Member";
        document.getElementById('emp-id').value = emp.id;
        document.getElementById('emp-name').value = emp.name;
        document.getElementById('emp-email').value = emp.email;
        document.getElementById('emp-phone').value = emp.phone || '';
        document.getElementById('emp-role').value = emp.role;
        document.getElementById('emp-dept').value = emp.dept;
        document.getElementById('emp-salary').value = emp.salary || '';
        document.getElementById('emp-join-date').value = emp.join_date || '';
        document.getElementById('emp-status').value = emp.status;
    } else {
        title.textContent = "Add New Staff";
        form.reset();
        document.getElementById('emp-id').value = "";
    }

    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('employee-modal').classList.remove('active');
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('emp-id').value;
    const data = {
        id: id || Date.now(),
        name: document.getElementById('emp-name').value,
        email: document.getElementById('emp-email').value,
        phone: document.getElementById('emp-phone').value,
        role: document.getElementById('emp-role').value,
        dept: document.getElementById('emp-dept').value,
        salary: document.getElementById('emp-salary').value,
        join_date: document.getElementById('emp-join-date').value,
        status: document.getElementById('emp-status').value,
        payrollStatus: 'Pending'
    };

    const action = id ? 'update_employee' : 'add_employee';

    // Attempt PHP
    try {
        const response = await fetch(`${API_URL}?action=${action}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        await response.json();
    } catch (error) {
        console.warn("Backend failed, performing local operation.");
    }

    // Always perform local operation for resilience
    if (id) {
        const index = employees.findIndex(e => e.id == id);
        employees[index] = data;
    } else {
        employees.push(data);
    }

    saveToLocal();
    closeModal();
    navigate('employees');
}

async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    // Attempt PHP
    try {
        await fetch(`${API_URL}?action=delete_employee&id=${id}`, { method: 'DELETE' });
    } catch (error) {
        console.warn("Backend delete failed, performing local delete.");
    }

    employees = employees.filter(e => e.id != id);
    saveToLocal();
    navigate('employees');
}

const renderDepartments = () => {
    const deptCards = departments.map(dept => {
        const deptStaff = employees.filter(e => e.dept === dept.name);
        return `
            <div class="card animate-fade dept-card">
                <div class="card-header">
                    <div class="card-icon" style="background: rgba(99, 102, 241, 0.15); color: #6366f1">
                        <i data-lucide="layers"></i>
                    </div>
                    <div class="trend up">Active</div>
                </div>
                <div class="card-value">${dept.name}</div>
                <div class="card-label">Lead: ${dept.lead}</div>
                
                <div class="dept-stats" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: var(--text-muted); font-size: 0.85rem;">Total:</span>
                    <span style="font-weight: 600; color: var(--primary);">${deptStaff.length} Members</span>
                </div>
                <button class="btn-ghost view-dept-employees" data-dept="${dept.name}" style="margin-top: 1rem; width: 100%; font-size: 0.8rem;">Full Directory</button>
            </div>
        `;
    }).join('');

    return `
        <div class="content-section animate-fade">
            <div class="section-header">
                <div>
                    <h2>Academic Departments</h2>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Manage school departments and their faculty</p>
                </div>
                <button class="btn-primary" id="add-dept-as-staff"><i data-lucide="plus"></i> Add Faculty Member</button>
            </div>
            <div class="stats-grid">${deptCards}</div>
        </div>
    `;
};

const renderPayroll = () => {
    const tableRows = employees.map(emp => `
        <tr class="animate-fade">
            <td>
                <div class="emp-info">
                    <div class="dev-avatar" style="width: 32px; height: 32px; font-size: 0.8rem; margin-bottom: 0;">${emp.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                        <span class="emp-name">${emp.name}</span>
                        <span class="emp-email">${emp.dept}</span>
                    </div>
                </div>
            </td>
            <td>$${parseFloat(emp.salary || 0).toLocaleString()}</td>
            <td>
                <span class="status-badge status-${emp.payrollStatus?.toLowerCase() || 'pending'}">
                    ${emp.payrollStatus || 'Pending'}
                </span>
            </td>
            <td>
                ${emp.payrollStatus === 'Paid' ?
            `<button class="btn-ghost reset-pay-btn" data-id="${emp.id}" style="padding: 0.4rem 1rem; font-size: 0.8rem; border-color: #f59e0b; color: #f59e0b;"><i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i> Reset to Pending</button>` :
            `<button class="btn-primary pay-btn" data-id="${emp.id}" style="padding: 0.4rem 1rem; font-size: 0.8rem;">Process Payment</button>`
        }
            </td>
        </tr>
    `).join('');

    const totalPayroll = employees.reduce((acc, e) => acc + (parseFloat(e.salary) || 0), 0);
    const paidCount = employees.filter(e => e.payrollStatus === 'Paid').length;
    const pendingCount = employees.length - paidCount;

    return `
        <div class="stats-grid">
            <div class="card animate-fade">
                <div class="card-label">Total Monthly Payroll</div>
                <div class="card-value">$${totalPayroll.toLocaleString()}</div>
                <div class="card-label" style="font-size: 0.75rem;">Budget Allocation</div>
            </div>
            <div class="card animate-fade">
                <div class="card-label">Paid Staff</div>
                <div class="card-value" style="color: #10b981;">${paidCount}</div>
                <div class="card-label" style="font-size: 0.75rem;">Completed Transactions</div>
            </div>
            <div class="card animate-fade">
                <div class="card-label">Pending Staff</div>
                <div class="card-value" style="color: #ef4444;">${pendingCount}</div>
                <div class="card-label" style="font-size: 0.75rem;">Awaiting Payment</div>
            </div>
        </div>
        <div class="content-section animate-fade">
            <div class="section-header">
                <h2>Payroll Management</h2>
                <button class="btn-ghost" id="refresh-payroll"><i data-lucide="rotate-cw"></i> Refresh</button>
            </div>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>Employee / Dept</th>
                            <th>Salary</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
        </div>
    `;
};

// Router
const views = {
    dashboard: renderDashboard,
    employees: renderEmployees,
    departments: renderDepartments,
    payroll: renderPayroll,
    settings: renderSettings,
};

async function navigate(viewName, filter = null) {
    const contentArea = document.getElementById('content-area');

    if (viewName === 'employees') {
        await fetchEmployees();
    }

    contentArea.innerHTML = views[viewName] ? views[viewName](filter) : '<h2>404 Not Found</h2>';

    // Attach event listeners
    if (viewName === 'employees') {
        document.getElementById('add-staff-btn')?.addEventListener('click', () => openModal());
        document.getElementById('clear-filter-btn')?.addEventListener('click', () => navigate('employees'));
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const emp = employees.find(e => e.id == btn.dataset.id);
                openModal(emp);
            });
        });
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteEmployee(btn.dataset.id));
        });
    }

    if (viewName === 'departments') {
        document.getElementById('add-dept-as-staff')?.addEventListener('click', () => {
            openModal();
        });
        document.querySelectorAll('.view-dept-employees').forEach(btn => {
            btn.addEventListener('click', () => {
                const dept = btn.dataset.dept;
                navigate('employees', dept);
            });
        });
    }

    if (viewName === 'payroll') {
        document.querySelectorAll('.pay-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const index = employees.findIndex(e => e.id == id);
                if (index !== -1) {
                    employees[index].payrollStatus = 'Paid';
                    saveToLocal();
                    navigate('payroll');
                }
            });
        });
        document.querySelectorAll('.reset-pay-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const index = employees.findIndex(e => e.id == id);
                if (index !== -1) {
                    employees[index].payrollStatus = 'Pending';
                    saveToLocal();
                    navigate('payroll');
                }
            });
        });
        document.getElementById('refresh-payroll')?.addEventListener('click', () => navigate('payroll'));
    }

    if (viewName === 'settings') {
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.view === viewName);
    });

    lucide.createIcons();
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    // Branding
    const logoContainer = document.getElementById('logo-icon-container');
    if (logoContainer) {
        logoContainer.innerHTML = `<img src="logo.png" alt="DDU Logo" style="width: 32px; height: 32px;">`;
    }

    // Login Logic
    const loginForm = document.getElementById('login-form');
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app');

    if (currentUser) {
        loginScreen.style.display = 'none';
        appScreen.style.display = 'flex';
        navigate('dashboard');
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}?action=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();

            if (result.success) {
                currentUser = result.user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                loginScreen.style.opacity = '0';
                setTimeout(() => {
                    loginScreen.style.display = 'none';
                    appScreen.style.display = 'flex';
                    navigate('dashboard');
                }, 300);
            } else {
                alert(result.message || "Invalid Credentials.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            // Fallback for demo if backend is not reachable
            if (username === 'admin' && password === 'admin123') {
                currentUser = { username: 'admin', role: 'Administrator' };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                loginScreen.style.display = 'none';
                appScreen.style.display = 'flex';
                navigate('dashboard');
            } else {
                alert("Connection to backend failed. Please ensure your PHP server is running.");
            }
        }
    });

    // Search Bar Logic
    const searchInput = document.querySelector('.search-bar input');
    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const activeView = document.querySelector('.nav-link.active')?.dataset.view;

        if (activeView === 'employees') {
            const rows = document.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        }
    });

    // Modal Close
    document.getElementById('close-modal')?.addEventListener('click', closeModal);
    document.getElementById('employee-form')?.addEventListener('submit', handleFormSubmit);

    // Nav Links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigate(link.dataset.view);
        });
    });
});
