// ====================================================================
// IMPORTS
// ====================================================================
import { DataTable } from 'simple-datatables'

// ====================================================================
// TIME LOGS TABLE INITIALIZATION
// ====================================================================
export function initializeTimeLogsTable() {
  const tableElement = document.getElementById("time-logs-table");
  
  if (!tableElement || typeof DataTable === 'undefined') {
    return;
  }

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
        { select: 0, sortable: true, searchable: true },   // Category
        { select: 1, sortable: true, searchable: true },   // Date/Time
        { select: 2, sortable: true, searchable: true },   // Duration
        { select: 3, sortable: true, searchable: true },   // Notes
        { select: 4, sortable: false, searchable: false }  // Actions
      ]
    });
    console.log('Time logs table initialized successfully');
  } catch (error) {
    console.error('Time logs DataTable initialization failed:', error);
  }
}

// ====================================================================
// CATEGORIES TABLE INITIALIZATION
// ====================================================================
export function initializeCategoriesTable() {
  const tableElement = document.getElementById("categories-table");
  
  if (!tableElement || typeof DataTable === 'undefined') {
    return;
  }

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
        { select: 0, sortable: true, searchable: true },   // Name
        { select: 1, sortable: true, searchable: true },   // Description
        { select: 2, sortable: false, searchable: false }  // Actions
      ]
    });
    console.log('Categories table initialized successfully');
  } catch (error) {
    console.error('Categories DataTable initialization failed:', error);
  }
}

// ====================================================================
// DATATABLES INITIALIZATION
// ====================================================================
export function initializeDataTables() {
  initializeTimeLogsTable();
  initializeCategoriesTable();
} 