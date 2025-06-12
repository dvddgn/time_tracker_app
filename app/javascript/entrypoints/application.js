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

// ====================================================================
// IMPORTS
// ====================================================================
import "../../assets/stylesheets/application.css"
import 'flowbite'
import { DataTable } from 'simple-datatables'
import ApexCharts from 'apexcharts'

// Make ApexCharts available globally
window.ApexCharts = ApexCharts

// ====================================================================
// UI UTILITIES
// ====================================================================

// Prevent FOUC by making HTML visible after CSS loads
function initializeFOUCPrevention() {
  document.documentElement.classList.add('loaded');
}

// Mobile sidebar toggle functionality
function initializeMobileSidebar() {
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
}

// ====================================================================
// DATATABLES FUNCTIONALITY
// ====================================================================

function initializeTimeLogsTable() {
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

function initializeCategoriesTable() {
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

function initializeDataTables() {
  initializeTimeLogsTable();
  initializeCategoriesTable();
}

// ====================================================================
// CHARTS FUNCTIONALITY
// ====================================================================

// Shared chart configuration
const chartDefaults = {
  fontFamily: "Inter, sans-serif",
  colors: ['#1C64F2', '#16BDCA', '#9061F9', '#F05252', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'],
  animations: {
    enabled: true,
    easing: 'easeinout',
    speed: 800
  },
  grid: {
    show: true,
    strokeDashArray: 4,
    borderColor: '#f3f4f6'
  },
  toolbar: {
    show: true,
    tools: {
      download: true,
      selection: false,
      zoom: false,
      zoomin: false,
      zoomout: false,
      pan: false,
      reset: false
    }
  }
};

// Empty state helper
function showEmptyChart(chartId, message = 'No data available') {
  const container = document.getElementById(chartId);
  if (container) {
    container.innerHTML = `
      <div class="flex items-center justify-center h-80">
        <div class="text-center">
          <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p class="text-sm text-gray-500 dark:text-gray-400">${message}</p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Start tracking time to see your analytics</p>
        </div>
      </div>
    `;
  }
}

function initializeCategoryChart() {
  const chartId = 'category-pie-chart';
  const categoryData = window.dashboardData?.categoryData || [];
  
  if (categoryData.length === 0) {
    showEmptyChart(chartId, 'No category data available');
    return;
  }
  
  const chartOptions = {
    series: categoryData.map(cat => cat.hours),
    labels: categoryData.map(cat => cat.name),
    colors: chartDefaults.colors,
    chart: {
      height: 340,
      type: "pie",
      fontFamily: chartDefaults.fontFamily,
      animations: chartDefaults.animations,
      toolbar: chartDefaults.toolbar
    },
    dataLabels: {
      enabled: true,
      formatter: function(val, opts) {
        return categoryData[opts.seriesIndex].percentage + '%';
      }
    },
    legend: { show: false },
    tooltip: {
      y: {
        formatter: function(value, { seriesIndex }) {
          const category = categoryData[seriesIndex];
          return `${category.hours} hours (${category.percentage}%)`;
        }
      }
    }
  };

  const chart = new ApexCharts(document.getElementById(chartId), chartOptions);
  chart.render();
}

function initializeDailyChart() {
  const chartId = 'daily-line-chart';
  const dailyData = window.dashboardData?.dailyData || [];
  
  if (dailyData.length === 0 || dailyData.every(day => day.hours === 0)) {
    showEmptyChart(chartId, 'No daily activity data');
    return;
  }
  
  const chartOptions = {
    series: [{
      name: "Hours Worked",
      data: dailyData.map(day => ({ x: day.day, y: day.hours })),
      color: chartDefaults.colors[0]
    }],
    chart: {
      height: 320,
      type: "line",
      fontFamily: chartDefaults.fontFamily,
      animations: chartDefaults.animations,
      toolbar: chartDefaults.toolbar
    },
    stroke: { width: 4, curve: 'smooth' },
    xaxis: {
      categories: dailyData.map(day => day.day.substring(0, 3))
    },
    yaxis: {
      labels: {
        formatter: value => value + 'h'
      },
      min: 0
    },
    grid: chartDefaults.grid,
    dataLabels: { enabled: false },
    markers: {
      size: 6,
      colors: [chartDefaults.colors[0]],
      strokeColors: "#ffffff",
      strokeWidth: 3,
      hover: {
        size: 8
      }
    },
    tooltip: {
      x: {
        formatter: (value, { dataPointIndex }) => dailyData[dataPointIndex].day
      },
      y: {
        formatter: (value, { dataPointIndex }) => {
          const dayData = dailyData[dataPointIndex];
          return `${dayData.hours} hours worked<br/>${dayData.entries} time entries`;
        }
      }
    }
  };

  const chart = new ApexCharts(document.getElementById(chartId), chartOptions);
  chart.render();
}

function initializeWeeklyChart() {
  const chartId = 'weekly-column-chart';
  const weeklyData = window.dashboardData?.weeklyData || [];
  
  if (weeklyData.length === 0 || weeklyData.every(day => day.y === 0)) {
    showEmptyChart(chartId, 'No weekly activity data');
    return;
  }
  
  const chartOptions = {
    series: [{
      name: "Hours",
      data: weeklyData,
      color: chartDefaults.colors[4]
    }],
    chart: {
      type: "bar",
      height: 320,
      fontFamily: chartDefaults.fontFamily,
      animations: chartDefaults.animations,
      toolbar: chartDefaults.toolbar
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 8,
        borderRadiusApplication: "end"
      }
    },
    dataLabels: {
      enabled: true,
      formatter: val => val > 0 ? val + 'h' : ''
    },
    yaxis: {
      labels: {
        formatter: value => value + 'h'
      },
      min: 0
    },
    grid: chartDefaults.grid,
    tooltip: {
      y: {
        formatter: (value, { dataPointIndex }) => {
          const item = weeklyData[dataPointIndex];
          return `${item.y} hours worked on ${item.x}day`;
        }
      }
    }
  };

  const chart = new ApexCharts(document.getElementById(chartId), chartOptions);
  chart.render();
}

function initializeTopCategoriesChart() {
  const chartId = 'top-categories-chart';
  const topCategories = window.dashboardData?.topCategories || [];
  
  if (topCategories.length === 0) {
    showEmptyChart(chartId, 'No category data available');
    return;
  }
  
  const chartOptions = {
    series: [{
      name: "Hours",
      data: topCategories.map(cat => cat.hours),
      color: chartDefaults.colors[6]
    }],
    chart: {
      type: "bar",
      height: 320,
      fontFamily: chartDefaults.fontFamily,
      animations: chartDefaults.animations,
      toolbar: chartDefaults.toolbar
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        borderRadiusApplication: "end",
        horizontal: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: val => val > 0 ? val + 'h' : ''
    },
    xaxis: {
      categories: topCategories.map(cat => cat.category)
    },
    yaxis: {
      labels: {
        formatter: val => val.length > 15 ? val.substring(0, 15) + '...' : val
      }
    },
    grid: chartDefaults.grid,
    tooltip: {
      y: {
        formatter: (value, { dataPointIndex }) => {
          const category = topCategories[dataPointIndex];
          return `${category.hours} hours total (${category.percentage}% of time)`;
        }
      }
    }
  };

  const chart = new ApexCharts(document.getElementById(chartId), chartOptions);
  chart.render();
}

function initializeDashboardCharts() {
  if (!window.dashboardData) return;

  const charts = [
    { id: 'category-pie-chart', init: initializeCategoryChart },
    { id: 'daily-line-chart', init: initializeDailyChart },
    { id: 'weekly-column-chart', init: initializeWeeklyChart },
    { id: 'top-categories-chart', init: initializeTopCategoriesChart }
  ];

  charts.forEach(({ id, init }) => {
    if (document.getElementById(id)) {
      init();
    }
  });
}

// ====================================================================
// MAIN INITIALIZATION
// ====================================================================

function initializeApplication() {
  // UI Initialization
  initializeFOUCPrevention();
  initializeMobileSidebar();
  
  // Data Tables Initialization
  initializeDataTables();
  
  // Charts Initialization
  initializeDashboardCharts();
  
  console.log('Application initialized successfully');
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApplication);
