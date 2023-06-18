import axios, { Axios } from "axios";

export const api = axios.create({
  baseURL: "/api",
});
