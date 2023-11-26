import { exec, execSync, spawn } from 'node:child_process';
import { EventEmitter } from 'node:events';
import iconv from 'iconv-lite';
import { getMessage } from '../utils/getMessage.js';
import { convetToGB, getChcpEncoding } from '../utils.js';

//Create an event handler:
const myEventHandler = function (status, message) {};
let eventEmitter = new EventEmitter();
eventEmitter.on('raised', myEventHandler);
const options = { windowsHide: true };

const startOrstopService = async (cmd, srvName) => {
  const ex = spawn('net', [cmd, srvName], options);

  ex.once('exit', (code, signal) => {
    eventEmitter.emit('raised', code, getMessage(code, srvName, cmd));
    eventEmitter.removeListener('raised', () => {
      console.log('De-Registering the event');
    });
    return { code, signal };
  });
  ex.once('error', (err) => {
    console.log(err);
  });
};

const checkService = async (cmd = '', srvName, status = 'RUNNING') => {
  const ex = exec(
    `sc query ${srvName} ${'|'} findstr ${status}`,
    options,
    (err, stdout) => {
      if (err) console.log('IGNORE::failed in execting sc query');
    }
  );

  ex.once('exit', (code, signal) => {
    eventEmitter.emit('raised', code, getMessage(code, srvName, cmd));
    eventEmitter.removeListener('raised', () => {
      console.log('De-Registering the event');
    });
  });
};

const getDriveInfo = async () => {
  const options = { windowsHide: true, encoding: 'buffer' };
  const cmd = `wmic logicaldisk get Caption,FreeSpace,Size,VolumeSerialNumber,Description  /format:list`;
  let buffer = executeSync(cmd, options);
  let drives = [];
  if (buffer) {
    //getActivePage code
    let chcpCode = executeSync('chcp', { windowsHide: true });
    let code = chcpCode.toString().split(':')[1].trim();
    const encoding = getChcpEncoding(code);
    buffer = iconv.encode(iconv.decode(buffer, encoding), 'UTF-8');
    const lines = buffer.toString().split('\r\r\n');

    let newDiskIteration = false;
    let caption = '';
    let description = '';
    let freeSpace = 0;
    let size = 0;

    lines.forEach((value) => {
      if (value !== '') {
        const tokens = value.split('=');
        const section = tokens[0];
        const data = tokens[1];

        switch (section) {
          case 'Caption':
            caption = data;
            newDiskIteration = true;
            break;
          case 'Description':
            description = data;
            break;
          case 'FreeSpace':
            freeSpace = isNaN(parseFloat(data)) ? 0 : +data;
            break;
          case 'Size':
            size = isNaN(parseFloat(data)) ? 0 : +data;
            break;
        }
      } else {
        if (newDiskIteration) {
          const used = size - freeSpace;
          let usedDiskSpace = '';
          let freeDiskSpace = '';
          if (size > 0) {
            const percent = Math.round((used / size) * 100);
            usedDiskSpace = percent + '%';
            freeDiskSpace = 100 - percent + '%';
          }
          drives.push({
            [caption]: {
              caption,
              description,
              freeSpace,
              size: convetToGB(size).toFixed(2) + 'GB',
              used: convetToGB(used).toFixed(2) + 'GB',
              usedDiskSpace,
              freeDiskSpace,
            },
          });
          //clear
          newDiskIteration = false;
          caption = '';
          description = '';
          freeSpace = 0;
          size = 0;
        }
      }
    });

    return drives;
  }
  return null;
};

function executeSync(command, options) {
  return execSync(command, options);
}
export { eventEmitter, startOrstopService, checkService, getDriveInfo };
