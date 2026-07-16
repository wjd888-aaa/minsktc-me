import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000
})

export function getItems(params) { return client.get('/items', { params }) }
export function getItem(id) { return client.get(`/items/${id}`) }
export function createItem(data) { return client.post('/items', data) }
export function getCategories() { return client.get('/categories') }
export function deleteItem(id, token) { return client.delete(`/items/${id}?token=${token}`) }

export default client
