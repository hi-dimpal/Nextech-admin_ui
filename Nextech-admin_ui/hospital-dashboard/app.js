// /**
//  * Hospital Resource Dashboard — Application Logic
//  * Handles data fetching, UI updates, and dynamic controls.
//  */

// (function () {
//   'use strict';

//   const elements = {
//     lastUpdated: document.getElementById('lastUpdated'),
//     btnRefresh: document.getElementById('btnRefresh'),
//     bedsAvailable: document.getElementById('bedsAvailable'),
//     bedsAllotted: document.getElementById('bedsAllotted'),
//     bedsTotal: document.getElementById('bedsTotal'),
//     bedsProgress: document.getElementById('bedsProgress'),
//     icuAvailable: document.getElementById('icuAvailable'),
//     icuAllotted: document.getElementById('icuAllotted'),
//     ventilatorsAvailable: document.getElementById('ventilatorsAvailable'),
//     ventilatorsAllotted: document.getElementById('ventilatorsAllotted'),
//     icuProgress: document.getElementById('icuProgress'),
//     oxygenCylinders: document.getElementById('oxygenCylinders'),
//     oxygenAllotted: document.getElementById('oxygenAllotted'),
//     oxygenStatus: document.getElementById('oxygenStatus'),
//     oxygenSlider: document.getElementById('oxygenSlider'),
//     ambulanceAvailable: document.getElementById('ambulanceAvailable'),
//     ambulanceEnRoute: document.getElementById('ambulanceEnRoute'),
//     ambulanceTotal: document.getElementById('ambulanceTotal'),
//     bloodAvailable: document.getElementById('bloodAvailable'),
//     bloodAllotted: document.getElementById('bloodAllotted'),
//     bloodTotal: document.getElementById('bloodTotal'),
//     bloodStatus: document.getElementById('bloodStatus'),
//     bloodProgress: document.getElementById('bloodProgress'),
//     distanceValue: document.getElementById('distanceValue'),
//     travelTime: document.getElementById('travelTime'),
//     roadCondition: document.getElementById('roadCondition'),
//     roadDetail: document.getElementById('roadDetail'),
//     weatherTemp: document.getElementById('weatherTemp'),
//     weatherDesc: document.getElementById('weatherDesc'),
//     weatherHumidity: document.getElementById('weatherHumidity'),
//     weatherWind: document.getElementById('weatherWind'),
//     weatherVisibility: document.getElementById('weatherVisibility'),
//   };

//   let refreshTimeout;

//   // Live state for +/- edits (available + allotted = total per resource)
//   let state = {
//     beds: { available: 0, allotted: 0, total: 0 },
//     icu: { available: 0, allotted: 0, total: 0, ventAvail: 0, ventAllot: 0, ventTotal: 0 },
//     oxygen: { available: 0, allotted: 0, total: 0 },
//     ambulance: { available: 0, enRoute: 0, total: 0 },
//     bloodBank: { available: 0, allotted: 0, total: 0 },
//   };

//   function formatTime(date) {
//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//     });
//   }

//   function updateLastUpdated() {
//     elements.lastUpdated.textContent = formatTime(new Date());
//   }

//   function renderBeds(data) {
//     state.beds = { available: data.available, allotted: data.allotted ?? (data.total - data.available), total: data.total };
//     elements.bedsAvailable.textContent = state.beds.available;
//     elements.bedsAllotted.textContent = state.beds.allotted;
//     elements.bedsTotal.textContent = state.beds.total;
//     const pct = state.beds.total > 0 ? Math.round((state.beds.allotted / state.beds.total) * 100) : 0;
//     elements.bedsProgress.style.width = `${Math.min(pct, 100)}%`;
//   }

