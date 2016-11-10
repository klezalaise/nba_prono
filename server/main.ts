
import * as http from "http";

import express = require("express");
import bodyParser = require('body-parser');
import {teamMap,teams} from "./entities/Team";
import  "reflect-metadata";

import {Match} from "./entities/Match";
import {Player} from"./entities/Player"
import {Prono} from "./entities/Prono";
import {connection} from "./dao/database"
import {Connection} from "typeorm"

import {findMatches,findMatchById,deleteMatch,saveMatch} from "./dao/MatchDAO";
import {deleteProno,saveProno,findAllProno,findPronoById} from "./dao/PronoDAO";
import {deletePlayer,savePlayer,findAllPlayer,findPlayerById} from "./dao/PlayerDAO"

const hello : string = "Hello";


const app: express.Application = express();
app.use(express())
app.use(bodyParser.json())


/*
First Use Uncomment this part
const nba_matchs:any[] =require( "./entities/data/game_nba.json")
nba_matchs.forEach(m=>{
    let match = new Match();
    match.away = m.away;
    match.home = m.home;
    match.date = m.Date;

    if(m.awayScore && m.homeScore){
        match.winner = m.homeScore >m.awayScore ? m.home : m.away;
        console.log(match)
    }
    
    connection.then(connection =>saveMatch(connection,match))
})
*/

/**
 * TEAM ROUTE
 */

app.get("/api/v1/teams", (request: express.Request, response: express.Response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.json(teams);
});

app.get("/api/v1/teams/:name",(request:express.Request, response: express.Response)=>{
    const name = request.params.name;
    response.header("Access-Control-Allow-Origin", "*");
    response.json(teamMap[name]);
});

/**
 * PLAYER ROUTE
 */

app.get("/api/v1/players/",(request: express.Request, response: express.Response)=>{
   response.header("Access-Control-Allow-Origin", "*");
   connection.then(connection=>findAllPlayer(connection).then(players =>response.json(players)));
   
});

app.get("/api/v1/players/:id",(request:express.Request, response: express.Response)=>{
    const id :number = Number.parseInt(request.params.id);
   response.header("Access-Control-Allow-Origin", "*");
   connection.then(connection=>findPlayerById(connection,id).then(player=>response.json(player)));
});

app.post("/api/v1/players",(request: express.Request, response: express.Response)=>{
   response.header("Access-Control-Allow-Origin", "*");
   const username = request.body.username;
   const password = request.body.password;
   console.log(username)
   console.log(password)
   let player = new Player();
   player.password=password;
   player.username=username;
   connection.then(connection=>savePlayer(connection,player))
            .then(x=>response.sendStatus(201));
});



/**
 * Match Routes
 */


app.get("/api/v1/matchs/",(request: express.Request, response: express.Response)=>{
    response.header("Access-Control-Allow-Origin", "*");
    connection
   .then(connection => {
    findMatches(connection)
.then(matchs => response.send(matchs));
})});

app.get("/api/v1/matchs/:id",(request:express.Request, response: express.Response)=>{
    const id :number = Number.parseInt(request.params.id);
    response.header("Access-Control-Allow-Origin", "*");
    connection.then(connection=>{
        findMatchById(connection,id)
        .then(match=>{
            response.send(match)
        })
        
    })
});

/**
 * Prono Route
 */

app.get("/api/v1/pronos/",(request: express.Request, response: express.Response)=>{
   response.header("Access-Control-Allow-Origin", "*");
   connection.then(connection=>findAllProno(connection).then(pronos =>response.json(pronos)));
   
});

app.get("/api/v1/pronos/:id",(request:express.Request, response: express.Response)=>{
    const id :number = Number.parseInt(request.params.id);
    response.header("Access-Control-Allow-Origin", "*");
    connection.then(connection=>findPronoById(connection,id).then(pronos=>response.json(pronos)));
});

app.post("/api/v1/pronos/",(request:express.Request,response:express.Response)=>{
    response.header("Access-Control-Allow-Origin", "*");
    const choice = request.body.choice;
    const matchId = request.body.match;
    const playerId = request.body.player;
    console.log(choice+matchId);
    let prono = new Prono();
    prono.choice=choice;
    connection.then(connection=>{
        findMatchById(connection,matchId).then(m=>{
            prono.match=m;
            findPlayerById(connection,playerId).then(player=>{
                prono.player=player;
                saveProno(connection,prono).then(r=>response.sendStatus(201))
            })           
        })
    })
})

app.put("/api/v1/pronos/:id",(request:express.Request,response:express.Response)=>{
  
    const choice = request.body.choice;
    const pronoId = request.params.id
    connection.then(connection=>{
        findPronoById(connection,pronoId).then(prono=>{
            prono.choice = request.body.choice;
            saveProno(connection,prono).then(prono=>{
                response.sendStatus(201)
            })
        })
    })
});
    

console.log(hello);


const server: http.Server = app.listen(3000);