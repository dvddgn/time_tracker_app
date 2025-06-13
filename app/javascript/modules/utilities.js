// Prevent FOUC by making HTML visible after CSS loads
export function initializeFOUCPrevention() {
  document.documentElement.classList.add('loaded');
}

// Mobile sidebar toggle functionality
export function initializeMobileSidebar() {
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