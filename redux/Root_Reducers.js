import { UPDATE_USER_DEPOSIT_RECORD, GET_USER_DATA, UPDATE_XCD, UPDATE_CHECKS, UPDATE_TOTAL, UPDATE_FX, UPDATE_QRDETAIL,UPDATE_NOTIFICATION_STATUS } from './constant';
const initialState = {
    User: [],
    QrCodeScanedDetail: {
        customerID: '',
        clientID: '',
        bagID: ''
    },
    Xcd: [],
    Checks: [],
    Fx: [],
    UserDepositRecord: [],
    notificationActive: false,
};
const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_USER_DATA:
            return {
                ...state,
                User: action.payload
            };

        case UPDATE_XCD:
            return {
                ...state,
                Xcd: action.payload
            };
        case UPDATE_CHECKS:
            return {
                ...state,
                Checks: action.payload
            };
        case UPDATE_TOTAL:
            return {
                ...state,
                total: action.payload
            };
        case UPDATE_QRDETAIL:
            return {
                ...state,
                QrCodeScanedDetail: action.payload
            };
        case UPDATE_FX:
            return {
                ...state,
                Fx: action.payload
            };
        case UPDATE_USER_DEPOSIT_RECORD:
            return {
                ...state,
                UserDepositRecord: action.payload
            };
            case UPDATE_NOTIFICATION_STATUS:
                return {
                  ...state,
                  notificationActive: action.payload,
                };
        default:
            return state;
    }
}
export default Reducer;