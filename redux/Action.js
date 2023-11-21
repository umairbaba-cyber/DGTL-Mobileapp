import {
  GET_USER_DATA,
  UPDATE_USER_DEPOSIT_RECORD,
  UPDATE_FX,
  UPDATE_XCD,
  UPDATE_CHECKS,
  UPDATE_TOTAL,
  UPDATE_QRDETAIL,
  UPDATE_NOTIFICATION_STATUS,
  Other_Credentials,
} from './constant';

export const GetUserData = data => {
  return {
    type: GET_USER_DATA,
    payload: data,
  };
};

export const UpdateXcd = data => {
  return {
    type: UPDATE_XCD,
    payload: data,
  };
};
export const UpdateChecks = data => {
  return {
    type: UPDATE_CHECKS,
    payload: data,
  };
};
export const UpdateTotal = data => {
  return {
    type: UPDATE_TOTAL,
    payload: data,
  };
};

export const UpdateQrDetail = data => {
  return {
    type: UPDATE_QRDETAIL,
    payload: data,
  };
};

export const UpdateFx = data => {
  return {
    type: UPDATE_FX,
    payload: data,
  };
};

export const UpdateUserDepositRecord = data => {
  return {
    type: UPDATE_USER_DEPOSIT_RECORD,
    payload: data,
  };
};

export const updateNotificationStatus = notificationActive => ({
  type: UPDATE_NOTIFICATION_STATUS,
  payload: notificationActive,
});

export const OtherCredentials = data => ({
  type: Other_Credentials,
  payload: data,
});
