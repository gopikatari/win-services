import express from 'express';
import {
  checkService,
  eventEmitter,
  getDriveInfo,
  startOrstopService,
} from '../lib/restartSevice.js';
import {
  validateCheckReq,
  validateRestartService,
} from '../middlewares/validateReq.js';
const router = express.Router();

router.post('/restartService', validateRestartService, async (req, res) => {
  const { command, service } = req.body;
  const respObject = {
    request: { command, service },
  };
  const result = {};
  try {
    await startOrstopService(command, service);
    eventEmitter.once('raised', (code, message) => {
      result.statusCode = 200;
      result.message = message;
      result.exeCode = code;
      eventEmitter.removeListener('raised', () => {
        console.log('removed listner');
      });
      respObject.response = result;
      return res.status(200).json(respObject);
    });
  } catch {
    return res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
});

router.post('/checkService', validateCheckReq, async (req, resp) => {
  const { service } = req.body;

  try {
    const result = {};
    await checkService('', service);
    eventEmitter.once('raised', (code, message) => {
      result.statusCode = 200;
      result.message = message;
      result.exeCode = code;
      eventEmitter.removeListener('raised', () => {
        console.log('removed listnere');
      });
      return resp.status(200).json(result);
    });
  } catch (error) {
    return resp.status(500).json({
      code: 500,
      message: error.message,
    });
  }
});

router.get('/driveInfo', async (req, res) => {
  try {
    let result = await getDriveInfo();
    if (result) {
      return res.status(200).json({
        status: 200,
        message: null,
        result: result,
      });
    }

    res.status(200).json({
      status: 1,
      message: 'unable to retrive the drive info',
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
    });
  }
});

export default router;
