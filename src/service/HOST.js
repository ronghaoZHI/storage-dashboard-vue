// in different clusters, domain are different,so ...
export const HOST = {
  awsHost: window.dashboard_conf.awsHost || 's2.i.qingcdn.com',
  transcoderHOST:
    window.dashboard_conf.transcoderHOST || 'transcoder-ss.bscstorage.com',
  policyHOST: 'policy-ss.bscstorage.com',
  imgxHOST: 'imgx-ss.bscstorage.com',
  ssoHost: 'https://uc.portal.baishancloud.com',
}