//   function renderIcu(data) {
//     state.icu = {
//       available: data.bedsAvailable,
//       allotted: data.bedsAllotted ?? (data.bedsTotal - data.bedsAvailable),
//       total: data.bedsTotal,
//       ventAvail: data.ventilatorsAvailable,
//       ventAllot: data.ventilatorsAllotted ?? (data.ventilatorsTotal - data.ventilatorsAvailable),
//       ventTotal: data.ventilatorsTotal ?? (data.ventilatorsAvailable + (data.ventilatorsAllotted || 0)),
//     };
//     elements.icuAvailable.textContent = state.icu.available;
//     elements.icuAllotted.textContent = state.icu.allotted;
//     elements.ventilatorsAvailable.textContent = state.icu.ventAvail;
//     elements.ventilatorsAllotted.textContent = state.icu.ventAllot;
//     const pct = state.icu.total > 0 ? Math.round((state.icu.allotted / state.icu.total) * 100) : 0;
//     elements.icuProgress.style.width = `${Math.min(pct, 100)}%`;
//   }

//   function getOxygenStatusClass(status) {
//     if (status === 'operational') return 'badge--success';
//     if (status === 'limited') return 'badge--warning';
//     return 'badge--danger';
//   }

//   function renderOxygen(data) {
//     state.oxygen = {
//       available: data.cylindersAvailable,
//       allotted: data.cylindersAllotted ?? (data.cylindersTotal - data.cylindersAvailable),
//       total: data.cylindersTotal ?? (data.cylindersAvailable + (data.cylindersAllotted || 0)),
//     };
//     elements.oxygenCylinders.textContent = state.oxygen.available;
//     elements.oxygenAllotted.textContent = state.oxygen.allotted;
//     elements.oxygenStatus.textContent = data.centralSupplyStatus;
//     elements.oxygenStatus.className = `badge ${getOxygenStatusClass(data.centralSupplyStatus)}`;
//     if (elements.oxygenSlider && state.oxygen.total > 0) {
//       elements.oxygenSlider.value = Math.round((state.oxygen.available / state.oxygen.total) * 100);
//     }
//   }

//   function renderAmbulance(data) {
//     state.ambulance = { available: data.available, enRoute: data.enRoute, total: data.total };
//     elements.ambulanceAvailable.textContent = state.ambulance.available;
//     elements.ambulanceEnRoute.textContent = state.ambulance.enRoute;
//     elements.ambulanceTotal.textContent = state.ambulance.total;
//   }

//   function getBloodStatusClass(status) {
//     if (status === 'operational') return 'badge--success';
//     if (status === 'limited') return 'badge--warning';
//     return 'badge--danger';
//   }

//   function renderBloodBank(data) {
//     state.bloodBank = {
//       available: data.unitsAvailable,
//       allotted: data.unitsAllotted ?? (data.total - data.unitsAvailable),
//       total: data.total ?? (data.unitsAvailable + (data.unitsAllotted || 0)),
//     };
//     elements.bloodAvailable.textContent = state.bloodBank.available;
//     elements.bloodAllotted.textContent = state.bloodBank.allotted;
//     elements.bloodTotal.textContent = state.bloodBank.total;
//     updateBloodStatus();
//   }

//   function updateBloodStatus() {
//     if (!state.bloodBank || !elements.bloodStatus) return;
//     const pct = state.bloodBank.total > 0 ? (state.bloodBank.available / state.bloodBank.total) * 100 : 100;
//     let status = 'operational';
//     if (pct < 30) status = 'critical';
//     else if (pct < 60) status = 'limited';
//     elements.bloodStatus.textContent = status;
//     elements.bloodStatus.className = 'badge ' + getBloodStatusClass(status);
//     elements.bloodProgress.style.width = Math.min(pct, 100) + '%';
//   }

//   function updateOxygenStatus() {
//     if (!state.oxygen || !elements.oxygenStatus) return;
//     const pct = state.oxygen.total > 0 ? (state.oxygen.available / state.oxygen.total) * 100 : 100;
//     let status = 'operational';
//     if (pct < 30) status = 'critical';
//     else if (pct < 60) status = 'limited';
//     elements.oxygenStatus.textContent = status;
//     elements.oxygenStatus.className = `badge ${getOxygenStatusClass(status)}`;
//   }

//   function adjustQty(targetId, delta) {
//     const el = document.getElementById(targetId);
//     if (!el) return;

