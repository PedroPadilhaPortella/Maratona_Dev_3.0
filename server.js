/* Configurando o servidor */ 
const express = require("express");
const server = express();

/* Configurando o servidor para apresentar arquivos extras */
server.use(express.static('public')); 

// Habilitando body do formulário
server.use(express.urlencoded({ extended: true }));

// Configurar conexão com banco de dados
const Pool = require('pg').Pool;

const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'doe'
});


/* Configurando a template Engine */
const nunjucks = require("nunjucks");
nunjucks.configure("./", {
    express: server,
    noCache: true,
});



/* Configurando a apresentação da página */
server.get("/", function(req, res){
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("Erro de bando de dados.");

        const donors = result.rows;
        return res.render("index.html", { donors });
    })
}); 

server.post("/", function(req, res){
    //Pegar dados do formulário
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    // Se algum dado vier vazio
    if (name == "" || email == "" || blood == "")
    {
        return res.send("Todos os campos são obrigatórios");
    }

    // Colocando valores dentro do banco de dados
    const query = `INSERT INTO "donors" ("name", "email", "blood") VALUES ($1, $2, $3)`;

    const values = [name, email, blood];

    db.query(query, values, function(err){
        // Fluxo de erro
        if(err) return res.send("Erro no banco de dados");

        // Fluxo ideal
        return res.redirect("/");
    });
})


/* Iniciando o servidor */
server.listen(3000, function(){
    console.log("Iniciei o server")
});