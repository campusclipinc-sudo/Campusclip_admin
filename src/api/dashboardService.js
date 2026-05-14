import client from "../libs/HttpClients";

const DashboardService = {
  async getDashboardCounts() {
    const { data } = await client.get("/admin/dashboard-counts");
    return data;
  },
};

export default DashboardService;

