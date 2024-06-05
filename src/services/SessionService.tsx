import { useSelector } from 'react-redux';

class SessionService {
  constructor() {}

  getSession(): any {
    return useSelector((state: any) => state.auth); 
  }

  getAuthToken(): any {
    return useSelector((state: any) => state.auth?.token); 
  }

  getUserInfo(): any {
    return useSelector((state: any) => state.auth?.userInfo); 
  }


}

export default SessionService;