//     if (targetId === 'bedsAvailable') {
//       if (delta > 0 && state.beds.allotted > 0) { state.beds.allotted--; state.beds.available++; }
//       else if (delta < 0 && state.beds.available > 0) { state.beds.available--; state.beds.allotted++; }
//       el.textContent = state.beds.available;
//       elements.bedsAllotted.textContent = state.beds.allotted;
//       const pct = state.beds.total > 0 ? Math.round((state.beds.allotted / state.beds.total) * 100) : 0;
//       elements.bedsProgress.style.width = `${Math.min(pct, 100)}%`;
//     } else if (targetId === 'bedsAllotted') {
//       if (delta > 0 && state.beds.available > 0) { state.beds.available--; state.beds.allotted++; }
//       else if (delta < 0 && state.beds.allotted > 0) { state.beds.allotted--; state.beds.available++; }
//       el.textContent = state.beds.allotted;
//       elements.bedsAvailable.textContent = state.beds.available;
//       const pct = state.beds.total > 0 ? Math.round((state.beds.allotted / state.beds.total) * 100) : 0;
//       elements.bedsProgress.style.width = `${Math.min(pct, 100)}%`;
//     } else if (targetId === 'icuAvailable') {
//       if (delta > 0 && state.icu.allotted > 0) { state.icu.allotted--; state.icu.available++; }
//       else if (delta < 0 && state.icu.available > 0) { state.icu.available--; state.icu.allotted++; }
//       el.textContent = state.icu.available;
//       elements.icuAllotted.textContent = state.icu.allotted;
//       const pct = state.icu.total > 0 ? Math.round((state.icu.allotted / state.icu.total) * 100) : 0;
//       elements.icuProgress.style.width = `${Math.min(pct, 100)}%`;
//     } else if (targetId === 'icuAllotted') {
//       if (delta > 0 && state.icu.available > 0) { state.icu.available--; state.icu.allotted++; }
//       else if (delta < 0 && state.icu.allotted > 0) { state.icu.allotted--; state.icu.available++; }
//       el.textContent = state.icu.allotted;
//       elements.icuAvailable.textContent = state.icu.available;
//       const pct = state.icu.total > 0 ? Math.round((state.icu.allotted / state.icu.total) * 100) : 0;
//       elements.icuProgress.style.width = `${Math.min(pct, 100)}%`;
//     } else if (targetId === 'ventilatorsAvailable') {
//       if (delta > 0 && state.icu.ventAllot > 0) { state.icu.ventAllot--; state.icu.ventAvail++; }
//       else if (delta < 0 && state.icu.ventAvail > 0) { state.icu.ventAvail--; state.icu.ventAllot++; }
//       el.textContent = state.icu.ventAvail;
//       elements.ventilatorsAllotted.textContent = state.icu.ventAllot;
//     } else if (targetId === 'ventilatorsAllotted') {
//       if (delta > 0 && state.icu.ventAvail > 0) { state.icu.ventAvail--; state.icu.ventAllot++; }
//       else if (delta < 0 && state.icu.ventAllot > 0) { state.icu.ventAllot--; state.icu.ventAvail++; }
//       el.textContent = state.icu.ventAllot;
//       elements.ventilatorsAvailable.textContent = state.icu.ventAvail;
//     } else if (targetId === 'oxygenCylinders') {
//       if (delta > 0 && state.oxygen.allotted > 0) { state.oxygen.allotted--; state.oxygen.available++; }
//       else if (delta < 0 && state.oxygen.available > 0) { state.oxygen.available--; state.oxygen.allotted++; }
//       el.textContent = state.oxygen.available;
//       elements.oxygenAllotted.textContent = state.oxygen.allotted;
//       updateOxygenStatus();
//     } else if (targetId === 'oxygenAllotted') {
//       if (delta > 0 && state.oxygen.available > 0) { state.oxygen.available--; state.oxygen.allotted++; }
//       else if (delta < 0 && state.oxygen.allotted > 0) { state.oxygen.allotted--; state.oxygen.available++; }
//       el.textContent = state.oxygen.allotted;
//       elements.oxygenCylinders.textContent = state.oxygen.available;
//       updateOxygenStatus();
//     } else if (targetId === 'ambulanceAvailable') {
//       if (delta > 0 && state.ambulance.enRoute > 0) { state.ambulance.enRoute--; state.ambulance.available++; }
//       else if (delta < 0 && state.ambulance.available > 0) { state.ambulance.available--; state.ambulance.enRoute++; }
//       el.textContent = state.ambulance.available;
//       elements.ambulanceEnRoute.textContent = state.ambulance.enRoute;
//     } else if (targetId === 'ambulanceEnRoute') {
//       if (delta > 0 && state.ambulance.available > 0) { state.ambulance.available--; state.ambulance.enRoute++; }
//       else if (delta < 0 && state.ambulance.enRoute > 0) { state.ambulance.enRoute--; state.ambulance.available++; }
//       el.textContent = state.ambulance.enRoute;
//       elements.ambulanceAvailable.textContent = state.ambulance.available;
//     } else if (targetId === 'bloodAvailable') {
//       if (delta > 0 && state.bloodBank.allotted > 0) { state.bloodBank.allotted--; state.bloodBank.available++; }
//       else if (delta < 0 && state.bloodBank.available > 0) { state.bloodBank.available--; state.bloodBank.allotted++; }
//       el.textContent = state.bloodBank.available;
//       elements.bloodAllotted.textContent = state.bloodBank.allotted;
//       updateBloodStatus();
//     } else if (targetId === 'bloodAllotted') {
//       if (delta > 0 && state.bloodBank.available > 0) { state.bloodBank.available--; state.bloodBank.allotted++; }
//       else if (delta < 0 && state.bloodBank.allotted > 0) { state.bloodBank.allotted--; state.bloodBank.available++; }
//       el.textContent = state.bloodBank.allotted;
//       elements.bloodAvailable.textContent = state.bloodBank.available;
//       updateBloodStatus();
//     }

