const http = require('http'); 
const express = require('express'); 
const app = express(); 
const server = http.createServer(app); 

require("dotenv-safe").config(); 
const jwt = require('jsonwebtoken');
 
const bodyParser = require('body-parser'); 
app.use(bodyParser.json());
 
app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui!"});
})
 

app.get('/clientes', verifyJWT, (req, res, next) => { 
    console.log(req.userId + ' autenticado');
    res.json([{id:1,nome:'Michelle Hanne'}]);
})



app.post('/login', (req, res, next) => {

  if(req.body.user === 'arquiteturaWeb' && req.body.password === '123'){
     
      const id = 1; 
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 300 
      });
      return res.json({ auth: true, token: token });
    }
    
    res.status(500).json({message: 'Login inválido!'});
})

app.post('/logout', function(req, res) {
    res.json({ auth: false, token: null });
})
 

function verifyJWT(req, res, next){
    const token = req.headers['x-access-token']; 
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      
      req.userId = decoded.id;
      next();
    });
}


server.listen(3000);
console.log("Servidor escutando na porta 3000...")