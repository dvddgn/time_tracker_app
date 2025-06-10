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

// Example: Load Rails libraries in Vite.
//
// import * as Turbo from '@hotwired/turbo'
// Turbo.start()
//
// import ActiveStorage from '@rails/activestorage'
// ActiveStorage.start()
//
// // Import all channels.
// const channels = import.meta.globEager('./**/*_channel.js')

// Example: Import a stylesheet in app/frontend/index.css
// import '~/index.css'
import "../../assets/stylesheets/application.css"
import 'flowbite';

// Prevent FOUC by making HTML visible after CSS loads
document.addEventListener('DOMContentLoaded', function() {
  document.documentElement.classList.add('loaded');
});

// Mobile sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('toggleSidebarMobile');
    const sidebar = document.getElementById('sidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    
    if (sidebarToggle && sidebar && backdrop) {
      sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('-translate-x-full');
        backdrop.classList.toggle('hidden');
      });
      
      backdrop.addEventListener('click', function() {
        sidebar.classList.add('-translate-x-full');
        backdrop.classList.add('hidden');
      });
    }
  });

// Import Simple DataTables
import { DataTable } from 'simple-datatables'

// Initialize DataTables when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeDataTables()
})

// Initialize DataTables for all tables
function initializeDataTables() {

  // Enhanced Time Logs Table configuration
  const timeLogsTable = document.getElementById('time-logs-table')
  
  if (timeLogsTable) {
    const timeLogsDataTable = new DataTable(timeLogsTable, {
      // Searching improvements
      searchable: true,
      searchAnd: false,
      sensitivity: "base", // Better search sensitivity for accented characters
      searchQuerySeparator: " ", // Explicit separator for multi-term searches
      ignorePunctuation: false,
      
      // Sorting improvements
      sortable: true,
      locale: "en-US", // Better locale-specific sorting
      numeric: true, // Better numeric sorting for duration column
      
      // Pagination improvements
      paging: true,
      perPage: 10, // More reasonable default page size
      perPageSelect: [5, 10, 25, 50, 100], // Better page size options
      nextPrev: true,
      firstLast: false, // Enable first/last buttons for better navigation
      prevText: "‹",
      nextText: "›",
      
      // Appearance improvements
      fixedHeight: false,
      
      // Column-specific configurations
      columns: [
        // Category column (index 0) - searchable and sortable
        { select: 0, sortable: true, searchable: true },
        // Date/Time column (index 1) - searchable and sortable (has data-order attribute for numeric sorting)
        { select: 1, sortable: true, searchable: true },
        // Duration column (index 2) - sortable and searchable (has data-order attribute for numeric sorting)
        { select: 2, sortable: true, searchable: true },
        // Notes column (index 3) - searchable and sortable
        { select: 3, sortable: true, searchable: true },
        // Actions column (index 4) - not sortable or searchable
        { select: 4, sortable: false, searchable: false }
      ],
      
      // Custom classes 
      classes: {
        active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        disabled: "opacity-50 cursor-not-allowed",
      },
      
      // Enhanced labels
      labels: {
        placeholder: "Search time logs...",
        perPage: "entries per page",
        noRows: "No time logs found matching your criteria",
        info: "Showing {start} to {end} of {rows} time logs",
        noEntries: "No time logs available"
      }
    })
  }

  // Enhanced Categories Table configuration
  const categoriesTable = document.getElementById('categories-table')

  if (categoriesTable) {
    new DataTable(categoriesTable, {
      // Searching improvements
      searchable: true,
      searchAnd: false,
      sensitivity: "base", // Better search sensitivity for accented characters
      searchQuerySeparator: " ", // Explicit separator for multi-term searches
      ignorePunctuation: false,
      
      // Sorting improvements
      sortable: true,
      locale: "en-US",
      numeric: true, // Better numeric sorting for duration column
      
      // Pagination improvements
      paging: true,
      perPage: 10,
      perPageSelect: [5, 10, 15, 25, 50],
      nextPrev: true,
      firstLast: false,
      prevText: "‹",
      nextText: "›",
      
      // Appearance
      fixedHeight: false,
      
      columns: [
        // Name column (index 0) - searchable and sortable
        { select: 0, sortable: true, searchable: true },
        // Description column (index 1) - searchable and sortable
        { select: 1, sortable: true, searchable: true },
        // Actions column (index 2) - not sortable or searchable
        { select: 2, sortable: false, searchable: false }
      ],
      
      // Custom classes 
      classes: {
        active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        disabled: "opacity-50 cursor-not-allowed"
      },
      
      // Enhanced labels
      labels: {
        placeholder: "Search categories ...",
        perPage: "entries per page",
        noRows: "No categories found",
        info: "Showing {start} to {end} of {rows} categories"
      }
    })
  }
}