import {LoginRequest, LoginResponse, LoginResponseData} from "../../auth/login";

const loginRequest: LoginRequest = {
  email: '',
  password: ''
}

const emptyLoginResponseData: LoginResponseData = {
  token: "",
  logged: false
};

const emptyLoginResponse: LoginResponse = {
  data: {
    token: "",
    logged: false
  },
  message: ""
};
