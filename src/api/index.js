import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export function getItems(params) { return client.get('/items', { params }) }
export function getItem(id) { return client.get(`/items/${id}`) }
export function createItem(data) { return client.post('/items', data) }
export function deleteItem(id, phone) { return client.delete(`/items/${id}?phone=${encodeURIComponent(phone)}`) }
export function updateItem(id, data) { return client.patch(`/items/${id}`, data) }
export function getCategories() { return client.get('/categories') }
export function getComments(itemId) { return client.get(`/items/${itemId}/comments`) }
export function createComment(itemId, data) { return client.post(`/items/${itemId}/comments`, data) }

export default client
