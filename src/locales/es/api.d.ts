declare const _default: {
  response: {
    auth: {
      login_success: string;
    };
    general: {
      operation_success: string;
    };
  };
  error: {
    general: {
      internal_server_error: string;
      not_found: string;
    };
    auth: {
      invalid_credentials: string;
      unauthorized: string;
      forbidden: string;
    };
    validation: {
      validation_error: string;
      password_too_short: string;
      email_invalid: string;
    };
  };
};
export default _default;
