import isEmpty from 'lodash/isEmpty.js';

const validateRestartService = (req, res, next) => {
  const { command, service } = req.body;
  if (isEmpty(command) || isEmpty(service)) {
    return res.status(500).json({
      status: 500,
      message: `command or service properties are missing`,
    });
  }
  next();
};
const validateCheckReq = (req, res, next) => {
  if (isEmpty(req.body)) {
    return res.status(500).json({
      message: 'request body should not be empty',
    });
  }
  const { service } = req.body;
  if (isEmpty(service)) {
    return res.status(500).json({
      message: 'service name must be required',
    });
  }
  next();
};

export { validateCheckReq, validateRestartService };
