const API_BASE = import.meta.env.VITE_API_BASE;

async function request(path, options = {}) {

    const res = await fetch(`${API_BASE}${path}`, {

        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...options,

    })

    const data = await res.json().catch(()=> null);

    if(!res.ok){
        throw new Error(data?.error ||`Request failed (${res.status})`);
    }

    return data;

}


export const api = {
  signup: (body) => request('/auth/signup', { method: 'POST', body: JSON.stringify(body) }),

  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  logout: () => request('/auth/logout', { method: 'POST' }),

  me: () => request('/auth/me'),
 
  createChannel: (body) => request('/channels', { method: 'POST', body: JSON.stringify(body) }),

  getMyChannel: () => request('/channels/me'),

  updateMyChannel: (body) =>
    request('/channels/update', { method: 'PATCH', body: JSON.stringify(body) }),

  regenerateStreamKey: () => request('/channels/me/regenerate-key', { method: 'POST' }),

  getPublicChannel: (channelName) => request(`/channels/${channelName}`),
  
  listChannels: (liveOnly = false) => request(`/channels${liveOnly ? '?live=true' : ''}`),
}