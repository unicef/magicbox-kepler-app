module.exports = {
  default_path: './public/users/',
  saveable: process.env.SAVEABLE || false,
  authProviderDetails: {
    iss: ''
  },
  clearLists: {
    domains: {
    "example.org": 1
    },
    emails: {
      "joe@example.com": 1
    }
  }
};
