import axios from "axios";



const BASE_URL = "http://localhost:8080/api/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  // headers: {
  //   mode: "no-cors",
  //   "Cache-Control": "no-cache",
  //   Accept: "application/json",

  //   "Content-Type": "application/json;charset=utf-8",
    
  // },
});


// Exemplo de função para realizar uma requisição GET
const get = async (url: any) => {
  try {
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro na requisição GET:", error);
    throw error;
  }
};

// Exemplo de função para realizar uma requisição POST
const post = async (url: any, data: any) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Erro na requisição POST:", error);
    throw error;
  }
};

// Exemplo de função para realizar uma requisição PUT
const put = async (url: any, data: any) => {
  try {
    const response = await axiosInstance.put(url, data);
    return response.data;
  } catch (error) {
    console.error("Erro na requisição PUT:", error);
    throw error;
  }
};

// Exemplo de função para realizar uma requisição DELETE
const remove = async (url: any) => {
  try {
    const response = await axiosInstance.delete(url);
    return response.data;
  } catch (error) {
    console.error("Erro na requisição DELETE:", error);
    throw error;
  }
};

export { get, post, put, remove };
