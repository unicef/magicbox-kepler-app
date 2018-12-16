module.exports = {
  default_path: './public/users/',
  saveable: false,
  authProviderDetails: {
    iss: '',
    idp: ''
  },
  sendDefaultToAuthorizedUsers: false,
  clearLists: {
    domains: {
    "example.org": 1
    },
    emails: {
      "joe@example.com": 1
    }
  }
};
