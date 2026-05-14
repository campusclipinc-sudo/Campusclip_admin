import client from "../libs/HttpClients";

const StudentService = {
  async listStudents(params) {
    const { data } = await client.get("/admin/students/list", { params });
    return data;
  },

  async getStudent(id) {
    const { data } = await client.get(`/admin/students/view/${id}`);
    return data;
  },

  async updateStudent(id, payload) {
    const { data } = await client.put(`/admin/students/update/${id}`, payload);
    return data;
  },

  async toggleAdminStatus(id, status) {
    const { data } = await client.patch(`/admin/students/update-status/${id}`, {
      status,
    });
    return data;
  },

  async createStudent() {
    return Promise.reject(new Error("Create student is not supported by API"));
  },

  async deleteStudent(id) {
    const { data } = await client.delete(`/admin/students/delete/${id}`);
    return data;
  },

  async bulkDeleteStudents(ids) {
    const { data } = await client.delete(`/admin/students/delete-multiple`, { data: { ids } });
    return data;
  },

  async getStudentPosts(id, params) {
    const { data } = await client.get(`/admin/students/${id}/get-posts`, { params });
    return data;
  },

  async getStudentClasses(id, params) {
    const { data } = await client.get(`/admin/students/${id}/get-classes`, { params });
    return data;
  },

  async getStudentClubs(id, params) {
    const { data } = await client.get(`/admin/students/${id}/get-clubs`, { params });
    return data;
  },

  async exportStudents(studentIds) {
    try {
      const response = await client.post(
        "/download",
        {
          entityType: "student",
          ids: studentIds,
          title: "Students List",
          filename: `students_export_${new Date().toISOString().split("T")[0]}.csv`,
        },
        {
          responseType: "blob", // Important for file downloads
        }
      );

      // Create blob and download
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `students_export_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  async exportStudentDetails(studentId) {
    try {
      const response = await client.post(
        "/download",
        {
          entityType: "student",
          ids: [studentId],
          includeDetails: true, // Flag to include all details
          title: "Student Details",
          filename: `student_details_${studentId}_${new Date().toISOString().split("T")[0]}.csv`,
        },
        {
          responseType: "blob", // Important for file downloads
        }
      );

      // Create blob and download
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `student_details_${studentId}_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      throw error;
    }
  },
};

export default StudentService;
