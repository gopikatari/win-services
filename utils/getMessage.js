import isEmpty from 'lodash/isEmpty.js';

const getMessage = (status, srvName = '', cmd) => {
  let msg = '';
  if (isEmpty(cmd)) {
    return `the Service ${srvName} is currenty ${getServiceStatus(status)}`;
  }
  if (status === 0) {
    msg = `the service :: ${srvName} successfully ${cmd}ed!`;
  }
  if (status !== 0) {
    msg = `the service :: ${srvName} might be already running or its already ${cmd}ed!`;
  }
  return msg;
};

const getServiceStatus = (status) => {
  return status === 0 ? 'RUNNING' : 'STOPPED';
};

export { getMessage };
