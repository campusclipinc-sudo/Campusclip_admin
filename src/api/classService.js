import client from "../libs/HttpClients";

const ClassService = {
  async listClasses() {
    const { data } = await client.get("admin/classroom/list");
    return data;
  },

  async getClassById(id) {
    const { data } = await client.get(`admin/classroom/${id}`);
    return data;
  },

  async createClass(payload) {
    const { data } = await client.post("admin/classroom/create", payload);
    return data;
  },

  async updateClass(id, payload) {
    const { data } = await client.put(`admin/classroom/update/${id}`, payload);
    return data;
  },

  async deleteClass(id) {
    const { data } = await client.delete(`admin/classroom/${id}`);
    return data;
  },

  async getClassChatMessages(id, params) {
    const { data } = await client.get(`admin/chat/group/class/${id}`, { params });
    return data;
  },

  async sendClassChatMessage(id, payload) {
    const { data } = await client.post(`admin/chat/send`, payload);
    return data;
  },

  async getClassMembers(id, params) {
    const { data } = await client.get(`admin/classroom/${id}/members`, { params });
    return data;
  },
};

export default ClassService;
