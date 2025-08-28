/**
 * Electrical Engineering Calculator
 * A comprehensive web application for electrical calculations
 * 
 * Features:
 * - Real-time calculations (Power, Current, Voltage, Energy, Cost)
 * - Unit conversions (V/kV, A/mA, W/kW, h/min)
 * - Interactive charts with Chart.js
 * - Data export (CSV, PNG)
 * - Local storage for recent calculations
 * - PWA-ready with offline support
 * - Dark/Light theme toggle
 * - Responsive design
 * 
 * Author: AI Assistant
 * Version: 1.0.0
 */

// ===== GLOBAL VARIABLES =====
let energyChart = null;
let currentTheme = 'light';
let recentCalculations = [];

// ===== DOM ELEMENTS =====
const elements = {
    // Input fields
    voltage: document.getElementById('voltage'),
    current: document.getElementById('current'),
    power: document.getElementById('power'),
    time: document.getElementById('time'),
    tariff: document.getElementById('tariff'),
    
    // Result displays
    powerResult: document.getElementById('powerResult'),
    currentResult: document.getElementById('currentResult'),
    voltageResult: document.getElementById('voltageResult'),
    energyResult: document.getElementById('energyResult'),
    costResult: document.getElementById('costResult'),
    
    // Buttons
    themeToggle: document.getElementById('themeToggle'),
    resetBtn: document.getElementById('resetBtn'),
    downloadChart: document.getElementById('downloadChart'),
    exportCSV: document.getElementById('exportCSV'),
    
    // Sections
    recentCalculations: document.getElementById('recentCalculations'),
    
    // Unit toggle buttons
    voltageUnits: document.querySelectorAll('[data-unit="V"], [data-unit="kV"]'),
    currentUnits: document.querySelectorAll('[data-unit="A"], [data-unit="mA"]'),
    powerUnits: document.querySelectorAll('[data-unit="W"], [data-unit="kW"]'),
    timeUnits: document.querySelectorAll('[data-unit="h"], [data-unit="min"]')
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadRecentCalculations();
    initializeChart();
});

function initializeApp() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Load recent calculations from localStorage
    const saved = localStorage.getItem('recentCalculations');
    if (saved) {
        recentCalculations = JSON.parse(saved);
    }
    
    // Set default values
    elements.tariff.value = '8.5'; // Default Indian tariff
}

function setupEventListeners() {
    // Input field listeners for real-time calculation
    elements.voltage.addEventListener('input', debounce(performCalculations, 300));
    elements.current.addEventListener('input', debounce(performCalculations, 300));
    elements.power.addEventListener('input', debounce(performCalculations, 300));
    elements.time.addEventListener('input', debounce(performCalculations, 300));
    elements.tariff.addEventListener('input', debounce(performCalculations, 300));
    
    // Button listeners
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.resetBtn.addEventListener('click', resetAll);
    elements.downloadChart.addEventListener('click', downloadChartAsImage);
    elements.exportCSV.addEventListener('click', exportToCSV);
    
    // Unit toggle listeners
    setupUnitToggles();
    
    // Input validation
    setupInputValidation();
}

// ===== THEME MANAGEMENT =====
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle button
    const themeIcon = elements.themeToggle.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    
    // Update chart colors if chart exists
    if (energyChart) {
        updateChartTheme();
    }
}

// ===== UNIT CONVERSION SYSTEM =====
function setupUnitToggles() {
    // Voltage units
    elements.voltageUnits.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleUnitButtons(elements.voltageUnits, btn);
            convertVoltageUnits();
        });
    });
    
    // Current units
    elements.currentUnits.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleUnitButtons(elements.currentUnits, btn);
            convertCurrentUnits();
        });
    });
    
    // Power units
    elements.powerUnits.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleUnitButtons(elements.powerUnits, btn);
            convertPowerUnits();
        });
    });
    
    // Time units
    elements.timeUnits.forEach(btn => {
        btn.addEventListener('click', () => {
            toggleUnitButtons(elements.timeUnits, btn);
            convertTimeUnits();
        });
    });
}

function toggleUnitButtons(buttons, activeButton) {
    buttons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
}

function convertVoltageUnits() {
    const value = parseFloat(elements.voltage.value);
    if (isNaN(value)) return;
    
    const activeUnit = document.querySelector('[data-unit="V"], [data-unit="kV"]').textContent;
    if (activeUnit === 'kV' && elements.voltage.dataset.originalUnit !== 'kV') {
        elements.voltage.value = (value * 1000).toFixed(2);
        elements.voltage.dataset.originalUnit = 'kV';
    } else if (activeUnit === 'V' && elements.voltage.dataset.originalUnit === 'kV') {
        elements.voltage.value = (value / 1000).toFixed(2);
        elements.voltage.dataset.originalUnit = 'V';
    }
    performCalculations();
}

