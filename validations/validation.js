//for checking email
export function validateEmail(email) {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
}

//For checking password
export function validatePassword(password) {
  if (password.length < 3 || password == '') {
    return false;
  } else {
    return true;
  }
}

export function validateOTP(otp) {
  if (otp.length < 6 || otp == '') {
    return false;
  } else {
    return true;
  }
}
