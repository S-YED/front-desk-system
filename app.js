// Healthcare Clinic Front Desk System - JavaScript (Fixed)

class ClinicSystem {
    constructor() {
        this.data = {
            queuePatients: [
                {
                    id: 1,
                    queueNumber: "Q001",
                    name: "John Doe",
                    status: "Waiting",
                    arrivalTime: "09:30",
                    estimatedWait: "15 min",
                    priority: "Normal",
                    phone: "+1 234-567-8901"
                },
                {
                    id: 2,
                    queueNumber: "Q002", 
                    name: "Jane Smith",
                    status: "With Doctor",
                    arrivalTime: "09:45",
                    estimatedWait: "0 min",
                    priority: "Normal",
                    phone: "+1 234-567-8902"
                },
                {
                    id: 3,
                    queueNumber: "Q003",
                    name: "Bob Johnson",
                    status: "Waiting",
                    arrivalTime: "10:00", 
                    estimatedWait: "5 min",
                    priority: "Urgent",
                    phone: "+1 234-567-8903"
                },
                {
                    id: 4,
                    queueNumber: "Q004",
                    name: "Alice Brown",
                    status: "Completed",
                    arrivalTime: "09:15",
                    estimatedWait: "0 min",
                    priority: "Normal",
                    phone: "+1 234-567-8904"
                }
            ],
            doctors: [
                {
                    id: 1,
                    name: "Dr. Smith",
                    specialization: "General Practice",
                    status: "Available",
                    nextAvailable: "Now",
                    location: "Room 101"
                },
                {
                    id: 2,
                    name: "Dr. Johnson", 
                    specialization: "Pediatrics",
                    status: "Busy",
                    nextAvailable: "2:30 PM",
                    location: "Room 102"
                },
                {
                    id: 3,
                    name: "Dr. Lee",
                    specialization: "Cardiology", 
                    status: "Available",
                    nextAvailable: "Now",
                    location: "Room 103"
                },
                {
                    id: 4,
                    name: "Dr. Patel",
                    specialization: "Dermatology",
                    status: "Available", 
                    nextAvailable: "Now",
                    location: "Room 104"
                }
            ],
            appointments: [
                {
                    id: 1,
                    patientName: "Alice Brown",
                    doctorName: "Dr. Smith",
                    time: "10:00 AM",
                    date: "2025-08-07",
                    status: "Booked",
                    phone: "+1 234-567-8904",
                    reason: "Regular Checkup"
                },
                {
                    id: 2,
                    patientName: "Charlie Davis", 
                    doctorName: "Dr. Johnson",
                    time: "11:30 AM",
                    date: "2025-08-07",
                    status: "Booked",
                    phone: "+1 234-567-8905",
                    reason: "Vaccination"
                },
                {
                    id: 3,
                    patientName: "Eva White",
                    doctorName: "Dr. Lee",
                    time: "2:00 PM", 
                    date: "2025-08-07",
                    status: "Booked",
                    phone: "+1 234-567-8906",
                    reason: "Heart Consultation"
                },
                {
                    id: 4,
                    patientName: "David Wilson",
                    doctorName: "Dr. Patel",
                    time: "3:30 PM",
                    date: "2025-08-08", 
                    status: "Booked",
                    phone: "+1 234-567-8907",
                    reason: "Skin Examination"
                }
            ],
            timeSlots: [
                "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
                "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM"
            ]
        };
        
        this.currentView = 'dashboard';
        this.nextQueueNumber = 5;
        this.nextAppointmentId = 5;
        this.filteredQueuePatients = [...this.data.queuePatients];
        this.filteredAppointments = [...this.data.appointments];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCurrentDate();
        this.populateAppointmentForm();
        this.renderDashboard();
        this.renderQueues();
        this.renderAppointments();
    }

