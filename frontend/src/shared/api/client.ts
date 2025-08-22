import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

export const API_BASE = String(process.env.BACKEND_URL) + 'api' 

export const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type:': 'application/json'
    },
    timeout: 10000
})