var _               = require('underscore'),
MessageAbstract     = require('./message_abstract'),
    moment          = require('moment'),
    int_encoder     = require('int-encoder');

var Bpss = function(){

}

Bpss.prototype = new MessageAbstract();

/**
 * Tokens
 *
 * @var {Array}
 * @private
 */
Bpss.prototype._tokens = new Array();

/**
 * Data key value pairs
 *
 * @var {Array}
 * @private
 */
Bpss.prototype._datas = {};


/**
 * appID key value pairs
 *
 * @var {String}
 * @private
 */
Bpss.prototype._appId  = "";


/**
 * Set appId
 * @param appId {string}
 */
Bpss.prototype.setAppId = function(appId){
    if(typeof appId!= 'string' || appId.trim().length == 0){
        throw "The Appid must be a string and not empty";
    }
    this._appId = appId;
}

/**
 * Get AppId
 * @returns {string}
 */
Bpss.prototype.getAppId = function(){
    return this._appId;
}



/**
 * Add Token
 *
 * @param token {String}
 */
Bpss.prototype.addToken = function(token){
    if (typeof token != 'string') {
        throw 'token must be a string';
    }

    var findToken = _.find(this._tokens, function(tck){
        return tck == token;
    });

    if(typeof findToken == 'undefined'){
        this._tokens.push(token);
    }
}

/**
 * Set tokens
 *
 * @param token {String|Array}
 */
Bpss.prototype.setTokens = function(token){
    var self = this;
    this.clearTokens();
    if(typeof token == 'string'){
        this._tokens.push(token);
    }else
    if(typeof token == 'array'){
        _.each(token, function(tck){
            self.addToken(tck);
        });
    }
}

/**
 * Clear tokens
 */
Bpss.prototype.clearTokens = function(){
    this._tokens = new Array();
}

/**
 * Add data
 *
 * @param key {String}
 * @param value {String|Boolean|Number}
 */
Bpss.prototype.addData = function(key, value){
    if(typeof key != 'string'){
        throw 'key must be string.';
    }
    if (!(/boolean|number|string/).test(typeof value)) {
        throw 'value must be scalar';
    }

    this._datas[key] = value;

}

/**
 * Set datas
 *
 * @param data {Array}
 */
Bpss.prototype.setData = function(data){
    var self = this;
    this.clearData();
    _.each(data, function(value, key){
        self.addData(key, value);
    });
}

/**
 * clear datas
 */
Bpss.prototype.clearData = function(){
    this._datas = {};
}

/**
 * getDatas
 *
 * @returns {Array}
 */
Bpss.prototype.getData = function(){
    return this._datas;
}



/**
 * Validate this is a proper Gcm message
 * Does not validate size.
 *
 * @returns {boolean}
 */
Bpss.prototype.validate = function(){
    if(typeof this._tokens != 'object' || this._tokens.length == 0){
        return false;
    }
    if( !(/boolean|number|string/).test(typeof this._id) || this._id.length == 0 ){
        return false;
    }
    return true;
}



/**
 * Get XML Payload
 *
 *
 * @return string
 */
Bpss.prototype.getXmlPayload = function(){
    var message_id       = +new Date(),
        addresses       = "",
        self            = this,
        ret             = "",

        deliverbefore   = moment( new Date() ).add("minutes" , 5).format("YYYY-M-DTHH:mm:ss");
        deliverbefore   = deliverbefore+"Z";


    _.each( self._tokens , function(item_token){

        if(   item_token.indexOf("BBSIMULATOR_") == -1){

            int_encoder.alphabet('0123456789abcdef');
            addresses += '<address address-value="' + int_encoder.encode( item_token ) + '" />';


        }
        //item_token
    });

    ret  =  '--mPsbVQo0a68eIL3OAxnm'+ "\n"; //
    ret  += 'Content-Type: application/xml; charset=UTF-8'+ "\n\n" ; //
    ret  += '<?xml version="1.0"?>'; //+ "\n"
    ret  += '<!DOCTYPE pap PUBLIC "-//WAPFORUM//DTD PAP 2.1//EN" "http://www.openmobilealliance.org/tech/DTD/pap_2.1.dtd">';//+ "\n"
    ret  += '<pap>'; //+ "\n"
    ret  += '<push-message push-id="' + message_id + '" deliver-before-timestamp="' + deliverbefore    + '" source-reference="' + this._appId + '">';// + "\n"
    ret  +=  addresses ;
    ret  += '<quality-of-service delivery-method="unconfirmed"/>';//+ "\n"
    ret  += '</push-message>';//+ "\n"
    ret  += '</pap>'+ "\n" ;//
    ret  += '--mPsbVQo0a68eIL3OAxnm'+ "  \n" ;//
    ret  += 'Content-Type: text/plain'+ "  \n" ;//
    ret  += 'Push-Message-ID: ' + message_id + "  \n\n";
    ret  += JSON.stringify(this._datas) + "\n";
    ret  += '--mPsbVQo0a68eIL3OAxnm--';

    return ret;

}





module.exports = Bpss;