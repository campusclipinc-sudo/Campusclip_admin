import client from "../libs/HttpClients";

const AssignmentService = {
  async listAssignments(classId, params = {}) {
    const { data } = await client.get(`admin/assignment/class/${classId}`, { params });
    return data;
  },

  async getAssignmentById(id) {
    const { data } = await client.get(`admin/assignment/${id}`);
    return data;
  },

  async createAssignment(payload) {
    const { data } = await client.post("admin/assignment", payload);
    return data;
  },

  async updateAssignment(payload) {
    const { data } = await client.put("admin/assignment", payload);
    return data;
  },

  async deleteAssignment(id) {
    const { data } = await client.delete(`admin/assignment/${id}`);
    return data;
  },
};

export default AssignmentService;

