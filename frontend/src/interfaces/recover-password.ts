export interface SendRecoverEmailResponse {
  data: {
    executed: boolean
  }
}

export interface SendRecoverCodeResponse {
  data: {
    isValid: boolean
    token: string
  }
}

export interface RecoverPasswordResponse {
  data: {
    executed: boolean
  }
}

