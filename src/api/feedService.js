import client from "../libs/HttpClients";

const FeedService = {
  async listFeed(params) {
    const { data } = await client.get("/admin/feed/list", { params });
    return data;
  },

  async updatePostStatus(postId, status) {
    const { data } = await client.patch(`/admin/feed/update-status/${postId}`, {
      status,
    });
    return data;
  },

  async warnUser(postId, userId, payload) {
    const { data } = await client.post(`/admin/feed/warn-user/${postId}`, {
      user_id: userId,
      ...payload,
    });
    return data;
  },

  async blockUser(userId) {
    const { data } = await client.patch(`/admin/feed/block-user/${userId}`);
    return data;
  },
};

export default FeedService;

