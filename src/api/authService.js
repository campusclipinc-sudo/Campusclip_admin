import axios from "../libs/HttpClients";
class UserService {
  static async login(request) {
    const data = await axios.post(`/admin/auth/login`, request);
    return data.data;
  }

  static async register(request) {
    const data = await axios.post(`/admin/auth/register`, request);
    return data.data;
  }

  static async getProfile() {
    const data = await axios.get(`/admin/auth/get-profile`);
    return data.data;
  }

  static async changePassword(request) {
    const data = await axios.put(`/admin/auth/change-password`, request);
    return data.data;
  }

  static async editProfile(request) {
    const data = await axios.put(`/admin/auth/edit-profile`, request);
    return data.data;
  }

  static async countryCodes() {
    const data = await axios.get(`/admin/auth/country-codes`);
    return data.data;
  }
}

export { UserService };