//     updateLastUpdated();
//   }

//   function initQtyButtons() {
//     document.querySelectorAll('.btn-qty').forEach(function (btn) {
//       btn.addEventListener('click', function () {
//         const action = this.getAttribute('data-action');
//         const target = this.getAttribute('data-target');
//         const delta = action === 'inc' ? 1 : -1;
//         adjustQty(target, delta);
//       });
//     });
//   }

//   function renderDistance(data) {
//     elements.distanceValue.textContent = `${data.km} km`;
//     elements.travelTime.textContent = `${data.travelTimeMinutes} min`;
//   }

//   function renderRoadConditions(data) {
//     const indicator = elements.roadCondition.querySelector('.road-indicator');
//     const label = elements.roadCondition.querySelector('.road-label');
//     if (indicator) {
//       indicator.className = `road-indicator road-indicator--${data.status}`;
//     }
//     if (label) {
//       label.textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
//     }
//     elements.roadDetail.textContent = data.description;
//   }

//   function renderWeather(data) {
//     elements.weatherTemp.textContent = `${data.temp}°C`;
//     elements.weatherDesc.textContent = data.description;
//     elements.weatherHumidity.textContent = `${data.humidity}%`;
//     elements.weatherWind.textContent = `${data.windSpeed} ${data.windUnit || 'km/h'}`;
//     elements.weatherVisibility.textContent = data.visibility;
//   }

//   async function refresh(fullRefresh) {
//     if (fullRefresh) {
//       elements.btnRefresh.disabled = true;
//       elements.btnRefresh.textContent = 'Refreshing…';
//     }

//     try {
//       if (fullRefresh) {
//         const [beds, icu, oxygen, ambulance, bloodBank, distance, roads, weather] = await Promise.all([
//           API.getBeds(),
//           API.getIcu(),
//           API.getOxygen(),
//           API.getAmbulance(),
//           API.getBloodBank(),
//           API.getDistance(),
//           API.getRoadConditions(),
//           API.getWeather(),
//         ]);
//         renderBeds(beds);
//         renderIcu(icu);
//         renderOxygen(oxygen);
//         renderAmbulance(ambulance);
//         renderBloodBank(bloodBank);
//         renderDistance(distance);
//         renderRoadConditions(roads);
//         renderWeather(weather);
//       } else {
//         // Auto-refresh: only update external data, preserve manual +/- edits on resource cards
//         const [distance, roads, weather] = await Promise.all([
//           API.getDistance(),
//           API.getRoadConditions(),
//           API.getWeather(),
//         ]);
//         renderDistance(distance);
//         renderRoadConditions(roads);
//         renderWeather(weather);
//       }