function convertCurrentUnits() {
    const value = parseFloat(elements.current.value);
    if (isNaN(value)) return;
    
    const activeUnit = document.querySelector('[data-unit="A"], [data-unit="mA"]').textContent;
    if (activeUnit === 'mA' && elements.current.dataset.originalUnit !== 'mA') {
        elements.current.value = (value * 1000).toFixed(2);
        elements.current.dataset.originalUnit = 'mA';
    } else if (activeUnit === 'A' && elements.current.dataset.originalUnit === 'mA') {
        elements.current.value = (value / 1000).toFixed(2);
        elements.current.dataset.originalUnit = 'A';
    }
    performCalculations();
}

function convertPowerUnits() {
    const value = parseFloat(elements.power.value);
    if (isNaN(value)) return;
    
    const activeUnit = document.querySelector('[data-unit="W"], [data-unit="kW"]').textContent;
    if (activeUnit === 'kW' && elements.power.dataset.originalUnit !== 'kW') {
        elements.power.value = (value * 1000).toFixed(2);
        elements.power.dataset.originalUnit = 'kW';
    } else if (activeUnit === 'W' && elements.power.dataset.originalUnit === 'kW') {
        elements.power.value = (value / 1000).toFixed(2);
        elements.power.dataset.originalUnit = 'W';
    }
    performCalculations();
}

function convertTimeUnits() {
    const value = parseFloat(elements.time.value);
    if (isNaN(value)) return;
    
    const activeUnit = document.querySelector('[data-unit="h"], [data-unit="min"]').textContent;
    if (activeUnit === 'min' && elements.time.dataset.originalUnit !== 'min') {
        elements.time.value = (value * 60).toFixed(2);
        elements.time.dataset.originalUnit = 'min';
    } else if (activeUnit === 'h' && elements.time.dataset.originalUnit === 'min') {
        elements.time.value = (value / 60).toFixed(2);
        elements.time.dataset.originalUnit = 'h';
    }
    performCalculations();
}

// ===== INPUT VALIDATION =====
function setupInputValidation() {
    const inputs = [elements.voltage, elements.current, elements.power, elements.time, elements.tariff];
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            input.classList.remove('valid', 'invalid');
        });
    });
}

function validateInput(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    
    if (input.value === '') {
        input.classList.remove('valid', 'invalid');
        return;
    }
    
    if (isNaN(value) || value < min) {
        input.classList.add('invalid');
        input.classList.remove('valid');
    } else {
        input.classList.add('valid');
        input.classList.remove('invalid');
    }
}

// ===== ELECTRICAL CALCULATIONS =====
function performCalculations() {
    const values = getInputValues();
    
    if (!hasValidInputs(values)) {
        clearResults();
        return;
    }
    
    const results = calculateAll(values);
    displayResults(results);
    updateChart(results);
    saveCalculation(values, results);
}

function getInputValues() {
    return {
        voltage: parseFloat(elements.voltage.value) || 0,
        current: parseFloat(elements.current.value) || 0,
        power: parseFloat(elements.power.value) || 0,
        time: parseFloat(elements.time.value) || 0,
        tariff: parseFloat(elements.tariff.value) || 0
    };
}

function hasValidInputs(values) {
    // Need at least 2 values to perform calculations
    const nonZeroValues = Object.values(values).filter(v => v > 0);
    return nonZeroValues.length >= 2;
}

function calculateAll(values) {
    const { voltage, current, power, time, tariff } = values;
    const results = {};
    
    // Power calculation (P = V × I)
    if (voltage > 0 && current > 0) {
        results.calculatedPower = voltage * current;
    } else if (power > 0) {
        results.calculatedPower = power;
    } else {
        results.calculatedPower = null;
    }
    
    // Current calculation (I = P / V)
    if (power > 0 && voltage > 0) {
        results.calculatedCurrent = power / voltage;
    } else if (current > 0) {
        results.calculatedCurrent = current;
    } else {
        results.calculatedCurrent = null;
    }
    
    // Voltage calculation (V = P / I)
    if (power > 0 && current > 0) {
        results.calculatedVoltage = power / current;
    } else if (voltage > 0) {
        results.calculatedVoltage = voltage;
    } else {
        results.calculatedVoltage = null;
    }
    
    // Energy calculation (E = P × t)
    const effectivePower = results.calculatedPower || power;
    if (effectivePower > 0 && time > 0) {
        results.energy = (effectivePower * time) / 1000; // Convert to kWh
    } else {
        results.energy = null;
    }
    
    // Cost calculation (Cost = Energy × Tariff)
    if (results.energy && tariff > 0) {
        results.cost = results.energy * tariff;
    } else {
        results.cost = null;
    }
    
    return results;
}

