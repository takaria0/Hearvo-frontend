import axios from 'axios';


const API_HOST = process.env.REACT_APP_API_HOST;
const ALLOW_ORIGIN = process.env.REACT_APP_ALLOW_ORIGIN;

export default axios.create({
  baseURL: API_HOST,
  headers: { 'Access-Control-Allow-Origin': ALLOW_ORIGIN }
});