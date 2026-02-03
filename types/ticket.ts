export interface Ticket {
  _id: string;
  ticketId?: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in progress" | "resolved" | "closed";
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface TicketListResponse {
  success: boolean;
  data: {
    tickets: Ticket[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalDocs: number;
      pageSize: number;
    };
  };
  message?: string;
}
