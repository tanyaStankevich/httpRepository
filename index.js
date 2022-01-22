const http = require('http');
const fs = require('fs');
const path = require('path');
const host = 'localhost';
const port = 8000;

const user = {
    id: 123,
    username: 'testuser',
    password: 'qwerty'
};

const requestListener = (req, res) => { 
    
    if (req.url === '/get' && req.method ==='GET') {
        try {
            res.writeHead(200);
            res.end(fs.readdirSync('./files').join(', '));
            
        } catch (err) {
            res.writeHead(500);
            res.end('Internal server error');
        }
    }

    else if (req.url === '/delete' && req.method ==='DELETE') {
        if (req.cookie === 'authorized = true' && req.cookie === 'userID=123') {
            try {
                res.writeHead(200);
                res.end('success');
                const filepath = path.join(__dirname, req.filename);
                fs.unlink(filepath);
            } catch (err){
                res.writeHead(500);
                res.end('Internal server error');
             }
        } 
    }

    else if (req.url === '/post' && req.method ==='POST') {
        
        if (req.cookie === 'authorized = true' && req.cookie === 'userID=123') {
            try {
                res.writeHead(200);
                res.end('success');
                const createFile = fs.writeFile(req.filename, req.content);
            } catch (err) {
                res.writeHead(500);
                res.end('Internal server error');
            }   
       }
        else if (req.username === user.username && req.password=== user.password) {
            res.writeHead(200, {
                'Set-Cookie': userID = user.id,
                'Set-Cookie': authorized = true,
                'Set-Cookie': MAX_AGE=60 * 60 * 24 * 2,
                'Set-Cookie': path='/'
            });
            res.end('success');
        } else {
            res.writeHead(400);
            res.end('Неверный логин или пароль');
        }
        // const filePath = path.join(__dirname, 'index.html');
        // const readStream = fs.createReadStream(filePath);
        // readStream.pipe(response);  
    }

    else if (req.url === '/redirect' && req.method ==='GET') { 
        res.writeHead(307);
        res.end('Resource is available on /redirected');
    }
    else if (req.url === '/redirected' && req.method ==='GET') { 
        res.writeHead(200);
        res.end('success');
    }
    else {
         res.writeHead(405);
         res.end('HTTP method not allowed');   
    }
    
};

const server = http.createServer(requestListener);

server.listen(port, host, ()=> {
    console.log(`Server is running on http://${host}:${port}`);  
})