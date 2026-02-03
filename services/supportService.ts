import { apiFetch } from "./api";
import { getToken } from "./getToken";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createSupportTicket(
  data: FormData | Record<string, any>,
) {
  const token = await getToken(); // Assume this function retrieves the auth token
  const response = `${API_BASE}/ticket`;

  // When sending FormData, `apiFetch` will avoid setting Content-Type
  return await apiFetch<any>(response, {
    method: "POST",
    body: data,
    token: token || undefined,
  });
}
//get all tickets for user page, limit and status (optional)
export async function getUserSupportTickets(
  limit: number,
  page: number,
  status?: string,
) {
  const token = await getToken();
  let url = new URL(`${API_BASE}/ticket`);
  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("page", page.toString());
  if (status) {
    url.searchParams.append("status", status);
  }
  const response = await apiFetch<any>(url.toString(), {
    method: "GET",
    token: token || undefined,
  });
  return response;
}

//get ticket by id
export async function getSupportTicket(ticketId: string) {
  const token = await getToken();
  const response = `${API_BASE}/ticket/${ticketId}`;
  return await apiFetch<any>(response, {
    method: "GET",
    token: token || undefined,
  });
}

export async function getSupportTicketbyId(ticketId: string) {
  const token = await getToken();
  const response = `${API_BASE}/ticket/by-id/${ticketId}`;
  return await apiFetch<any>(response, {
    method: "GET",
    token: token || undefined,
  });
}

// Add response to ticket
export async function addTicketResponse(
  ticketId: string,
  data: FormData | { message: string; attachments?: File[] },
) {
  const token = await getToken();
  const response = `${API_BASE}/ticket/${ticketId}/respond`;
  return await apiFetch<any>(response, {
    method: "POST",
    body: data,
    token: token || undefined,
  });
}
