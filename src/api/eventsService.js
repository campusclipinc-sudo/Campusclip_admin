import client from "../libs/HttpClients";

const EventsService = {
    async list(params) {
        const { data } = await client.get("/admin/events/list", { params });
        return data;
    },
    async view(id) {
        const { data } = await client.get(`/admin/events/view/${id}`);
        return data;
    },
    async getAttendees(id, params) {
        const { data } = await client.get(`/admin/events/${id}/attendees`, { params });
        return data;
    },
    async attend(id) {
        const { data } = await client.post(`/admin/events/${id}/attend`);
        return data;
    },
    async getTransactionHistory(params) {
        const { data } = await client.get("/admin/events/transaction-history", { params });
        return data;
    },
};

export default EventsService;