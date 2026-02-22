const CONFIG = {
  apis: {
    backend: {
      baseUrl: "http://159.69.50.201:8081"
    }
  },
  refreshInterval: 30000
};

const API = {

  async getHospital() {
    const token = localStorage.getItem("token");

    const response = await fetch(
      CONFIG.apis.backend.baseUrl + "/hospital/me",
      {
        headers: {
          "Authorization": "Bearer " + token
        }
      }
    );

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    return await response.json();
  },

  async getBeds() {
    const hospital = await this.getHospital();
    return {
      available: hospital.bedsAvailable,
      allotted: 0,
      total: hospital.bedsAvailable
    };
  },

  async getIcu() {
    const hospital = await this.getHospital();
    return {
      bedsAvailable: hospital.icuAvailable ? 1 : 0,
      bedsAllotted: 0,
      bedsTotal: hospital.icuAvailable ? 1 : 0,
      ventilatorsAvailable: hospital.ventilatorCount,
      ventilatorsAllotted: 0,
      ventilatorsTotal: hospital.ventilatorCount
    };
  },

  async getOxygen() {
    const hospital = await this.getHospital();
    return {
      cylindersAvailable: hospital.oxygenCylinderAvailable ? 10 : 0,
      cylindersAllotted: 0,
      cylindersTotal: hospital.oxygenCylinderAvailable ? 10 : 0,
      centralSupplyStatus: hospital.oxygenCylinderAvailable ? "operational" : "critical"
    };
  },

  async getAmbulance() {
    const hospital = await this.getHospital();
    return {
      available: hospital.ambulanceAvailable ? 1 : 0,
      enRoute: 0,
      total: hospital.ambulanceAvailable ? 1 : 0
    };
  },

  async getBloodBank() {
    const hospital = await this.getHospital();
    return {
      unitsAvailable: hospital.bloodBankAvailable ? 10 : 0,
      unitsAllotted: 0,
      total: hospital.bloodBankAvailable ? 10 : 0,
      status: hospital.bloodBankAvailable ? "operational" : "critical"
    };
  },

  // fallback APIs (so dashboard doesn't crash)
  async getDistance() {
    return { km: 0, travelTimeMinutes: 0 };
  },

  async getRoadConditions() {
    return { status: "flowing", description: "No traffic data" };
  },

  async getWeather() {
    return {
      temp: 0,
      description: "N/A",
      humidity: 0,
      windSpeed: 0,
      visibility: "N/A"
    };
  }

};

// expose globally
window.CONFIG = CONFIG;
window.API = API;