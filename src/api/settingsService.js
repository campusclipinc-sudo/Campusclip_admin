import axios from "../libs/HttpClients";

class SettingsService {

  static async getSettings() {
    const res = await axios.get(`/admin/settings/get`);
    return res.data;
  }

  static async updateSettings(payload) {
    const res = await axios.put(`/admin/settings/update`, payload);
    return res.data;
  }
  // static async getFrontLogo() {
  //   const res = await axios.get(`/admin/settings/logo`);
  //   return res.data;
  // }

  // static async updateFrontLogo(file) {
  //   const form = new FormData();
  //   form.append("logo", file);
  //   const res = await axios.post(`/admin/settings/logo`, form, {
  //     headers: { "Content-Type": "multipart/form-data" },
  //   });
  //   return res.data;
  // }
}

export { SettingsService };
