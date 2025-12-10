// CityOS Citizen Portal - Main Application Logic

// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Login functionality
function showLogin() {
    alert('Login functionality will be implemented in the future.\n\nFor demo purposes, you can explore all sections of the portal.');
}

// Dashboard functions
function viewServices() {
    scrollToSection('services');
    showNotification('Viewing your service requests...');
}

function viewBills() {
    scrollToSection('bills');
    showNotification('Loading your bills...');
}

function viewAnnouncements() {
    scrollToSection('announcements');
    showNotification('Checking latest announcements...');
}

function viewProfile() {
    showNotification('Profile management coming soon!');
}

// Service functions
function reportIssue() {
    const issue = prompt('What type of issue would you like to report?\n\n1. Pothole\n2. Street Light\n3. Graffiti\n4. Other\n\nEnter number (1-4):');
    
    if (issue) {
        const issueTypes = {
            '1': 'Pothole',
            '2': 'Street Light',
            '3': 'Graffiti',
            '4': 'Other'
        };
        
        const issueType = issueTypes[issue] || 'Unknown';
        showNotification(`Thank you! Your ${issueType} report has been submitted. Reference #${generateReferenceNumber()}`);
    }
}

function applyPermit() {
    showNotification('Building permit application form will open here.\n\nThis feature is under development.');
}

function manageParkring() {
    showNotification('Parking services management coming soon!');
}

function wasteInfo() {
    alert('🗑️ Waste Collection Schedule:\n\n' +
          '• Regular Trash: Monday & Thursday\n' +
          '• Recycling: Wednesday\n' +
          '• Yard Waste: Friday\n' +
          '• Bulk Items: 2nd Saturday of month\n\n' +
          'Collection time: 7:00 AM - 3:00 PM');
}

// Bill payment simulation
document.addEventListener('DOMContentLoaded', function() {
    const payButtons = document.querySelectorAll('.btn-pay');
    
    payButtons.forEach(button => {
        button.addEventListener('click', function() {
            const billItem = this.closest('.bill-item');
            const billType = billItem.querySelector('h3').textContent;
            const amount = billItem.querySelector('.amount').textContent;
            
            if (confirm(`Pay ${billType}: ${amount}?\n\nYou will be redirected to the secure payment gateway.`)) {
                showNotification(`Processing payment for ${billType}...`);
                setTimeout(() => {
                    showNotification(`Payment successful! Thank you for paying your ${billType}.`);
                    this.disabled = true;
                    this.textContent = 'Paid';
                    this.style.background = '#6b7280';
                }, 1500);
            }
        });
    });
});

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function generateReferenceNumber() {
    return 'SR' + Date.now().toString().slice(-8);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console welcome message
console.log('%c🏛️ CityOS Citizen Portal', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cWelcome to the CityOS development console!', 'font-size: 14px; color: #666;');
console.log('%cThis is a demo application. All data is simulated.', 'font-size: 12px; color: #999;');
