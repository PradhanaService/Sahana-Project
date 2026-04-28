const errorMap = {
  'auth/invalid-credential': 'Wrong email or password.',
  'auth/user-not-found': 'No account was found for that email.',
  'auth/wrong-password': 'Wrong password.',
  'auth/invalid-email': 'Enter a valid email address.',
  'auth/email-already-in-use': 'That email is already registered.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
  'permission-denied': 'You do not have access to this data yet.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
};

function getErrorCode(error) {
  if (!error) {
    return '';
  }

  return error.code || error?.customData?._tokenResponse?.error?.message || '';
}

function getFriendlyError(error, fallback = 'Something went wrong. Please try again.') {
  const code = getErrorCode(error);

  if (code && errorMap[code]) {
    return errorMap[code];
  }

  const rawMessage = error?.message || '';

  if (/missing or insufficient permissions/i.test(rawMessage)) {
    return 'You do not have access to this data yet.';
  }

  if (/firebase/i.test(rawMessage)) {
    return fallback;
  }

  return rawMessage || fallback;
}

export default getFriendlyError;