function displayResults(results) {
    // Display power result
    if (results.calculatedPower !== null) {
        elements.powerResult.textContent = formatNumber(results.calculatedPower);
        elements.powerResult.style.opacity = '1';
    } else {
        elements.powerResult.textContent = '--';
        elements.powerResult.style.opacity = '0.5';
    }
    
    // Display current result
    if (results.calculatedCurrent !== null) {
        elements.currentResult.textContent = formatNumber(results.calculatedCurrent);
        elements.currentResult.style.opacity = '1';
    } else {
        elements.currentResult.textContent = '--';
        elements.currentResult.style.opacity = '0.5';
    }
    
    // Display voltage result
    if (results.calculatedVoltage !== null) {
        elements.voltageResult.textContent = formatNumber(results.calculatedVoltage);
        elements.voltageResult.style.opacity = '1';
    } else {
        elements.voltageResult.textContent = '--';
        elements.voltageResult.style.opacity = '0.5';
    }
    
    // Display energy result
    if (results.energy !== null) {
        elements.energyResult.textContent = formatNumber(results.energy);
        elements.energyResult.style.opacity = '1';
    } else {
        elements.energyResult.textContent = '--';
        elements.energyResult.style.opacity = '0.5';
    }
    
    // Display cost result
    if (results.cost !== null) {
        elements.costResult.textContent = formatNumber(results.cost);
        elements.costResult.style.opacity = '1';
    } else {
        elements.costResult.textContent = '--';
        elements.costResult.style.opacity = '0.5';
    }
}

function clearResults() {
    const resultElements = [elements.powerResult, elements.currentResult, elements.voltageResult, elements.energyResult, elements.costResult];
    resultElements.forEach(element => {
        element.textContent = '--';
        element.style.opacity = '0.5';
    });
}

function formatNumber(num) {
    if (num === null || isNaN(num)) return '--';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'k';
    } else if (num < 0.01) {
        return num.toExponential(2);
    } else {
        return num.toFixed(2);
    }
}

// ===== CHART FUNCTIONALITY =====
function initializeChart() {
    const ctx = document.getElementById('energyChart').getContext('2d');
    
    energyChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Power (W)', 'Current (A)', 'Voltage (V)', 'Energy (kWh)', 'Cost (₹)'],
            datasets: [{
                data: [0, 0, 0, 0, 0],
                backgroundColor: [
                    '#2196F3', // Blue
                    '#FF9800', // Orange
                    '#4CAF50', // Green
                    '#9C27B0', // Purple
                    '#F44336'  // Red
                ],
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                        padding: 20,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-card'),
                    titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary'),
                    bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary'),
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color'),
                    borderWidth: 1
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true
            }
        }
    });
}

function updateChart(results) {
    if (!energyChart) return;
    
    const data = [
        results.calculatedPower || 0,
        results.calculatedCurrent || 0,
        results.calculatedVoltage || 0,
        results.energy || 0,
        results.cost || 0
    ];
    
    energyChart.data.datasets[0].data = data;
    energyChart.update('active');
}

function updateChartTheme() {
    if (!energyChart) return;
    
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary');
    
    energyChart.options.plugins.legend.labels.color = textColor;
    energyChart.options.plugins.tooltip.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-card');
    energyChart.options.plugins.tooltip.titleColor = textColor;
    energyChart.options.plugins.tooltip.bodyColor = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary');
    energyChart.options.plugins.tooltip.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    
    energyChart.update();
}

