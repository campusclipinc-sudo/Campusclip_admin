import client from "../libs/HttpClients";

const ClubService = {
  async listClubs(params) {
    const { data } = await client.get("/admin/clubs/list", { params });
    return data;
  },

  async viewClub(id) {
    const { data } = await client.get(`/admin/clubs/view/${id}`);
    return data;
  },

  async editClub(id, payload) {
    const { data } = await client.put(`/admin/clubs/edit/${id}`, payload);
    return data;
  },

  async deleteClub(id) {
    const { data } = await client.delete(`/admin/clubs/remove/${id}`);
    return data;
  },

  async listCategories() {
    const { data } = await client.get(`/admin/clubs/categories`);
    return data;
  },

  async getClubPosts(id, params) {
    const { data } = await client.get(`/admin/clubs/posts/${id}`, { params });
    return data;
  },

  async getClubMembers(id, params) {
    const { data } = await client.get(`/admin/clubs/members/${id}`, { params });
    return data;
  },

  async getClubEvents(id, params) {
    const { data } = await client.get(`/admin/clubs/events/${id}`, { params });
    return data;
  },

  async getClubChatMessages(id, params) {
    const { data } = await client.get(`/admin/clubs/chat-messages/${id}`, { params });
    return data;
  },

  async sendClubChatMessage(id, payload) {
    const { data } = await client.post(`/admin/clubs/send-chat-message/${id}`, payload);
    return data;
  },
};

export default ClubService;
