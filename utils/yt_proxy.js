const { HttpsProxyAgent } = require("https-proxy-agent");

// Remove 'user:pass@' if you don't need to authenticate to your proxy.
// const proxy = "http://user:pass@111.111.111.111:8080";
const proxy = "http://111.111.111.111:8080";
const agent = new HttpsProxyAgent(proxy);

module.exports.default = agent;
