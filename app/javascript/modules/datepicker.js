// ====================================================================
// DATE FILTER FUNCTIONALITY
// ====================================================================
export function initializeDateFilterFunctionality() {
  const applyButton = document.getElementById('apply-filter');
  const startDateInput = document.getElementById('start-datepicker');
  const endDateInput = document.getElementById('end-datepicker');

  if (!applyButton || !startDateInput || !endDateInput) {
    return;
  }

  applyButton.addEventListener('click', function() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date must be before end date');
      return;
    }
    
    // Add loading state to button
    applyButton.innerHTML = `
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
      Applying...
    `;
    applyButton.disabled = true;
    
    // Reload page with date parameters
    const url = new URL(window.location.href);
    url.searchParams.set('start_date', startDate);
    url.searchParams.set('end_date', endDate);
    window.location.href = url.toString();
  });
  
  console.log('Date filter functionality initialized');
}

// ====================================================================
// DATE PICKER INITIALIZATION
// ====================================================================
export function initializeDatePickers() {
  const startDateEl = document.getElementById('start-datepicker');
  const endDateEl = document.getElementById('end-datepicker');
  
  if (!startDateEl && !endDateEl) {
    return;
  }

  try {
    // Import and configure Flowbite datepicker with proper settings
    import('flowbite-datepicker').then(({ Datepicker }) => {
      const datepickerOptions = {
        autohide: true,
        format: 'yyyy-mm-dd',
        todayBtn: true,
        clearBtn: true,
        todayHighlight: true,
        orientation: 'bottom auto'
      };

      if (startDateEl) {
        const startPicker = new Datepicker(startDateEl, datepickerOptions);
        console.log('Start datepicker initialized');
      }

      if (endDateEl) {
        const endPicker = new Datepicker(endDateEl, datepickerOptions);
        console.log('End datepicker initialized');
      }

      // Add custom event listeners for validation if both elements exist
      if (startDateEl && endDateEl) {
        startDateEl.addEventListener('input', validateDateRange);
        endDateEl.addEventListener('input', validateDateRange);
        startDateEl.addEventListener('changeDate', validateDateRange);
        endDateEl.addEventListener('changeDate', validateDateRange);
      }

    }).catch(error => {
      console.error('Failed to load Flowbite datepicker:', error);
      console.log('Datepickers will use auto-initialization instead');
    });
    
  } catch (error) {
    console.error('Date picker initialization failed:', error);
  }
}

// ====================================================================
// DATE RANGE VALIDATION
// ====================================================================
function validateDateRange() {
  const startDateEl = document.getElementById('start-datepicker');
  const endDateEl = document.getElementById('end-datepicker');
  
  if (startDateEl && endDateEl && startDateEl.value && endDateEl.value) {
    const startDate = new Date(startDateEl.value);
    const endDate = new Date(endDateEl.value);
    
    if (startDate > endDate) {
      endDateEl.setCustomValidity('End date must be after start date');
    } else {
      endDateEl.setCustomValidity('');
    }
  }
}