/**
 * Notifications page logic
 */

(function () {
  'use strict';

  const ICONS = {
    alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  };

  const FALLBACK = [
    { id: '1', title: 'Low ICU availability', detail: 'ICU beds available: 2. Consider reviewing patient admissions.', type: 'alert', time: '10 min ago', read: false },
    { id: '2', title: 'Ambulance dispatched', detail: 'Ambulance #02 en route to pickup location. ETA 12 min.', type: 'info', time: '25 min ago', read: false },
    { id: '3', title: 'Oxygen stock replenished', detail: '20 new cylinders received. Total available: 48.', type: 'success', time: '1 hour ago', read: false },
  ];

  function render(listEl, items) {
    if (!listEl) return;
    listEl.innerHTML = items.map(function (n) {
      const cls = n.read ? 'notification-item' : 'notification-item notification-item--unread';
      const iconCls = 'notification-icon notification-icon--' + (n.type || 'info');
      return '<li class="' + cls + '">' +
        '<div class="' + iconCls + '">' + (ICONS[n.type] || ICONS.info) + '</div>' +
        '<div class="notification-body">' +
          '<p class="notification-title">' + (n.title || '') + '</p>' +
          '<p class="notification-detail">' + (n.detail || '') + '</p>' +
          '<span class="notification-time">' + (n.time || '') + '</span>' +
        '</div></li>';
    }).join('');
  }

  function init() {
    const btnMarkRead = document.getElementById('btnMarkRead');
    const list = document.getElementById('notificationList');

    render(list, FALLBACK);

    if (btnMarkRead && list) {
      btnMarkRead.addEventListener('click', function () {
        list.querySelectorAll('.notification-item').forEach(function (item) {
          item.classList.remove('notification-item--unread');
        });
        btnMarkRead.textContent = 'All marked as read';
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
