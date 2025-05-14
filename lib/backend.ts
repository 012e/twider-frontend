import { BaseAPI } from "./api/base";
import apiClient from "./app-axios";

const backend = new BaseAPI(undefined, undefined, apiClient);

export default backend;
