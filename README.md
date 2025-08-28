# ⚡ Electrical Engineering Calculator

A comprehensive, responsive web application for electrical engineering calculations, designed for deployment on GitHub Pages and supporting offline use (PWA-ready).

## 🌟 Features

### Core Functionality
- **Power Calculation**: P = V × I
- **Current Calculation**: I = P / V  
- **Voltage Calculation**: V = P / I
- **Electrical Energy**: E = P × t (in kWh)
- **Cost Calculation**: Cost = Energy × Tariff
- **Real-time Updates**: Instant calculations as you type
- **Dynamic Formulas**: Display calculation formulas with results

### Advanced Features
- **Unit Conversions**: V/kV, A/mA, W/kW, h/min
- **Interactive Charts**: Beautiful visualizations using Chart.js
- **Data Export**: CSV export and chart image download
- **Local Storage**: Save recent calculations offline
- **Dark/Light Theme**: Toggle between themes
- **Responsive Design**: Works perfectly on all devices

### PWA Features
- **Offline Support**: Works without internet connection
- **Installable**: Add to home screen on mobile/desktop
- **Background Sync**: Sync calculations when online
- **Push Notifications**: Get notified of important updates
- **Fast Loading**: Optimized for performance

## 🚀 Quick Start

### Local Development
1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Start calculating** - no server required!

### GitHub Pages Deployment
1. **Create a new repository** on GitHub
2. **Upload all files** to the repository
3. **Enable GitHub Pages** in repository settings
4. **Set source** to main branch
5. **Your app is live** at `https://username.github.io/repository-name`

## 📁 File Structure

```
electrical-calculator/
├── index.html          # Main HTML file
├── style.css           # CSS styles and themes
├── script.js           # JavaScript logic and calculations
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker for offline support
└── README.md          # This file
```

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and accessibility
- **CSS3**: Modern styling with CSS variables and Grid/Flexbox
- **Vanilla JavaScript (ES6+)**: No frameworks, pure performance
- **Chart.js**: Beautiful, interactive charts
- **Service Workers**: Offline functionality and caching
- **Web App Manifest**: PWA installation support

### Browser Support
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 11+
- **Mobile**: iOS Safari 11+, Chrome Mobile 60+
- **PWA Features**: Chrome 67+, Edge 79+, Safari 11.1+

## 📱 Usage Guide

### Basic Calculations
1. **Enter values** in any two input fields
2. **Results update automatically** in real-time
3. **View formulas** displayed below each result
4. **Use unit toggles** to convert between units

### Advanced Features
- **Theme Toggle**: Click the moon/sun icon in header
- **Reset All**: Click the refresh button to clear inputs
- **Export Data**: Download CSV or chart images
- **Recent Calculations**: View your calculation history

### Keyboard Shortcuts
- **Ctrl/Cmd + Enter**: Perform calculations
- **Ctrl/Cmd + R**: Reset all inputs
- **Ctrl/Cmd + T**: Toggle theme

## 🔧 Customization

### Colors and Themes
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #2196F3;    /* Main brand color */
    --secondary-color: #FF9800;  /* Accent color */
    --bg-primary: #ffffff;       /* Background color */
    --text-primary: #212529;     /* Text color */
}
```

### Adding New Calculations
Extend the `calculateAll()` function in `script.js`:
```javascript
function calculateAll(values) {
    // ... existing calculations ...
    
    // Add your new calculation
    if (condition) {
        results.newCalculation = formula;
    }
    
    return results;
}
```

### Modifying Charts
Update chart configuration in `initializeChart()`:
```javascript
energyChart = new Chart(ctx, {
    type: 'doughnut',           // Change chart type
    data: { /* ... */ },
    options: { /* ... */ }
});
```

## 📊 API Reference

### Global Functions
```javascript
// Access calculator functions globally
window.ElectricalCalculator.performCalculations();
window.ElectricalCalculator.resetAll();
window.ElectricalCalculator.toggleTheme();
window.ElectricalCalculator.exportToCSV();
window.ElectricalCalculator.downloadChartAsImage();
```

### Event Listeners
```javascript
// Listen for calculation updates
document.addEventListener('calculationComplete', (event) => {
    console.log('Calculation result:', event.detail);
});

// Listen for theme changes
document.addEventListener('themeChanged', (event) => {
    console.log('New theme:', event.detail.theme);
});
```

## 🚀 Performance Optimization

### Loading Speed
- **Minified CSS/JS**: Consider minifying for production
- **Image Optimization**: Use WebP format for better compression
- **CDN Usage**: Chart.js loaded from CDN for faster loading
- **Lazy Loading**: Implement for large datasets

### Caching Strategy
- **Static Files**: Cached immediately for offline use
- **Dynamic Content**: Network first, cache fallback
- **External Resources**: Cached after first load
- **Automatic Cleanup**: Old caches removed daily

## 🔒 Security Considerations

### Client-Side Security
- **Input Validation**: All inputs validated before processing
- **XSS Prevention**: No user input rendered as HTML
- **CSRF Protection**: Not applicable (client-side only)
- **Data Privacy**: All data stored locally

### Best Practices
- **HTTPS Only**: Required for PWA features
- **Content Security Policy**: Consider adding CSP headers
- **Regular Updates**: Keep dependencies updated

## 🐛 Troubleshooting

### Common Issues

**App not working offline:**
- Check if service worker is registered
- Verify manifest.json is accessible
- Clear browser cache and reload

**Charts not displaying:**
- Ensure Chart.js CDN is accessible
- Check browser console for errors
- Verify canvas element exists

**Theme not persisting:**
- Check localStorage permissions
- Clear browser data and retry
- Verify theme toggle event listeners

**Calculations not updating:**
- Check input validation
- Verify event listeners are attached
- Check browser console for errors

### Debug Mode
Enable debug logging in `script.js`:
```javascript
const DEBUG = true;

function log(message) {
    if (DEBUG) console.log(message);
}
```

## 📈 Future Enhancements

### Planned Features
- **More Electrical Formulas**: Resistance, capacitance, inductance
- **Unit Conversion**: More electrical units and prefixes
- **Data Import**: Load calculations from files
- **Cloud Sync**: Save calculations to cloud storage
- **Advanced Charts**: Multiple chart types and customization
- **Print Support**: Generate PDF reports

### Contributing
1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Chart.js**: For beautiful chart visualizations
- **Modern CSS**: For responsive design techniques
- **PWA Standards**: For progressive web app features
- **Electrical Engineering Community**: For formula validation

## 📞 Support

### Getting Help
- **Check Issues**: Look for similar problems in GitHub issues
- **Create Issue**: Report bugs or request features
- **Documentation**: Refer to this README and code comments
- **Community**: Ask questions in relevant forums

### Contact
- **GitHub**: Create an issue or discussion
- **Email**: [arun8941971190@gmail.com]
- **Website**: [https://arun278627862.github.io/arunportfolio.com/]

---

**Built with ❤️ for electrical engineers and students worldwide**

*Last updated: December 2024*