//       updateLastUpdated();
//     } catch (err) {
//       console.error('Dashboard refresh failed:', err);
//     } finally {
//       if (fullRefresh && elements.btnRefresh) {
//         elements.btnRefresh.disabled = false;
//         elements.btnRefresh.innerHTML =
//           '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg> Refresh';
//       }
//     }
//   }

//   function initOxygenSlider() {
//     const slider = elements.oxygenSlider;
//     if (!slider) return;

//     slider.addEventListener('input', function () {
//       const val = parseInt(this.value, 10);
//       const total = state.oxygen.total || 50;
//       state.oxygen.available = Math.round((val / 100) * total);
//       state.oxygen.allotted = total - state.oxygen.available;
//       elements.oxygenCylinders.textContent = state.oxygen.available;
//       elements.oxygenAllotted.textContent = state.oxygen.allotted;
//       updateOxygenStatus();
//     });
//   }

//   function initRefreshButton() {
//     if (elements.btnRefresh) {
//       elements.btnRefresh.addEventListener('click', function () { refresh(false); });
//     }
//   }

//   function initAutoRefresh() {
//     if (typeof CONFIG !== 'undefined' && CONFIG.refreshInterval) {
//       refreshTimeout = setInterval(function () { refresh(false); }, CONFIG.refreshInterval);
//     }
//   }

//   function init() {
//     initQtyButtons();
//     initOxygenSlider();
//     initRefreshButton();
//     refresh(true);
//     initAutoRefresh();
//   }

//   if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', init);
//   } else {
//     init();
//   }
// })();


/**
 * Hospital Resource Dashboard — Application Logic
 */

