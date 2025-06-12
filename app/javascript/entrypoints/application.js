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

function initializeCategoryChart() {
  const categoryData = window.dashboardData?.categoryData || []
  
  if (categoryData.length === 0) return
  
  const chartOptions = {
    series: categoryData.map(cat => cat.hours),
    labels: categoryData.map(cat => cat.name),
    colors: [
      '#1C64F2', '#16BDCA', '#9061F9', '#F05252', '#10B981', 
      '#F59E0B', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
    ],
    chart: {
      height: 300,
      width: "100%",
      type: "pie",
      fontFamily: "Inter, sans-serif",
    },
    stroke: {
      colors: ["white"],
      lineCap: "",
    },
    plotOptions: {
      pie: {
        labels: {
          show: true,
        },
        size: "100%",
        dataLabels: {
          offset: -25
        }
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: "Inter, sans-serif",
      },
      formatter: function(val, opts) {
        const hours = categoryData[opts.seriesIndex].hours
        return hours + 'h'
      }
    },
    legend: {
      show: false, // We'll use custom legend
    },
    tooltip: {
      formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
        const category = categoryData[seriesIndex]
        return `<div class="py-1">
          <div class="font-medium">${category.name}</div>
          <div class="text-sm">${category.hours} hours (${category.percentage}%)</div>
        </div>`
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 280,
          height: 280
        }
      }
    }]
  }

  const chart = new ApexCharts(document.getElementById("category-pie-chart"), chartOptions)
  chart.render()    
}

function initializeDailyChart() {
  const dailyData = window.dashboardData?.dailyData || []
  
  if (dailyData.length === 0) return
  
  const chartOptions = {
    series: [{
      name: "Hours Worked",
      data: dailyData.map(day => ({
        x: day.day,
        y: day.hours
      })),
      color: "#1C64F2"
    }],
    chart: {
      height: 300,
      width: "100%",
      type: "line",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    xaxis: {
      categories: dailyData.map(day => day.day.substring(0, 3)), // Mon, Tue, etc.
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        },
        formatter: function(value) {
          return value + 'h'
        }
      }
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -20
      },
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      style: {
        fontFamily: "Inter, sans-serif",
      },
      formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
        const dayData = dailyData[dataPointIndex]
        return `<div class="py-2">
          <div class="font-medium">${dayData.day}</div>
          <div class="text-sm">${dayData.hours} hours worked</div>
          <div class="text-sm">${dayData.entries} time entries</div>
        </div>`
      }
    },
    markers: {
      size: 5,
      colors: ["#1C64F2"],
      strokeColors: "#ffffff",
      strokeWidth: 2,
      hover: {
        size: 7,
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 250
        }
      }
    }]
  }

  const chart = new ApexCharts(document.getElementById("daily-line-chart"), chartOptions)
  chart.render()
}

function initializeWeeklyChart() {
  const weeklyData = window.dashboardData?.weeklyData || []
  
  if (weeklyData.length === 0) return
  
  const chartOptions = {
    series: [{
      name: "Hours",
      data: weeklyData,
      color: "#9061F9"
    }],
    chart: {
      type: "bar",
      height: 300,
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadiusApplication: "end",
        borderRadius: 8,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: "Inter, sans-serif",
      },
      formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
        const hours = weeklyData[dataPointIndex].y
        const day = weeklyData[dataPointIndex].x
        return `<div class="py-1">
          <div class="font-medium">${day}day</div>
          <div class="text-sm">${hours} hours worked</div>
        </div>`
      }
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 0.1,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -14
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      floating: false,
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        },
        formatter: function(value) {
          return value + 'h'
        }
      }
    },
    fill: {
      opacity: 1,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 250
        },
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
      }
    }]
  }

  const chart = new ApexCharts(document.getElementById("weekly-column-chart"), chartOptions)
  chart.render()
}

function initializeTopCategoriesChart() {
  const topCategories = window.dashboardData?.topCategories || []
  
  if (topCategories.length === 0) return
  
  const chartOptions = {
    series: [{
      name: "Hours",
      data: topCategories.map(cat => cat.hours),
      color: "#F97316"
    }],
    chart: {
      type: "bar",
      height: 300,
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: true,
        distributed: false,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
        fontSize: '12px',
        fontFamily: "Inter, sans-serif",
      },
      formatter: function(val, opt) {
        return val + "h"
      },
      offsetX: 0,
    },
    stroke: {
      width: 1,
      colors: ["#fff"]
    },
    xaxis: {
      categories: topCategories.map(cat => cat.category),
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        },
        formatter: function(val) {
          return val + "h"
        }
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      }
    },
    yaxis: {
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        },
        formatter: function(val) {
          // Truncate long category names for y-axis
          return val.length > 15 ? val.substring(0, 15) + '...' : val
        }
      }
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -20
      },
    },
    tooltip: {
      style: {
        fontFamily: "Inter, sans-serif",
      },
      formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
        const category = topCategories[dataPointIndex]
        return `<div class="py-1">
          <div class="font-medium">${category.category}</div>
          <div class="text-sm">${category.hours} hours total</div>
        </div>`
      }
    },
    fill: {
      opacity: 1,
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 250
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false
        }
      }
    }]
  }

  const chart = new ApexCharts(document.getElementById("top-categories-chart"), chartOptions)
  chart.render()
}

function initializeDashboardCharts() {
  const chartConfigs = [
    { elementId: 'category-pie-chart', initFunction: initializeCategoryChart },
    { elementId: 'daily-line-chart', initFunction: initializeDailyChart },
    { elementId: 'weekly-column-chart', initFunction: initializeWeeklyChart },
    { elementId: 'top-categories-chart', initFunction: initializeTopCategoriesChart }
  ];

  chartConfigs.forEach(({ elementId, initFunction }) => {
    if (document.getElementById(elementId)) {
      initFunction();
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

