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

function showChartLoading(chartId) {
  const container = document.getElementById(chartId);
  if (container) {
    container.innerHTML = `
      <div class="chart-loading flex items-center justify-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p class="text-sm text-gray-500 dark:text-gray-400">Loading chart...</p>
        </div>
      </div>
    `;
  }
}

function clearChartContainer(chartId) {
  const container = document.getElementById(chartId);
  if (container) {
    container.innerHTML = '';
  }
}

function showChartError(chartId, message = 'Unable to load chart') {
  const container = document.getElementById(chartId);
  if (container) {
    container.innerHTML = `
      <div class="flex items-center justify-center h-64">
        <div class="text-center">
          <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm text-gray-500 dark:text-gray-400">${message}</p>
        </div>
      </div>
    `;
  }
}

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

// Enhanced chart configuration with consistent theming
const chartDefaults = {
  fontFamily: "Inter, sans-serif",
  colors: ['#1C64F2', '#16BDCA', '#9061F9', '#F05252', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'],
  animations: {
    enabled: true,
    easing: 'easeinout',
    speed: 800,
    animateGradually: {
      enabled: true,
      delay: 150
    },
    dynamicAnimation: {
      enabled: true,
      speed: 350
    }
  },
  grid: {
    show: true,
    strokeDashArray: 4,
    borderColor: '#f3f4f6',
    row: {
      colors: ['transparent'],
      opacity: 0.5
    }
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

function initializeCategoryChart() {
  const chartId = 'category-pie-chart';
  const categoryData = window.dashboardData?.categoryData || [];
  let chart; // Store chart instance for updates
  
  if (categoryData.length === 0) {
    showEmptyChart(chartId, 'No category data available');
    return;
  }
  
  function renderChart() {
    showChartLoading(chartId);
    clearChartContainer(chartId);
    
    try {
      // Detect dark mode
      const isDarkMode = document.documentElement.classList.contains('dark') || 
                        window.matchMedia('(prefers-color-scheme: dark)').matches;
      const borderColor = isDarkMode ? "#374151" : "#ffffff"; // Dark gray for dark mode, white for light mode
      
      const chartOptions = {
        series: categoryData.map(cat => cat.hours),
        labels: categoryData.map(cat => cat.name),
        colors: chartDefaults.colors,
        chart: {
          height: 340,
          width: "100%",
          type: "pie",
          fontFamily: chartDefaults.fontFamily,
          animations: chartDefaults.animations,
          toolbar: chartDefaults.toolbar
        },
        stroke: {
          colors: [borderColor],
          lineCap: "",
          width: 1
        },
        plotOptions: {
          pie: {
            labels: {
              show: true,
            },
            size: "100%",
            dataLabels: {
              offset: -20
            },
            donut: {
              size: '0%'
            }
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            fontSize: '11px',
            colors: ['#ffffff'], 
            fontFamily: 'Inter, sans-serif',
            fontWeight: '500'
          },
          formatter: function(val, opts) {
            const category = categoryData[opts.seriesIndex];
            return category.percentage + '%';
          },
          dropShadow: {
            enabled: false
          }
        },
        legend: {
          show: false, // We'll use custom legend
        },
        tooltip: {
          enabled: true,
          style: {
            fontFamily: chartDefaults.fontFamily,
          },
          y: {
            formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
              const category = categoryData[seriesIndex];
              return `${category.hours} hours (${category.percentage}%)`;
            }
          }
        },
        states: {
          hover: {
            filter: {
              type: 'lighten',
              value: 0.15
            }
          },
          active: {
            allowMultipleDataPointsSelection: false,
            filter: {
              type: 'darken',
              value: 0.7
            }
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 280,
              height: 280
            },
            dataLabels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        }]
      };

      chart = new ApexCharts(document.getElementById(chartId), chartOptions);
      chart.render();
    } catch (error) {
      console.error('Failed to initialize category chart:', error);
      showChartError(chartId);
    }
  }

  // Initial render
  renderChart();
  
  // Listen for theme changes
  const observer = new MutationObserver(() => {
    if (chart) {
      chart.destroy();
    }
    renderChart();
  });
  
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  // Also listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (chart) {
      chart.destroy();
    }
    renderChart();
  });
}

function initializeDailyChart() {
  const chartId = 'daily-line-chart';
  const dailyData = window.dashboardData?.dailyData || [];
  
  showChartLoading(chartId);
  
  if (dailyData.length === 0 || dailyData.every(day => day.hours === 0)) {
    showEmptyChart(chartId, 'No daily activity data');
    return;
  }
  
  // Clear the loading state before rendering
  clearChartContainer(chartId);
  
  try {
    const chartOptions = {
      series: [{
        name: "Hours Worked",
        data: dailyData.map(day => ({
          x: day.day,
          y: day.hours
        })),
        color: chartDefaults.colors[0]
      }],
      chart: {
        height: 320,
        width: "100%",
        type: "line",
        fontFamily: chartDefaults.fontFamily,
        animations: chartDefaults.animations,
        toolbar: chartDefaults.toolbar,
        zoom: {
          enabled: false
        }
      },
      stroke: {
        width: 4,
        curve: 'smooth',
      },
      xaxis: {
        categories: dailyData.map(day => day.day.substring(0, 3)),
        labels: {
          style: {
            fontFamily: chartDefaults.fontFamily,
            fontSize: '12px',
            colors: '#6B7280'
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
            fontFamily: chartDefaults.fontFamily,
            fontSize: '12px',
            colors: '#6B7280'
          },
          formatter: function(value) {
            return value + 'h';
          }
        },
        min: 0
      },
      grid: chartDefaults.grid,
      fill: {
        opacity: 1,
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        style: {
          fontFamily: chartDefaults.fontFamily,
        },
        x: {
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            const dayData = dailyData[dataPointIndex];
            return dayData.day;
          }
        },
        y: {
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            const dayData = dailyData[dataPointIndex];
            return `${dayData.hours} hours worked<br/>${dayData.entries} time entries`;
          }
        }
      },
      markers: {
        size: 6,
        colors: [chartDefaults.colors[0]],
        strokeColors: "#ffffff",
        strokeWidth: 3,
        hover: {
          size: 8,
        }
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            height: 250
          },
          markers: {
            size: 4
          }
        }
      }]
    };

    const chart = new ApexCharts(document.getElementById(chartId), chartOptions);
    chart.render();
  } catch (error) {
    console.error('Failed to initialize daily chart:', error);
    showChartError(chartId);
  }
}

