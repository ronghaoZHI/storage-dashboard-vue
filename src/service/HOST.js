// in different clusters, domain are different,so ...
export const HOST = {
  awsHost: window.dashboard_conf.awsHost || 's2.i.qingcdn.com',
  apiHost:
    window.dashboard_conf.apiHost || 'frontendapi-stats.bscstorage.com:9090',
  transcoderHOST:
    window.dashboard_conf.transcoderHOST || 'transcoder-ss.bscstorage.com',
  policyHOST: 'policy-ss.bscstorage.com',
  imgxHOST: 'imgx-ss.bscstorage.com',
  ssoHost: 'test-sso.bs58i.baishancloud.com',
}
