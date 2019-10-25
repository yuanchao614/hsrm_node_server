class Response{
    constructor(isSuc,msg,code,result){
       this.isSuc = isSuc;
       this.msg = msg;
       this.code = code;
       this.result = result;
    }
}
module.exports = Response;