function initializeWeeklyChart() {
  const chartId = 'weekly-column-chart';
  const weeklyData = window.dashboardData?.weeklyData || [];
  
  showChartLoading(chartId);
  
  if (weeklyData.length === 0 || weeklyData.every(day => day.y === 0)) {
    showEmptyChart(chartId, 'No weekly activity data');
    return;
  }
  
  // Clear the loading state before rendering
  clearChartContainer(chartId);
  
  try {
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
        toolbar: chartDefaults.toolbar,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "60%",
          borderRadiusApplication: "end",
          borderRadius: 8,
          dataLabels: {
            position: 'top',
          }
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val > 0 ? val + 'h' : '';
        },
        offsetY: 5,
        style: {
          fontSize: '11px',
          colors: ['#ffffff'], 
          fontFamily: 'Inter, sans-serif',
          fontWeight: '500'
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        style: {
          fontFamily: chartDefaults.fontFamily,
        },
        y: {
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            const hours = weeklyData[dataPointIndex].y;
            const day = weeklyData[dataPointIndex].x;
            return `${hours} hours worked on ${day}day`;
          }
        }
      },
      states: {
        hover: {
          filter: {
            type: "lighten",
            value: 0.1,
          },
        },
      },
      stroke: {
        show: false,
        width: 0,
        colors: ["transparent"],
      },
      grid: chartDefaults.grid,
      legend: {
        show: false,
      },
      xaxis: {
        floating: false,
        labels: {
          show: true,
          style: {
            fontFamily: chartDefaults.fontFamily,
            fontSize: '12px',
            colors: '#6B7280'
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
            fontFamily: chartDefaults.fontFamily,
            fontSize: '12px',
            colors: '#6B7280'
          },
          formatter: function(value) {
            return value + 'h';
          }
        },
        min: 0
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
          dataLabels: {
            enabled: false
          }
        }
      }]
    };

    const chart = new ApexCharts(document.getElementById(chartId), chartOptions);
    chart.render();
  } catch (error) {
    console.error('Failed to initialize weekly chart:', error);
    showChartError(chartId);
  }
}

function initializeTopCategoriesChart() {
  const chartId = 'top-categories-chart';
  const topCategories = window.dashboardData?.topCategories || [];
  
  showChartLoading(chartId);
  
  if (topCategories.length === 0) {
    showEmptyChart(chartId, 'No category data available');
    return;
  }
  
  // Clear the loading state before rendering
  clearChartContainer(chartId);
  
  try {
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
        offsetX: -25,
        style: {
          colors: ['#ffffff'],
          fontSize: '11px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: '500'
        },
        formatter: function(val) {
          return val > 0 ? val + 'h' : '';
        }
      },
      stroke: {
        width: 0,
        colors: ["transparent"]
      },
      xaxis: {
        categories: topCategories.map(cat => cat.category),
        labels: {
          style: {
            fontFamily: chartDefaults.fontFamily,
            fontSize: '12px',
            colors: '#6B7280'
          },
          formatter: function(val) {
            return val + "h";
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
            fontFamily: chartDefaults.fontFamily,
            fontSize: '12px',
            colors: '#6B7280'
          },
          formatter: function(val) {
            // Truncate long category names for y-axis
            return val.length > 15 ? val.substring(0, 15) + '...' : val;
          }
        }
      },
      grid: chartDefaults.grid,
      tooltip: {
        style: {
          fontFamily: chartDefaults.fontFamily,
        },
        y: {
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            const category = topCategories[dataPointIndex];
            return `${category.hours} hours total (${category.percentage}% of time)`;
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
              horizontal: true,
            },
          },
          dataLabels: {
            enabled: false
          }
        }
      }]
    };

    const chart = new ApexCharts(document.getElementById(chartId), chartOptions);
    chart.render();
  } catch (error) {
    console.error('Failed to initialize top categories chart:', error);
    showChartError(chartId);
  }
}

function initializeDashboardCharts() {
  // Check if dashboard data exists
  if (!window.dashboardData) {
    console.warn('Dashboard data not available');
    return;
  }

  const chartConfigs = [
    { elementId: 'category-pie-chart', initFunction: initializeCategoryChart },
    { elementId: 'daily-line-chart', initFunction: initializeDailyChart },
    { elementId: 'weekly-column-chart', initFunction: initializeWeeklyChart },
    { elementId: 'top-categories-chart', initFunction: initializeTopCategoriesChart }
  ];

  chartConfigs.forEach(({ elementId, initFunction }) => {
    if (document.getElementById(elementId)) {
      try {
        initFunction();
      } catch (error) {
        console.error(`Failed to initialize chart ${elementId}:`, error);
        showChartError(elementId);
      }
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

