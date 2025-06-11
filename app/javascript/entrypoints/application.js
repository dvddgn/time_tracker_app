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

// DataTables Initialization
document.addEventListener('DOMContentLoaded', function() {
    
    // Time Logs Table
    if (document.getElementById("time-logs-table") && typeof DataTable !== 'undefined') {
        try {
            new DataTable("#time-logs-table", {
                searchable: true,
                sortable: true,
                paging: true,
                perPage: 10,
                perPageSelect: [5, 10, 25, 50],
                prevText: "",
                nextText: "",
                labels: {
                    placeholder: "Search time logs...",
                    perPage: "entries per page",
                    noRows: "No time logs found",
                    info: "Showing {start} to {end} of {rows} time logs"
                },
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
                ]
            });
            console.log('Time logs table initialized successfully');
        } catch (e) {
            console.log('Time logs DataTable initialization failed:', e);
        }
    }

    // Categories Table
    if (document.getElementById("categories-table") && typeof DataTable !== 'undefined') {
        try {
            new DataTable("#categories-table", {
                searchable: true,
                sortable: true,
                paging: true,
                perPage: 10,
                perPageSelect: [5, 10, 25, 50],
                prevText: "",
                nextText: "",
                labels: {
                    placeholder: "Search categories...",
                    perPage: "entries per page",
                    noRows: "No categories found",
                    info: "Showing {start} to {end} of {rows} categories"
                },
                columns: [
                    // Name column (index 0) - searchable and sortable
                    { select: 0, sortable: true, searchable: true },
                    // Description column (index 1) - searchable and sortable
                    { select: 1, sortable: true, searchable: true },
                    // Actions column (index 2) - not sortable or searchable
                    { select: 2, sortable: false, searchable: false }
                ]
            });
            console.log('Categories table initialized successfully');
        } catch (e) {
            console.log('Categories DataTable initialization failed:', e);
        }
    }
});