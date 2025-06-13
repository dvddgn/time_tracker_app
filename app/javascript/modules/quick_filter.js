// ====================================================================
// QUICK FILTER 
// ====================================================================

// Utility functions for date handling
function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getTodayInTimezone() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getDateRange(period) {
  const today = getTodayInTimezone();
  let startDate, endDate;

  switch (period) {
    case 'this-week':
      const currentDay = today.getDay();
      const daysFromMonday = currentDay === 0 ? 6 : currentDay - 1;
      startDate = new Date(today);
      startDate.setDate(today.getDate() - daysFromMonday);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 4);
      break;
    case 'last-week':
      const todayDay = today.getDay();
      const daysToLastMonday = todayDay === 0 ? 13 : todayDay + 6;
      startDate = new Date(today);
      startDate.setDate(today.getDate() - daysToLastMonday);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 4);
      break;
    case 'this-month':
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case 'last-month':
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    default:
      return { start: null, end: null };
  }

  return {
    start: formatDateLocal(startDate),
    end: formatDateLocal(endDate)
  };
}

export function initializeQuickFilter() {
  const quickFilterButton = document.getElementById('quick-filter-button');
  const quickFilterDropdown = document.getElementById('quick-filter-dropdown');
  const quickFilterOptions = document.querySelectorAll('.quick-filter-option');
  const startDatePicker = document.getElementById('start-datepicker');
  const endDatePicker = document.getElementById('end-datepicker');

  function toggleDropdown() {
    quickFilterDropdown.classList.toggle('hidden');
  }

  function closeDropdown() {
    quickFilterDropdown.classList.add('hidden');
  }

  if (quickFilterButton) {
    quickFilterButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleDropdown();
    });
  }

  quickFilterOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const period = this.dataset.period;
      const dateRange = getDateRange(period);
      if (dateRange.start && dateRange.end) {
        const url = new URL(window.location);
        url.searchParams.set('start_date', dateRange.start);
        url.searchParams.set('end_date', dateRange.end);
        window.location.href = url.toString();
      }
    });
  });

  document.addEventListener('click', function(e) {
    if (!quickFilterButton.contains(e.target) && !quickFilterDropdown.contains(e.target)) {
      closeDropdown();
    }
  });
} 