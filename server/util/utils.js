var crypto = require('crypto'),
  algorithm = 'aes-256-ctr',
  encKey = new Buffer('arg22g4ge0woobohgooqu4ieriwohgoo6C');


/* token validation */
exports.tokenValidate = function(token){
  return true;
}


/* encryption / decryption */
exports.encrypt = function (text){
  var cipher = crypto.createCipher(algorithm,encKey)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
exports.decrypt = function (text){
  var decipher = crypto.createDecipher(algorithm,encKey)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}