import axios, { AxiosInstance } from 'axios';

import { useDispatch } from 'react-redux';
import { clearSession } from '../features/authSlice';
import SessionService from './SessionService';

class ApiService {
  private apiService: AxiosInstance;
  private token: any = new SessionService().getAuthToken();
  private dispatch = useDispatch();

  endpoints = {
    login: "/Login",
    logout: "",
    userinfo: "/userinfo",
    ebix: "/Ebix/",
    apolice: "/Apolice/",
    Proposta: "/Proposta/",
    fluxoTela: "/FluxoTela/"

  };


  limparSession() {
    this.dispatch(clearSession())
  }

  constructor(baseURL: string, forceToken: boolean = true) {
    this.apiService = axios.create({
      baseURL: baseURL,
      timeout: 1000000000,
    });

    this.apiService.interceptors.request.use(
      (config) => {
        config.headers['Accept'] = '*/*';

        if (forceToken && this.token) {
          config.headers["Authorization"] = `Bearer ${this.token.accessToken}`;
        }

        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    this.apiService.interceptors.response.use(
      (response: any) => {
        
        return response
      },
      async (error: any) => {
        if (error.response?.data?.statusCode === 401) {

          const event = new CustomEvent("alertMessage", {
            detail: {
              type: "info",
              title: "Sessão Expirada",
              message: "Sua sessão expirou. Por favor, faça o login novamente para continuar.",
            }
          });

          document.dispatchEvent(event)

          this.limparSession();
          return Promise.reject(error);

        }


        return Promise.reject(error);
      }
    );


    // this.apiService.defaults.headers.get['Content-Type'] = 'application/json';
    // this.apiService.defaults.headers.post['Content-Type'] = 'application/json';
    // this.apiService.defaults.headers.put['Content-Type'] = 'application/json';
  }

  // Métodos para os verbos HTTP GET, POST, DELETE e PUT
  get(endpoint: string, config = {}) {

    return this.apiService.get(endpoint, config);
  }

  post(endpoint: string, data: any, config = {}) {
    return this.apiService.post(endpoint, data, config);
  }

  remove(endpoint: string, config = {}) {
    return this.apiService.delete(endpoint, config);
  }

  put(endpoint: string, data: any, config = {}) {
    return this.apiService.put(endpoint, data, config);
  }
}

export default ApiService;
