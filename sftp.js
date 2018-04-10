var ip = '10.99.2.224',
    arrive = "/usr/local/nginx/html/sm/scm",
    EasyFtp = require('easy-ftp'),
    path = require("path"),
    ftp = new EasyFtp(),
        config = {
        host: ip,
        port: 22,
        type: 'sftp',
        username: 'nginx',
        password: 'nginx'
    },
    dir = path.join(__dirname,"export/ch/**");
ftp.connect(config);		
ftp.upload(dir, arrive, function(err){
    console.log(err);
    console.log("已经传输完成至 "+ip+":"+arrive);
    ftp.close();
});

