import ApexCharts from 'apexcharts'

// Make ApexCharts available globally
window.ApexCharts = ApexCharts

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

// Utility function for dark mode detection
function isDarkMode() {
  return document.documentElement.classList.contains('dark') || 
         window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Utility function to get stroke color based on theme
function getStrokeColor() {
  return isDarkMode() ? '#6B7280' : '#ffffff';
}

// Utility function to create base chart options
function createBaseChartOptions(height, type) {
  return {
    chart: {
      height,
      type,
      fontFamily: chartDefaults.fontFamily,
      animations: chartDefaults.animations,
      toolbar: chartDefaults.toolbar
    },
    grid: chartDefaults.grid
  };
}

// Utility function to handle theme changes
function setupThemeChangeListener(renderFunction) {
  // Listen for manual theme changes (class changes on html element)
  const observer = new MutationObserver(renderFunction);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', renderFunction);
}

// Utility function to format hours with label
function formatHours(hours) {
  return `${hours}h`;
}

// Utility function to check if data is empty
function isDataEmpty(data, checkZero = false) {
  if (!data || data.length === 0) return true;
  if (checkZero) return data.every(item => item.hours === 0);
  return false;
}

export function initializeCategoryChart() {
  const chartId = 'category-pie-chart';
  const categoryData = window.dashboardData?.categoryData || [];
  let chart; // Store chart instance
  
  if (isDataEmpty(categoryData)) {
    showEmptyChart(chartId, 'No category data available');
    return;
  }
  
  function renderChart() {
    const chartOptions = {
      ...createBaseChartOptions(340, 'pie'),
      series: categoryData.map(cat => cat.hours),
      labels: categoryData.map(cat => cat.name),
      colors: chartDefaults.colors,
      stroke: {
        show: true,
        width: 2,
        colors: [getStrokeColor()]
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

    // Destroy existing chart if it exists
    if (chart) {
      chart.destroy();
    }
    
    chart = new ApexCharts(document.getElementById(chartId), chartOptions);
    chart.render();
  }

  // Initial render
  renderChart();
  setupThemeChangeListener(renderChart);
}

export function initializeDailyChart() {
  const chartId = 'daily-line-chart';
  const dailyData = window.dashboardData?.dailyData || [];
  let chart; // Store chart instance
  
  if (isDataEmpty(dailyData, true)) {
    showEmptyChart(chartId, 'No daily activity data');
    return;
  }
  
  function renderChart() {
    const chartOptions = {
      ...createBaseChartOptions(320, 'line'),
      series: [{
        name: "Hours Worked",
        data: dailyData.map(day => ({ x: day.day, y: day.hours })),
        color: chartDefaults.colors[0]
      }],
      stroke: { width: 4, curve: 'smooth' },
      xaxis: {
        categories: dailyData.map(day => day.day.substring(0, 3))
      },
      yaxis: {
        labels: {
          formatter: formatHours
        },
        min: 0
      },
      dataLabels: { enabled: false },
      markers: {
        size: 6,
        colors: [chartDefaults.colors[0]],
        strokeColors: getStrokeColor(),
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

    // Destroy existing chart if it exists
    if (chart) {
      chart.destroy();
    }
    
    chart = new ApexCharts(document.getElementById(chartId), chartOptions);
    chart.render();
  }

  // Initial render
  renderChart();
  setupThemeChangeListener(renderChart);
}

export function initializeCategoryOverviewChart() {
  const chartId = 'category-column-chart';
  const categoryOverviewData = window.dashboardData?.categoryOverviewData || [];
  
  if (categoryOverviewData.length === 0 || categoryOverviewData.every(category => category.y === 0)) {
    showEmptyChart(chartId, 'No category overview data');
    return;
  }
  
  const chartOptions = {
    series: [{
      name: "Hours",
      data: categoryOverviewData,
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
          const item = categoryOverviewData[dataPointIndex];
          return `${item.y} hours worked in ${item.x}`;
        }
      }
    }
  };

  const chart = new ApexCharts(document.getElementById(chartId), chartOptions);
  chart.render();
}

export function initializeTopCategoriesChart() {
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
      categories: topCategories.map(cat => cat.name)
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

export function initializeDashboardCharts() {
  if (!window.dashboardData) return;

  const charts = [
    { id: 'category-pie-chart', init: initializeCategoryChart },
    { id: 'daily-line-chart', init: initializeDailyChart },
    { id: 'category-column-chart', init: initializeCategoryOverviewChart },
    { id: 'top-categories-chart', init: initializeTopCategoriesChart }
  ];

  charts.forEach(({ id, init }) => {
    if (document.getElementById(id)) {
      init();
    }
  });
} 