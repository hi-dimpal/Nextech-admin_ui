(function () {
  'use strict';

  const AUTH_KEY = 'hospital_dashboard_auth';
  const API_BASE = "http://localhost:8080";

  function isLoggedIn() {
    return !!sessionStorage.getItem(AUTH_KEY);
  }

  function setLoggedIn(loginId) {
    sessionStorage.setItem(AUTH_KEY, loginId);
  }

  function logout() {
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("hospitalid");
    localStorage.removeItem("name");
  }

  function checkAuth() {
    const path = (window.location.pathname || window.location.href);
    const isLoginPage = path.includes('login');

    if (isLoginPage && isLoggedIn()) {
      window.location.href = 'index.html';
      return false;
    }
    if (!isLoginPage && !isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  function initLogin() {
    const form = document.getElementById('loginForm');
    const errorEl = document.getElementById('loginError');
    const btnLogin = document.getElementById('btnLogin');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      errorEl.textContent = '';
      btnLogin.disabled = true;
      btnLogin.textContent = 'Logging in…';

      const loginId = (form.loginId.value || '').trim();
      const password = (form.password.value || '').trim();

      if (!loginId || !password) {
        errorEl.textContent = 'Please enter Login ID and password.';
        btnLogin.disabled = false;
        btnLogin.textContent = 'Login';
        return;
      }

      try {

        const response = await fetch(API_BASE + "/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            hospitalid: loginId,
            password: password
          })
        });

        if (!response.ok) {
          throw new Error("Invalid credentials");
        }

        const data = await response.json();

        // Store backend data
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("hospitalid", data.hospitalid);
        localStorage.setItem("name", data.name);

        setLoggedIn(loginId);

        window.location.href = 'index.html';

      } catch (err) {
        errorEl.textContent = 'Login failed. Please check credentials.';
        btnLogin.disabled = false;
        btnLogin.textContent = 'Login';
      }
    });
  }

  function initLogout() {
    const btn = document.getElementById('btnLogout');
    if (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        logout();
        window.location.href = 'login.html';
      });
    }
  }

  function init() {
    if (!checkAuth()) return;
    if (document.getElementById('loginForm')) {
      initLogin();
    } else {
      initLogout();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.Auth = { isLoggedIn, logout, checkAuth };
})();