    setupEventListeners() {
        // Navigation - Fixed event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-btn') || e.target.closest('.nav-btn')) {
                const btn = e.target.classList.contains('nav-btn') ? e.target : e.target.closest('.nav-btn');
                const view = btn.getAttribute('data-view');
                if (view) {
                    e.preventDefault();
                    this.switchView(view);
                }
            }
        });

        // Queue management
        const addPatientBtn = document.getElementById('add-patient-btn');
        if (addPatientBtn) {
            addPatientBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('add-patient-modal');
            });
        }

        const addPatientForm = document.getElementById('add-patient-form');
        if (addPatientForm) {
            addPatientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addPatientToQueue();
            });
        }

        // Appointment management
        const scheduleAppointmentBtn = document.getElementById('schedule-appointment-btn');
        if (scheduleAppointmentBtn) {
            scheduleAppointmentBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showModal('schedule-appointment-modal');
            });
        }

        const scheduleAppointmentForm = document.getElementById('schedule-appointment-form');
        if (scheduleAppointmentForm) {
            scheduleAppointmentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.scheduleAppointment();
            });
        }

        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-close') || 
                e.target.id === 'cancel-patient' || 
                e.target.id === 'cancel-appointment') {
                e.preventDefault();
                this.hideAllModals();
            }
        });

        // Search and filter - Fixed
        const queueSearch = document.getElementById('queue-search');
        if (queueSearch) {
            queueSearch.addEventListener('input', (e) => {
                this.filterQueue(e.target.value, document.getElementById('queue-filter').value);
            });
        }

        const queueFilter = document.getElementById('queue-filter');
        if (queueFilter) {
            queueFilter.addEventListener('change', (e) => {
                this.filterQueue(document.getElementById('queue-search').value, e.target.value);
            });
        }

        const appointmentSearch = document.getElementById('appointment-search');
        if (appointmentSearch) {
            appointmentSearch.addEventListener('input', (e) => {
                this.filterAppointments(e.target.value, document.getElementById('appointment-filter').value);
            });
        }

        const appointmentFilter = document.getElementById('appointment-filter');
        if (appointmentFilter) {
            appointmentFilter.addEventListener('change', (e) => {
                this.filterAppointments(document.getElementById('appointment-search').value, e.target.value);
            });
        }

        // Close modals on background click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });
    }

    updateCurrentDate() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateEl = document.getElementById('current-date');
        if (dateEl) {
            dateEl.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    switchView(view) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-view="${view}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Show view
        document.querySelectorAll('.view').forEach(viewEl => {
            viewEl.classList.remove('active');
        });
        const targetView = document.getElementById(`${view}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }

        this.currentView = view;

        // Update content based on view
        if (view === 'dashboard') {
            this.renderDashboard();
        } else if (view === 'queue') {
            this.renderQueues();
        } else if (view === 'appointments') {
            this.renderAppointments();
        }
    }

    renderDashboard() {
        // Update statistics
        const queueCount = this.data.queuePatients.filter(p => p.status !== 'Completed').length;
        const availableDoctors = this.data.doctors.filter(d => d.status === 'Available').length;
        const todayAppointments = this.data.appointments.filter(a => a.date === '2025-08-07').length;
        const avgWait = this.calculateAverageWait();

        const queueCountEl = document.getElementById('queue-count');
        const availableDoctorsEl = document.getElementById('available-doctors');
        const todayAppointmentsEl = document.getElementById('today-appointments');
        const avgWaitEl = document.getElementById('avg-wait');

        if (queueCountEl) queueCountEl.textContent = queueCount;
        if (availableDoctorsEl) availableDoctorsEl.textContent = availableDoctors;
        if (todayAppointmentsEl) todayAppointmentsEl.textContent = todayAppointments;
        if (avgWaitEl) avgWaitEl.textContent = avgWait;

        // Render dashboard sections
        this.renderDashboardQueue();
        this.renderDashboardDoctors();
    }

    renderDashboardQueue() {
        const container = document.getElementById('dashboard-queue');
        if (!container) return;

        const waitingPatients = this.data.queuePatients.filter(p => p.status !== 'Completed').slice(0, 3);

        if (waitingPatients.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><p>No patients in queue</p></div>';
            return;
        }

        container.innerHTML = waitingPatients.map(patient => `
            <div class="queue-item" style="margin-bottom: 12px; padding: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${patient.name}</strong>
                        <div style="font-size: 12px; color: var(--color-text-secondary);">${patient.queueNumber}</div>
                    </div>
                    <span class="status-badge status-${patient.status.toLowerCase().replace(' ', '-')}">${patient.status}</span>
                </div>
            </div>
        `).join('');
    }

    renderDashboardDoctors() {
        const container = document.getElementById('dashboard-doctors');
        if (!container) return;
        
        container.innerHTML = this.data.doctors.map(doctor => `
            <div class="doctor-card">
                <h4>${doctor.name}</h4>
                <p>${doctor.specialization} - ${doctor.location}</p>
                <span class="status-badge status-${doctor.status.toLowerCase().replace(' ', '-')}">${doctor.status}</span>
            </div>
        `).join('');
    }

    calculateAverageWait() {
        const waitingPatients = this.data.queuePatients.filter(p => p.status === 'Waiting');
        if (waitingPatients.length === 0) return 0;
        
        const totalWait = waitingPatients.reduce((sum, patient) => {
            return sum + parseInt(patient.estimatedWait);
        }, 0);
        
        return Math.round(totalWait / waitingPatients.length);
    }

    renderQueues() {
        const container = document.getElementById('queue-list');
        if (!container) return;
        
        if (this.filteredQueuePatients.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">👥</div><p>No patients found</p></div>';
            return;
        }

        container.innerHTML = this.filteredQueuePatients.map(patient => `
            <div class="queue-item">
                <div class="queue-item-header">
                    <span class="queue-number">${patient.queueNumber}</span>
                    <span class="status-badge priority-${patient.priority.toLowerCase()}">${patient.priority}</span>
                </div>
                <div class="queue-item-content">
                    <div class="patient-info">
                        <h4>${patient.name}</h4>
                        <p>${patient.phone}</p>
                    </div>
                    <div>
                        <strong>Arrival:</strong><br>
                        <span>${patient.arrivalTime}</span>
                    </div>
                    <div>
                        <strong>Wait Time:</strong><br>
                        <span>${patient.estimatedWait}</span>
                    </div>
                    <div>
                        <span class="status-badge status-${patient.status.toLowerCase().replace(' ', '-')}">${patient.status}</span>
                        <div class="queue-actions" style="margin-top: 8px;">
                            ${this.renderQueueActions(patient)}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderQueueActions(patient) {
        const actions = [];
        
        if (patient.status === 'Waiting') {
            actions.push(`<button class="btn btn--sm btn--primary" data-action="call" data-patient-id="${patient.id}">Call Patient</button>`);
        } else if (patient.status === 'With Doctor') {
            actions.push(`<button class="btn btn--sm btn--secondary" data-action="complete" data-patient-id="${patient.id}">Complete</button>`);
        }
        
        if (patient.status !== 'Completed') {
            actions.push(`<button class="btn btn--sm btn--outline" data-action="remove" data-patient-id="${patient.id}">Remove</button>`);
        }
        
        return actions.join('');
    }

    renderAppointments() {
        const container = document.getElementById('appointments-list');
        if (!container) return;
        
        if (this.filteredAppointments.length === 0) {
            container.innerHTML = '<div class="empty-state"><div class="empty-icon">📅</div><p>No appointments found</p></div>';
            return;
        }

        container.innerHTML = this.filteredAppointments.map(appointment => `
            <div class="appointment-item">
                <div class="appointment-header">
                    <div>
                        <strong>${this.formatDate(appointment.date)}</strong>
                    </div>
                    <span class="status-badge status-${appointment.status.toLowerCase()}">${appointment.status}</span>
                </div>
                <div class="appointment-content">
                    <div class="appointment-info">
                        <h4>${appointment.patientName}</h4>
                        <p>${appointment.phone}</p>
                        <p style="margin-top: 4px; font-size: 12px;">${appointment.reason}</p>
                    </div>
                    <div>
                        <strong>Doctor:</strong><br>
                        <span>${appointment.doctorName}</span>
                    </div>
                    <div>
                        <strong>Time:</strong><br>
                        <span>${appointment.time}</span>
                    </div>
                    <div class="appointment-actions">
                        ${this.renderAppointmentActions(appointment)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderAppointmentActions(appointment) {
        const actions = [];
        
        if (appointment.status === 'Booked') {
            actions.push(`<button class="btn btn--sm btn--secondary" data-action="complete" data-appointment-id="${appointment.id}">Complete</button>`);
            actions.push(`<button class="btn btn--sm btn--outline" data-action="cancel" data-appointment-id="${appointment.id}">Cancel</button>`);
        }
        
        return actions.join('');
    }

    addPatientToQueue() {
        const name = document.getElementById('patient-name').value.trim();
        const phone = document.getElementById('patient-phone').value.trim();
        const priority = document.getElementById('patient-priority').value;

        if (!name || !phone) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        const newPatient = {
            id: Date.now(),
            queueNumber: `Q${String(this.nextQueueNumber).padStart(3, '0')}`,
            name: name,
            status: 'Waiting',
            arrivalTime: this.getCurrentTime(),
            estimatedWait: '10 min',
            priority: priority,
            phone: phone
        };

        this.data.queuePatients.unshift(newPatient);
        this.nextQueueNumber++;
        this.filteredQueuePatients = [...this.data.queuePatients];
        
        this.hideAllModals();
        this.clearForm('add-patient-form');
        this.showToast('Patient added to queue successfully', 'success');
        
        if (this.currentView === 'queue') {
            this.renderQueues();
        }
        this.renderDashboard();
    }

    scheduleAppointment() {
        const patientName = document.getElementById('appointment-patient-name').value.trim();
        const phone = document.getElementById('appointment-patient-phone').value.trim();
        const doctor = document.getElementById('appointment-doctor').value;
        const date = document.getElementById('appointment-date').value;
        const time = document.getElementById('appointment-time').value;
        const reason = document.getElementById('appointment-reason').value.trim();

        if (!patientName || !phone || !doctor || !date || !time) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        const newAppointment = {
            id: this.nextAppointmentId++,
            patientName: patientName,
            doctorName: doctor,
            time: time,
            date: date,
            status: 'Booked',
            phone: phone,
            reason: reason || 'General Consultation'
        };

        this.data.appointments.push(newAppointment);
        this.filteredAppointments = [...this.data.appointments];
        
        this.hideAllModals();
        this.clearForm('schedule-appointment-form');
        this.showToast('Appointment scheduled successfully', 'success');
        
        if (this.currentView === 'appointments') {
            this.renderAppointments();
        }
        this.renderDashboard();
    }

    // Event delegation for dynamically created buttons
    handleActionClick(e) {
        const action = e.target.getAttribute('data-action');
        const patientId = e.target.getAttribute('data-patient-id');
        const appointmentId = e.target.getAttribute('data-appointment-id');

        if (patientId) {
            const id = parseInt(patientId);
            if (action === 'call') {
                this.updatePatientStatus(id, 'With Doctor');
            } else if (action === 'complete') {
                this.updatePatientStatus(id, 'Completed');
            } else if (action === 'remove') {
                this.removePatient(id);
            }
        }

        if (appointmentId) {
            const id = parseInt(appointmentId);
            if (action === 'complete') {
                this.updateAppointmentStatus(id, 'Completed');
            } else if (action === 'cancel') {
                this.updateAppointmentStatus(id, 'Cancelled');
            }
        }
    }

    updatePatientStatus(id, status) {
        const patient = this.data.queuePatients.find(p => p.id === id);
        if (patient) {
            patient.status = status;
            if (status === 'With Doctor') {
                patient.estimatedWait = '0 min';
            }
            this.filteredQueuePatients = this.filteredQueuePatients.map(p => 
                p.id === id ? patient : p
            );
            this.renderQueues();
            this.renderDashboard();
            this.showToast(`Patient status updated to ${status}`, 'success');
        }
    }

    updateAppointmentStatus(id, status) {
        const appointment = this.data.appointments.find(a => a.id === id);
        if (appointment) {
            appointment.status = status;
            this.filteredAppointments = this.filteredAppointments.map(a => 
                a.id === id ? appointment : a
            );
            this.renderAppointments();
            this.renderDashboard();
            this.showToast(`Appointment ${status.toLowerCase()}`, 'success');
        }
    }

    removePatient(id) {
        if (confirm('Are you sure you want to remove this patient from the queue?')) {
            this.data.queuePatients = this.data.queuePatients.filter(p => p.id !== id);
            this.filteredQueuePatients = this.filteredQueuePatients.filter(p => p.id !== id);
            this.renderQueues();
            this.renderDashboard();
            this.showToast('Patient removed from queue', 'success');
        }
    }

    filterQueue(searchTerm, statusFilter) {
        let filteredPatients = [...this.data.queuePatients];

        if (statusFilter && statusFilter !== 'All') {
            filteredPatients = filteredPatients.filter(p => p.status === statusFilter);
        }

        if (searchTerm) {
            filteredPatients = filteredPatients.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.queueNumber.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        this.filteredQueuePatients = filteredPatients;
        this.renderQueues();
    }

    filterAppointments(searchTerm, statusFilter) {
        let filteredAppointments = [...this.data.appointments];

        if (statusFilter && statusFilter !== 'All') {
            filteredAppointments = filteredAppointments.filter(a => a.status === statusFilter);
        }

        if (searchTerm) {
            filteredAppointments = filteredAppointments.filter(a => 
                a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                a.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        this.filteredAppointments = filteredAppointments;
        this.renderAppointments();
    }

    populateAppointmentForm() {
        const doctorSelect = document.getElementById('appointment-doctor');
        if (doctorSelect) {
            doctorSelect.innerHTML = '<option value="">Select Doctor</option>' + 
                this.data.doctors.map(doctor => 
                    `<option value="${doctor.name}">${doctor.name} - ${doctor.specialization}</option>`
                ).join('');
        }

        const timeSelect = document.getElementById('appointment-time');
        if (timeSelect) {
            timeSelect.innerHTML = '<option value="">Select Time</option>' + 
                this.data.timeSlots.map(time => 
                    `<option value="${time}">${time}</option>`
                ).join('');
        }

        // Set minimum date to today
        const appointmentDate = document.getElementById('appointment-date');
        if (appointmentDate) {
            const today = new Date().toISOString().split('T')[0];
            appointmentDate.min = today;
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        document.body.style.overflow = '';
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const messageEl = document.getElementById('toast-message');
        
        if (toast && messageEl) {
            messageEl.textContent = message;
            toast.className = `toast show ${type}`;
            
            setTimeout(() => {
                toast.classList.add('hidden');
                toast.classList.remove('show', type);
            }, 3000);
        }
    }

    clearForm(formId) {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit'
        });
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short',
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    }
}

// Initialize the clinic system when the page loads
let clinicSystem;

document.addEventListener('DOMContentLoaded', () => {
    clinicSystem = new ClinicSystem();
    
    // Add event delegation for dynamic buttons
    document.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-action')) {
            clinicSystem.handleActionClick(e);
        }
    });
});