(function () {
  'use strict';

  const API_BASE = CONFIG.apis.backend.baseUrl;

  const elements = {
    lastUpdated: document.getElementById('lastUpdated'),
    btnRefresh: document.getElementById('btnRefresh'),
    btnSave: document.getElementById('btnSave'),

    bedsAvailable: document.getElementById('bedsAvailable'),
    bedsAllotted: document.getElementById('bedsAllotted'),
    bedsTotal: document.getElementById('bedsTotal'),
    bedsProgress: document.getElementById('bedsProgress'),

    icuAvailable: document.getElementById('icuAvailable'),
    icuAllotted: document.getElementById('icuAllotted'),
    ventilatorsAvailable: document.getElementById('ventilatorsAvailable'),
    ventilatorsAllotted: document.getElementById('ventilatorsAllotted'),
    icuProgress: document.getElementById('icuProgress'),

    oxygenCylinders: document.getElementById('oxygenCylinders'),
    oxygenAllotted: document.getElementById('oxygenAllotted'),
    oxygenStatus: document.getElementById('oxygenStatus'),

    ambulanceAvailable: document.getElementById('ambulanceAvailable'),
    ambulanceEnRoute: document.getElementById('ambulanceEnRoute'),
    ambulanceTotal: document.getElementById('ambulanceTotal'),

    bloodAvailable: document.getElementById('bloodAvailable'),
    bloodAllotted: document.getElementById('bloodAllotted'),
    bloodTotal: document.getElementById('bloodTotal'),
    bloodStatus: document.getElementById('bloodStatus'),
    bloodProgress: document.getElementById('bloodProgress')
  };

  let state = {
    beds: { available: 0, allotted: 0, total: 0 },
    icu: { available: 0, allotted: 0, total: 0, ventAvail: 0, ventAllot: 0 },
    oxygen: { available: 0, allotted: 0, total: 0 },
    ambulance: { available: 0, enRoute: 0, total: 0 },
    blood: { available: 0, allotted: 0, total: 0 }
  };

  function getToken() {
    return localStorage.getItem("token");
  }

  function formatTime() {
    return new Date().toLocaleTimeString();
  }

  function updateLastUpdated() {
    if (elements.lastUpdated) {
      elements.lastUpdated.textContent = formatTime();
    }
  }

  // ================= LOAD HOSPITAL =================

  async function loadHospital() {
    const response = await fetch(API_BASE + "/hospital/me", {
      headers: {
        "Authorization": "Bearer " + getToken()
      }
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    const hospital = await response.json();

    // Map backend → frontend state
    state.beds.available = hospital.bedsAvailable;
    state.beds.allotted = 0;
    state.beds.total = hospital.bedsAvailable;

    state.icu.available = hospital.icuAvailable ? 1 : 0;
    state.icu.allotted = 0;
    state.icu.total = state.icu.available;
    state.icu.ventAvail = hospital.ventilatorCount;
    state.icu.ventAllot = 0;

    state.oxygen.available = hospital.oxygenCylinderAvailable ? 10 : 0;
    state.oxygen.allotted = 0;
    state.oxygen.total = state.oxygen.available;

    state.ambulance.available = hospital.ambulanceAvailable ? 1 : 0;
    state.ambulance.enRoute = 0;
    state.ambulance.total = state.ambulance.available;

    state.blood.available = hospital.bloodBankAvailable ? 10 : 0;
    state.blood.allotted = 0;
    state.blood.total = state.blood.available;

    renderAll();
  }

  // ================= SAVE =================

  async function saveHospital() {
    const response = await fetch(API_BASE + "/hospital/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
      },
      body: JSON.stringify({
        bedsAvailable: state.beds.available,
        ventilatorCount: state.icu.ventAvail,
        icuAvailable: state.icu.available > 0,
        oxygenCylinderAvailable: state.oxygen.available > 0,
        bloodBankAvailable: state.blood.available > 0,
        ambulanceAvailable: state.ambulance.available > 0
      })
    });

    if (!response.ok) {
      alert("Save failed ❌");
      return;
    }

    alert("Saved successfully ✅");
    updateLastUpdated();
  }

  // ================= RENDER =================

  function renderAll() {
    elements.bedsAvailable.textContent = state.beds.available;
    elements.bedsAllotted.textContent = state.beds.allotted;
    elements.bedsTotal.textContent = state.beds.total;

    elements.icuAvailable.textContent = state.icu.available;
    elements.icuAllotted.textContent = state.icu.allotted;
    elements.ventilatorsAvailable.textContent = state.icu.ventAvail;
    elements.ventilatorsAllotted.textContent = state.icu.ventAllot;

    elements.oxygenCylinders.textContent = state.oxygen.available;
    elements.oxygenAllotted.textContent = state.oxygen.allotted;

    elements.ambulanceAvailable.textContent = state.ambulance.available;
    elements.ambulanceEnRoute.textContent = state.ambulance.enRoute;
    elements.ambulanceTotal.textContent = state.ambulance.total;

    elements.bloodAvailable.textContent = state.blood.available;
    elements.bloodAllotted.textContent = state.blood.allotted;
    elements.bloodTotal.textContent = state.blood.total;
  }

  // ================= +/- BUTTONS =================

  function adjust(id, delta) {
    if (state.beds.hasOwnProperty(id)) {
      state.beds[id] = Math.max(0, state.beds[id] + delta);
    }
    renderAll();
    updateLastUpdated();
  }

  document.querySelectorAll('.btn-qty').forEach(btn => {
    btn.addEventListener('click', function () {
      const target = this.getAttribute('data-target');
      const action = this.getAttribute('data-action');
      const delta = action === "inc" ? 1 : -1;

      if (target === "bedsAvailable") {
        state.beds.available = Math.max(0, state.beds.available + delta);
      }

      if (target === "ventilatorsAvailable") {
        state.icu.ventAvail = Math.max(0, state.icu.ventAvail + delta);
      }

      renderAll();
      updateLastUpdated();
    });
  });

  // ================= INIT =================

  function init() {
    if (elements.btnSave) {
      elements.btnSave.addEventListener("click", saveHospital);
    }

    if (elements.btnRefresh) {
      elements.btnRefresh.addEventListener("click", loadHospital);
    }

    loadHospital();
  }

  document.addEventListener("DOMContentLoaded", init);

})();