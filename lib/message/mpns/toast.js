var _               = require( 'underscore'),
    Mpns            = require( "../mpns.js"),
    Jade            = require("jade");


var Toast = function(){

}


Toast.prototype = new Mpns();


/**
 * Mpns delays
 *
 * @var int
 */
Toast.prototype.DELAY_IMMEDIATE     = 2;
Toast.prototype.DELAY_450S          = 12;
Toast.prototype.DELAY_900S          = 22;


/**
 * Title
 *
 * @var string
 */
Toast.prototype._title = "";


/**
 * Message
 *
 * @var string
 */
Toast.prototype._msg = "";


/**
 * Params
 *
 * @var string
 */
Toast.prototype._params = "";




/**
 * Get Title
 *
 * @return string
 */
Toast.prototype.getTitle = function()
{
    return this._title;
}

/**
 * Set Title
 *
 * @param string $title
 * @return Toast

 */
Toast.prototype.setTitle = function (title)
{
    if (typeof title != "string" ) {
        throw 'title must be a string';
    }
    this._title = title;
    return this;
}

/**
 * Get Message
 *
 * @return string
 */
Toast.prototype.getMessage = function ()
{
    return this._msg;
}




/**
 * Set Message
 *
 * @param string $msg XML string
 * @return Toast
 */
Toast.prototype.setMessage = function (msg)
{
    if (typeof msg != "string") {
    throw 'msg is not a string';
}

    this._msg = msg;

    return this;
}


/**
 * Get Params
 *
 * @return string
 */
Toast.prototype.getParams = function()
{
    return this._params;
}


/**
 * Set Params
 *
 * @param string $params
 * @return Toast
 */
Toast.prototype.setParams = function (params)
{
    if (typeof params != "string" ) {
        throw 'params must be a string';
    }
    this._params = params;
    return this;
}





/**
 * Get Delay
 *
 * @return int
 */
Toast.prototype.getDelay = function()
{
    if (! this._delay) {
        return this.DELAY_IMMEDIATE;

    }
    return this._delay;
}


/**
 * Set Delay
 *
 * @param int $delay
 * @return Toast
 */
Toast.prototype.setDelay = function(delay)
{
    var self = this;
    if ( ! _.contains(delay , [ self.DELAY_IMMEDIATE , self.DELAY_900S, self.DELAY_450S] ) ){
        throw "delay must be one of the DELAY_* constants";
    }

    this._delay = delay;
    return this;
}



/**
 * Get Notification Type
 *
 * @return string
 */
Toast.prototype.getNotificationType = function()
{
    return 'Toast';
}



/**
 * Get XML Payload
 *
 * @return string
 */
Toast.prototype.getXmlPayload = function()
{


    var title_special_cars_encoded =  Jade.runtime.escape(this._title );
    var msg_special_cars_encoded =  Jade.runtime.escape(this._msg);
    var params_special_cars_encoded =  Jade.runtime.escape(this._params);

    var ret = '<?xml version="1.0" encoding="utf-8"?>' + "\n";
        ret += '<wp:Notification xmlns:wp="WPNotification">' + "\n";
        ret +=  '<wp:Toast>' + "\n";
        ret +=  '<wp:Text1>' + title_special_cars_encoded  + '</wp:Text1>' + "\n";
        ret +=  '<wp:Text2>' + msg_special_cars_encoded  + '</wp:Text2>' + "\n";
    if ( this._params.length != 0 ) {
        ret += '<wp:Param>' + params_special_cars_encoded  + '</wp:Param>' + "\n";
    }
        ret += '</wp:Toast>' + "\n";
        ret +=  '</wp:Notification>' + "\n";

    return ret;

}




/**
 * Validate proper mpns message
 *
 * @return boolean
 */
Toast.prototype.validate = function()
{
    if(typeof this._tokens.length == 0){
        return false;
    }
    if( this._msg.length == 0 ){
        return false;
    }
    if( this._title.length == 0 ){
        return false;
    }


    return true;

}



module.exports = Toast;