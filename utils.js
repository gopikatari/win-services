const START = 'start';
const STOP = 'stop';
const PAUSE = 'pause';
const parseCommand = (cmd = 'start') => {
  switch (cmd.toLocaleLowerCase()) {
    case START:
      return START;
    case STOP:
      return STOP;
    case PAUSE:
      return PAUSE;
    default:
      return cmd;
  }
};
const convetToGB = (size) => {
  return size / 1024 / 1024 / 1024;
};
const convetToMB = (size) => {
  return size / 1024 / 1024;
};

const getChcpEncoding = (cp) => {
  let encoding = '';
  switch (cp) {
    case '65000': // UTF-7
      encoding = 'UTF-7';
      break;
    case '65001': // UTF-8
      encoding = 'UTF-8';
      break;
    default: // Other Encoding
      if (/^-?[\d.]+(?:e-?\d+)?$/.test(cp)) {
        encoding = 'cp' + cp;
      } else {
        encoding = cp;
      }
  }
  return encoding;
};
export { parseCommand, getChcpEncoding, convetToGB, convetToMB };
