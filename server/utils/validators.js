function isValidUrl(url) {
  try {
    const u = new URL(url);
    return !!u.protocol && !!u.host;
  } catch {
    return false;
  }
}

function isValidShortCode(code) {
  // อนุญาต a-z A-Z 0-9 - _
  return /^[a-zA-Z0-9-_]{3,30}$/.test(code);
}

module.exports = { isValidUrl, isValidShortCode };