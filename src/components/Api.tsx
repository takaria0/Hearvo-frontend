import axios from 'axios';
import { getJwt } from '../helpers/jwt';

const API_HOST = process.env.REACT_APP_API_HOST;
const ALLOW_ORIGIN = process.env.REACT_APP_ALLOW_ORIGIN;
// axios =
// instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
const jwt = getJwt();
export default axios.create({
  baseURL: API_HOST,
});