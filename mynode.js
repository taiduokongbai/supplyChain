var express = require('express'),
path = require('path'),
port = process.env.PORT || 9099,
app = express(),
request = require('request'),
baseConfig = require("./base.webpack").cfg,
bodyParser = require('body-parser'),
reqOpt = {},
headerOpt;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// serve static assets normally
app.use(express.static(__dirname + '/export/ch'));

// handle every other route with index.html, which will contain
// a script tag to your application's JavaScript file(s).
app.all("*", function(req, resp, next) {
let query = (req.method==="GET"?req.query:req.body)||{};

resp.header("Access-Control-Allow-Origin", "*");
resp.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");

if(/^1$/.test(query.corNode)){
    delete query.corNode;
    resp.set("Content-Type","text/plain");

    headerOpt = {
        "Accept-Encoding": req.header("Accept-Encoding"),//"gzip, deflate",
        "Accept-Language": req.header("Accept-Language"),
        // "tokenId": req.header("tokenid") || "",
    };

    if(/post/i.test(req.method)){
        headerOpt = Object.assign(headerOpt,{
            "Content-Type": "application/json",
            "Accept": req.header("accept"),
            // "tokenId":(req.header("tokenId") || req.header("tokenid")) || "",
        });
        reqOpt = Object.assign(reqOpt,{
            body: JSON.stringify(query)
        });
    }
    //headerOpt.tokenId = req.header("tokenId") || "";
    headerOpt.tokenId = "50a01ad684a7c5b15d03162a0b96fd6e";
    headerOpt.cookie = " JSESSIONID=934c43b0-61ed-4300-a9f3-2268cb4c9555";
    reqOpt = Object.assign(reqOpt,{
        headers: headerOpt,
        method: req.method,
        url: ("http://10.99.2.72:9098"+req.url.toLowerCase())
        // url: ("http://172.16.8.170"+req.url)
    });
    console.log(reqOpt);
    console.log("=======");
    request(reqOpt, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let d = new Date();
            // console.log(req.url+":");
            // console.log(body);
            // console.log("-----------"+d.getFullYear()+
            //     "-"+(d.getMonth()+1)+"-"+d.getDay()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds());
            resp.send(body);
        }else{
            resp.send({"msg": "10.99.2.70 报错或者找不到资源","response":response});
        }
    });
}else{
    next();
}
});

let multer = require('multer'),
upload = multer({
    dest: __dirname + '/'
});
app.post('/upload',upload.single('logo'),(req,resp,next)=>{
let f = req.file;
console.log(new Date()+"========");
console.log(f);
resp.send({code: "101"});
});
//上传使用

let x = (req,resp,next)=>{
let u = req.url.match(/\/R\/[^\/]+/)[0].replace(/\/R\//,''); 
resp.sendFile(path.resolve(__dirname, 'export/ch/', u+".html"));
};

app.route(/^\/R\//).get(x).post(x);

app.listen(port);
console.log("端口:"+port+"/main.html");