// ===== DATA EXPORT FUNCTIONS =====
function downloadChartAsImage() {
    if (!energyChart) return;
    
    const canvas = energyChart.canvas;
    const link = document.createElement('a');
    link.download = 'electrical-calculations-chart.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function exportToCSV() {
    const values = getInputValues();
    const results = calculateAll(values);
    
    if (!hasValidInputs(values)) {
        alert('Please enter valid values before exporting.');
        return;
    }
    
    const timestamp = new Date().toLocaleString();
    const csvContent = [
        'Timestamp,Parameter,Value,Unit',
        `${timestamp},Voltage,${values.voltage},V`,
        `${timestamp},Current,${values.current},A`,
        `${timestamp},Power,${values.power},W`,
        `${timestamp},Time,${values.time},h`,
        `${timestamp},Tariff,${values.tariff},₹/kWh`,
        `${timestamp},Calculated Power,${results.calculatedPower || 'N/A'},W`,
        `${timestamp},Calculated Current,${results.calculatedCurrent || 'N/A'},A`,
        `${timestamp},Calculated Voltage,${results.calculatedVoltage || 'N/A'},V`,
        `${timestamp},Energy Consumption,${results.energy || 'N/A'},kWh`,
        `${timestamp},Total Cost,${results.cost || 'N/A'},₹`
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `electrical-calculations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
}

// ===== RECENT CALCULATIONS =====
function saveCalculation(inputs, results) {
    const calculation = {
        timestamp: new Date().toISOString(),
        inputs: inputs,
        results: results
    };
    
    // Add to beginning of array
    recentCalculations.unshift(calculation);
    
    // Keep only last 10 calculations
    if (recentCalculations.length > 10) {
        recentCalculations = recentCalculations.slice(0, 10);
    }
    
    // Save to localStorage
    localStorage.setItem('recentCalculations', JSON.stringify(recentCalculations));
    
    // Update display
    displayRecentCalculations();
}

function displayRecentCalculations() {
    if (recentCalculations.length === 0) {
        elements.recentCalculations.innerHTML = '<p class="no-data">No recent calculations yet</p>';
        return;
    }
    
    const html = recentCalculations.map(calc => {
        const timestamp = new Date(calc.timestamp).toLocaleString();
        const inputs = calc.inputs;
        const results = calc.results;
        
        return `
            <div class="recent-item">
                <div class="recent-header">
                    <strong>Calculation</strong>
                    <span class="recent-timestamp">${timestamp}</span>
                </div>
                <div class="recent-values">
                    <div class="recent-value">V: ${inputs.voltage || '--'}</div>
                    <div class="recent-value">I: ${inputs.current || '--'}</div>
                    <div class="recent-value">P: ${inputs.power || '--'}</div>
                    <div class="recent-value">t: ${inputs.time || '--'}</div>
                    <div class="recent-value">Tariff: ${inputs.tariff || '--'}</div>
                </div>
                <div class="recent-values" style="margin-top: 0.5rem;">
                    <div class="recent-value">P_calc: ${results.calculatedPower ? formatNumber(results.calculatedPower) : '--'}</div>
                    <div class="recent-value">I_calc: ${results.calculatedCurrent ? formatNumber(results.calculatedCurrent) : '--'}</div>
                    <div class="recent-value">V_calc: ${results.calculatedVoltage ? formatNumber(results.calculatedVoltage) : '--'}</div>
                    <div class="recent-value">Energy: ${results.energy ? formatNumber(results.energy) : '--'}</div>
                    <div class="recent-value">Cost: ${results.cost ? formatNumber(results.cost) : '--'}</div>
                </div>
            </div>
        `;
    }).join('');
    
    elements.recentCalculations.innerHTML = html;
}

function loadRecentCalculations() {
    displayRecentCalculations();
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function resetAll() {
    // Clear all input fields
    elements.voltage.value = '';
    elements.current.value = '';
    elements.power.value = '';
    elements.time.value = '';
    elements.tariff.value = '8.5';
    
    // Reset unit toggles
    resetUnitToggles();
    
    // Clear results
    clearResults();
    
    // Reset chart
    if (energyChart) {
        energyChart.data.datasets[0].data = [0, 0, 0, 0, 0];
        energyChart.update();
    }
    
    // Clear input validation classes
    const inputs = [elements.voltage, elements.current, elements.power, elements.time, elements.tariff];
    inputs.forEach(input => {
        input.classList.remove('valid', 'invalid');
    });
    
    // Focus on first input
    elements.voltage.focus();
}

function resetUnitToggles() {
    // Reset all unit toggles to default
    const allUnitButtons = document.querySelectorAll('.unit-btn');
    allUnitButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === 'V' || btn.textContent === 'A' || btn.textContent === 'W' || btn.textContent === 'h') {
            btn.classList.add('active');
        }
    });
    
    // Clear dataset attributes
    elements.voltage.dataset.originalUnit = '';
    elements.current.dataset.originalUnit = '';
    elements.power.dataset.originalUnit = '';
    elements.time.dataset.originalUnit = '';
}

// ===== PWA INSTALLATION HANDLER =====
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or notification
    showInstallPrompt();
});

function showInstallPrompt() {
    // You can add a custom install button here
    console.log('PWA install prompt available');
}

// ===== OFFLINE DETECTION =====
window.addEventListener('online', () => {
    document.getElementById('pwaStatus').textContent = 'Online';
    document.getElementById('pwaStatus').style.backgroundColor = '#4CAF50';
});

window.addEventListener('offline', () => {
    document.getElementById('pwaStatus').textContent = 'Offline';
    document.getElementById('pwaStatus').style.backgroundColor = '#FF9800';
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to perform calculations
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        performCalculations();
    }
    
    // Ctrl/Cmd + R to reset
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetAll();
    }
    
    // Ctrl/Cmd + T to toggle theme
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    // You can add user-friendly error notifications here
});

// ===== PERFORMANCE OPTIMIZATION =====
// Use requestAnimationFrame for smooth animations
function smoothUpdateChart(results) {
    requestAnimationFrame(() => {
        updateChart(results);
    });
}

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====
window.ElectricalCalculator = {
    performCalculations,
    resetAll,
    toggleTheme,
    exportToCSV,
    downloadChartAsImage
};
