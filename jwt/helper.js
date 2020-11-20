var dataReqPromise = function(req,res){
    return new Promise(function(res,rej){
         var body = '';
         data = {}
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            body=body.split('&').map((e)=>{
                var query=e.split('=')
                data[query[0]]=query[1]
            })
            res(data);
        });
    })
}

module.exports = { dataReqPromise }
