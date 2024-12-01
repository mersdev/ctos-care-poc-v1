import freelanceData from "../mock/freelance.json";

export interface JobMarketData {
  projectId: number;
  job_title: string;
  job_description: string;
  tags: string[];
  client_state?: string;
  client_average_rating?: string;
  client_review_count?: string;
  min_price?: string;
  max_price?: string;
  avg_price?: string;
}

const normalizeJobData = (data: any[]): JobMarketData[] => {
  return data.map(job => ({
    ...job,
    tags: Array.isArray(job.tags) 
      ? job.tags 
      : typeof job.tags === 'string'
        ? JSON.parse(job.tags.replace(/'/g, '"'))
        : []
  }));
};

export const fetchJobMarketData = async (): Promise<JobMarketData[]> => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return normalizeJobData(freelanceData.data);
  } catch (error) {
    console.error("Error fetching job market data:", error);
    throw error;
  }
};
