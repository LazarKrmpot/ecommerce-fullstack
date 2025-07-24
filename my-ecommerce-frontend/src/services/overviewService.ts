import api from "./api";

export const getOverview = async () => {
  try {
    const { data } = await api.get("/dashboard/overview");
    return data.data;
  } catch (error) {
    console.error("Error fetching overview data:", error);
    throw error;
  }
};
export const getAnalytics = async () => {
  try {
    const { data } = await api.get("/dashboard/analytics");
    return data.data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};
