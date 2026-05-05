const Eureka = require("eureka-js-client").Eureka;

const eurekaClient = new Eureka({
  instance: {
    app: "api-gateway",
    hostName: "localhost",
    ipAddr: "127.0.0.1",
    statusPageUrl: "http://localhost:3000",
    port: {
      $: 3000,
      "@enabled": "true",
    },
    vipAddress: "api-gateway",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    host: process.env.EUREKA_HOST || "localhost",
    port: process.env.EUREKA_PORT || 8761,
    servicePath: "/eureka/apps/",
  },
});

const getServiceUrl = (appId) => {
  const instances = eurekaClient.getInstancesByAppId(appId);
  if (instances && instances.length > 0) {
    const instance = instances[0];
    return `http://${instance.hostName}:${instance.port.$}`;
  }
  return null;
};

module.exports = {
  eurekaClient,
  getServiceUrl,
};
