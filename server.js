'use strict';


require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const superagent=require('superagent');
const pg = require('pg');
const methodOverride=require('method-override')
app.use( express.json() );
app.use( express.urlencoded({extended:true}));
app.use( express.static('./public/../') );
app.set('view engine' ,'ejs')



// Middleware to handle PUT and DELETE
app.use(methodOverride((request, response) => {
  if (request.body && typeof request.body === 'object' && '_method' in request.body) {
    // look in urlencoded POST bodies and delete it
    let method = request.body._method;
    delete request.body._method;
    return method;
  }
}))


// Database Connection Setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => { throw err; });


// routes 


app.get('/',(request,response)=>{
  const url=`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.MOV_API}&language=en-US&page=1`
return superagent(url)
.then(data=>{
  // console.log('data : ', data);
  let movie=data.body.results;
  let movi= movie.map(val=>{
   return new Movie(val);
  })
  // console.log('movie : ', movie);
  response.render('../views/index',{data:movi})
})
});

// functions handlers 

app.get('/search',(request,response)=>{
  response.render('../views/pages/search')
})

app.post('/dosearches',(request,response)=>{
  let sort =request.body.disc;
  console.log('sort : ', sort);
  ;
  let url;
  let d = new Date();
  let year=d.getFullYear()
 if(sort === 'popularity') {url=`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOV_API}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1`}
 if(sort === 'revenue'){url=`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOV_API}&language=en-US&sort_by=revenue.desc.desc&include_adult=false&include_video=false&page=1&primary_release_year=${year}`}

 superagent(url)
 .then(data=>{
  let movie=data.body.results;
  let movi= movie.map(val=>{
   return new Movie(val);
  })
  // console.log('movie : ', movie);
  response.render('../views/pages/result',{data:movi})
})
});

app.post('/searchbox',(request,response)=>{
  let text=request.body.box;
  let url=`https://api.themoviedb.org/3/search/movie?api_key=57a6b853590432570e83f7520825c046&query=${text}`
  superagent(url)
  .then(data=>{
    let movie=data.body.results;
    let movi= movie.map(val=>{
     return new Movie(val);
    })
    // console.log('movie : ', movie);
    response.render('../views/pages/result',{data:movi})
  })
  });


function Movie(movi){

  this.title=movi.title;
  this.poster_path= `https://image.tmdb.org/t/p/w500${movi.poster_path}`||'not avalible';
  this.overview=movi.overview;
  this.popularity=movi.popularity;
  this.vote_average=movi.vote_average;
  this.release_date=movi.release_date;

}


// error functions handlers
function notFound(req,res){
    res.status(404).send('NOT FOUND!!!');
  }
  function errorHandler(error,req,res){
    res.status(500).send(error);
  }


  
// Connect to DB and THEN Start the Web Server

client.connect()
.then(() => {
  app.listen(PORT, () => console.log('Server up on', PORT)
  );
})
.catch(err => {
  throw `PG Startup Error: ${err.message}`;
});


