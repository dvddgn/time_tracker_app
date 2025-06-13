// To see this message, add the following to the `<head>` section in your
// views/layouts/application.html.erb
//
//    <%= vite_client_tag %>
//    <%= vite_javascript_tag 'application' %>
console.log('Vite ⚡️ Rails')

// If using a TypeScript entrypoint file:
//     <%= vite_typescript_tag 'application' %>
//
// If you want to use .jsx or .tsx, add the extension:
//     <%= vite_javascript_tag 'application.jsx' %>

console.log('Visit the guide for more information: ', 'https://vite-ruby.netlify.app/guide/rails')

// ====================================================================
// IMPORTS
// ====================================================================
import "../../assets/stylesheets/application.css"
import 'flowbite'

// Import UI utilities
import { initializeFOUCPrevention, initializeMobileSidebar } from '../modules/utilities'

// Import datepicker functionality
import { initializeDatePickers, initializeDateFilterFunctionality } from '../modules/datepicker'

// Import datatables functionality
import { initializeDataTables } from '../modules/tables'

// Import charts functionality
import { initializeDashboardCharts } from '../modules/charts'

// ====================================================================
// INITIALIZATION
// ====================================================================

function initializeApplication() {
  // UI Initialization
  initializeFOUCPrevention();
  initializeMobileSidebar();
  
  // Datepicker Initialization
  initializeDatePickers();
  initializeDateFilterFunctionality();
  
  // Data Tables Initialization
  initializeDataTables();
  
  // Charts Initialization
  initializeDashboardCharts();
  
  console.log('Application initialized successfully');
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApplication);
