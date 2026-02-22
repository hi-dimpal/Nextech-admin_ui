(function () {
  'use strict';

  var BLOOD_GROUPS = [
    { id: 'A+', available: true },
    { id: 'A-', available: false },
    { id: 'B+', available: true },
    { id: 'B-', available: true },
    { id: 'AB+', available: false },
    { id: 'AB-', available: false },
    { id: 'O+', available: true },
    { id: 'O-', available: true },
  ];

  function render(listEl) {
    if (!listEl) return;
    var html = BLOOD_GROUPS.map(function (bg) {
      var status = bg.available ? 'Available' : 'Not Available';
      var statusClass = bg.available ? 'status-available' : 'status-unavailable';
      return '<tr><td class="bloodgroup-name">' + bg.id + '</td><td><span class="' + statusClass + '">' + status + '</span></td></tr>';
    }).join('');
    listEl.innerHTML = html;
  }

  function init() {
    var list = document.getElementById('bloodGroupList');
    render(list);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
