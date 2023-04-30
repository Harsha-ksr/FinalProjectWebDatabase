const http = require('http');
const path = require('path');
const fs = require('fs');
const { MongoClient, ServerApiVersion } = require('mongodb');

var dir = path.join(__dirname, 'public');
var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};
/*
const Destinations = [ 
    { PlaceName: 'Osaka', Country:'Japan' , Description:'Japan is an island country in East Asia', FamousFor: 'famous for anime', BestTimeToVisit:'summer', Rank:1, NoOfVisitor:12345},
    { PlaceName: 'Seoul', Country:'South Korea' , Description:'City in South Korea, an East Asian nation on the southern half of the Korean Peninsula', FamousFor: 'famous for K-pop and K-Drama', BestTimeToVisit:'summer', Rank:2, NoOfVisitor:32345},
    { PlaceName: 'Reykjavík', Country:'Iceland' , Description:'Reykjavík is the capital and largest city of Iceland. ', FamousFor: 'famous for  unique architecture, wild nightlife', BestTimeToVisit:'summer and Winter', Rank:3, NoOfVisitor:12345},
    { PlaceName: 'Alaska', Country:'United States of America' , Description:'Alaska is a U.S. state on the northwest extremity of North America.', FamousFor: 'famous for nature, scenery, northern lights', BestTimeToVisit:'summer', Rank:4, NoOfVisitor:782345},
    { PlaceName: 'Havana', Country:'Cuba' , Description:'Havana is Cuba’s capital city.', FamousFor: 'famous for Spanish colonial architecture', BestTimeToVisit:'Anytime', Rank:5, NoOfVisitor:224345},
    { PlaceName: 'paris', Country:'France' , Description:'Paris, France’s capital, is a major European city and a global center for art', FamousFor: 'famous for Art and Museums', BestTimeToVisit:'summer', Rank:6, NoOfVisitor:452345},
    { PlaceName: 'kerala', Country:'India' , Description:'Kerala, a state on India’s tropical Malabar Coast, has nearly 600km of Arabian Sea shoreline.', FamousFor: ' palm-lined beaches and backwaters,', BestTimeToVisit:'summer', Rank:7, NoOfVisitor:32345}
    
];*/

/*
    Getting data from Mongo Db cluster
*/
let results;
// This is the database URL for the Mongo DB Atlas Cluster spun on AWS Cloud.
const uri = "mongodb+srv://harshamongodb:harsha123@mongocluster.sckbjyb.mongodb.net/?retryWrites=true&w=majority";
// Create a Mongo DB client
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Create an async function that calls DB and gets the data from the Collection we defined in Mongo DB
// Database Name: DestinationsDB
// Collections Name: Destinations
async function run() {
  try {
    // Connect the client to the server.
    await client.connect();
    // Send a ping to confirm a successful connection
    const database = await client.db("DestinationsDB");
    const collection = database.collection("Destinations");
    // Get the results from the collection.
    results = await collection.find({}).limit(10).toArray();
        
    console.log(`Pinged your deployment. You successfully connected to MongoDB! Data from Mongo DB -- ${JSON.stringify(results)}`);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const server = http.createServer(function(req, res) {
    if (req.url.includes('/api')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(results));
    }
    var reqpath = req.url.toString().split('?')[0]
    var file = path.join(dir, reqpath.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        res.statusCode = 403;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('Forbidden');
    }
    var type = mime[path.extname(file).slice(1)] || 'text/plain';
    var s = fs.createReadStream(file);
    s.on('open', function () {
        res.setHeader('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });
});

const PORT = process.env.PORT || 5555;
server.listen(PORT, function () {
    console.log(`Server running on port ${PORT}`);
});

//server.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/
