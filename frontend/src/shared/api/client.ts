import axios from 'axios'

export const API_BASE = 'http://localhost:7812' + 'api' 

export const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})