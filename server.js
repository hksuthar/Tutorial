var express = require('express');

var app=express();
var mongojs=require('mongojs');
//var db = mongojs('USERS', ['USERS']);


var MongoClient = require('mongodb').MongoClient;
var db = null;
var dbName='Carto'
var dbName_user = 'user'
var url = 'mongodb://localhost:27017/' + dbName_user
var url_carto= 'mongodb://localhost:27017/'+dbName
//var db = mongojs("127.0.0.1:27017/" + dbName_user, 'User');

//var db = mongojs(url_user, [USERS])

//var databaseUrl = url_user; // "username:password@example.com/mydb"
var collections = ["user"]


/******************************** For File uploaded Start ************************************/

var multer = require('multer');
/* required for logic*/
var moment = require('moment'); 


/* Added by Hemesh from Krutika Starts */
    var csvjson = require('csvjson');
    var parse = require('csv-parse');
    var csv = require('fast-csv');
    var path = require('path');
    var fs = require('fs');

    var collection;
    var str = "";
    var aData = null;
    var Document = null;


var bodyParser = require('body-parser');

app.use(express.static('../Carttronics_Graph/Client/', { index: 'login.html' }));

app.get('/hksuthar', function (req, res) {
    
    console.log("i recevied");


});
app.use(bodyParser.json());
app.get('/', function (req, res) {
    
    res.status(200).sendFile('index.html', { root: path.join(__dirname, '../Carttronics_Graph/Client/') });


});
app.get('/carttronicslogin',function(req, res){
    
    console.log("I see a get request")
    
	/*db.contactlist.find(function(err, docs){
		console.log(docs);
		res.json(docs);

	});*/

});

app.get('/Chart_1', function (req, res) {
    console.log("I see a get request from Chart_1")
    MongoClient.connect(url_carto, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection Done ', url_carto);
            //console.log(db);
            //var collectionnames = db.getcollectionNames();
            var collection = db.collection('Albertsons 6713');
            var adata = []

            collection.find({}).toArray( function (err, docs) { // Should succeed
                
                if (err)
                    throw err;
                else {
                    
                    res.send(docs);
                    
                   /* docs.each(function (err, doc) {
                        if (doc) {
                            adata = doc;  
                            res.send(doc)
                            k++
                       } else
                            res.send("Full Data Sent");
                        
                
                    });*/
                }
                

            });
  
        }
                    
    });



});

app.post('/carttronicslogin', function(req,res){

    console.log("i am Harsh Patel")

    console.log(req.body.email);

    //Main Data insert
    MongoClient.connect(url, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection Done ', url);
            //console.log(db);
            var collection = db.collection('user');
            collection.find({ 'email': req.body.email, "password": req.body.pass }, function (err, docs) { // Should succeed
                if (err)
                    res.send("not Ok");
                else {
                    
                    docs.each(function (err, doc) {
                        if (doc) {
                            //console.log(doc.user)
                            console.log(doc.email)
                            res.send("index.html");
                            //res.status(200).sendFile('Chart.html', { root: path.join(__dirname, '../carttronics/client/') });//res.sendFile(__dirname + '/Client/index.html');
                                                        
                        }
                        
                
                    });
                }
                

            });
                
                
                  /* fs.unlink(file_json, function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            console.log("JSON deleted successfully!");
                        });
                        fs.unlink(__dirname + filename, function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            console.log("File deleted successfully!");
                        });*/
        }
                    //var db = 'CartData';
    });






});

app.post('/Chart_1', function (req, res) {
    
    console.log("i see post request from Chart_1")
    
    
    
    //Main Data insert
    MongoClient.connect(url_carto, function (err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err);
        } else {
            console.log('Connection Done ', url_carto);
            //console.log(db);
            var collection = db.collection('user');
            collection.find({ 'email': req.body.email, "password": req.body.pass }, function (err, docs) { // Should succeed
                if (err)
                    res.send("not Ok");
                else {
                    
                    docs.each(function (err, doc) {
                        if (doc) {
                            console.log(doc.email)
                            res.send("index.html");
                            //res.status(200).sendFile('Chart.html', { root: path.join(__dirname, '../carttronics/client/') });//res.sendFile(__dirname + '/Client/index.html');
                                                        
                        }
                        
                
                    });
                }
                

            });
                
                
                  /* fs.unlink(file_json, function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            console.log("JSON deleted successfully!");
                        });
                        fs.unlink(__dirname + filename, function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            console.log("File deleted successfully!");
                        });*/
        }
                    //var db = 'CartData';
    });






});


/* Added by Hemesh from Krutika Ends */

    app.use(function(req, res, next) { //allow cross origin requests
        res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
        res.header("Access-Control-Allow-Origin", "http://localhost");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    /** Serving from the same express Server
    No cors required */
    //app.use(express.static('../client'));
    //app.use(bodyParser.json());  

    var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './uploads/');
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ //multer settings
        storage: storage
   }).single('file');

    /** API path that will upload the files */
    app.post('/upload', function(req, res) {
        upload(req, res, function (err) {
            
            if(err){
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            console.log("It is done");
            res.json({ error_code: 0, err_desc: null });
            var filename = '/' + req.file.path;
            console.log(filename.length);
           
            var Converter = require("csvtojson").Converter;
            //console.log("It is done 1");

            //Logic implimentation for the separate files starts 

            var people = [], casters = {}, dts = [], dts1 = [];
            var fileContents = fs.readFileSync(__dirname + filename);
            var ss = fileContents.toString().split('\n');

            for (var i = 1; i < ss.length-1; i++) {
                var s = ss[i].toString().split(',');

                var dt = '', t = '', sn = '', m = '';
                if (s[2] != undefined)
                    dt = s[2].replace("\"", "");

                if (dts.indexOf(dt) < 0) {
                    dts.push(dt);
                }

                if (s[0] != undefined)
                    t = s[0].replace("\"", "").replace("PT", "");
                var d = moment(t).format("YYYY-MM-DD hh:mm");
                
                //var d1 = moment(""+moment(d.toDate().getTime() + 60*60*1000).format("YYYY-MM-DD hh:mm:ss.SSSS"));
                var temp = d + 621355968000000000;
                if (dts1.indexOf(d) < 0) {
                    dts1.push(d);
                }
                // console.log('date temp => '+temp);
                // console.log('date temp d => '+d);
                if (s[1] != undefined)
                    sn = s[1].replace("\"", "");


                //DateTime d = DateTime.Now; //= DateTime.Parse(t);
                //d = new DateTime(d.Ticks - (d.Ticks % 600000000));
                //if (!dts.Contains(d)) dts.Add(d);

                if (!casters.hasOwnProperty(sn)) {
                    var c = {
                        locs: [],
                        type: "NA",
                    }
                    // var obj = {};
                    casters[sn] = c;
                    //casters.push(obj);
                }

                var l = {};

                if (s[3] != undefined)
                    m = s[3].replace("\"", "");

                if (m.match(/Enter Store/gi)) { l["location"] = "S"; }
                else if (m.match(/Must Check/gi)) { l["location"] = "S"; }
                else if (m.match(/Check/gi)) { l["location"] = "C"; }
                else if (m.match(/Leave Store/gi)) { l["location"] = "P"; }
                else if (m.match(/Trolley Bay Outside/gi)) { l["location"] = "T"; }
                else if (m.match(/Trolley Bay Outside/gi)) { l["location"] = "T"; }
                else if (m.match(/Perimeter Lock/gi)) {
                    l["location"] = "L";
                    if (casters[sn].locs.length != 0)
                        if (casters[sn].locs[casters[sn].locs.length - 1].location == "L")
                            l["location"] = "P";
                }
                else if (m.match(/Unlock/gi)) { l["location"] = "P"; }
                if (l["location"] != "M" && sn != undefined) {
                    l["when"] = moment(t);
                    //l["when"] = d;
                    if (casters[sn] != undefined && casters[sn].locs.length == 0) { casters[sn].locs.push(l); }
                    else if (casters[sn] != undefined) {
                        // console.log(casters[sn]);
                        var last = casters[sn].locs[casters[sn].locs.length - 1];
                        if (last["when"] == d)
                            casters[sn].locs[casters[sn].locs.length - 1] = l;
                        else
                            casters[sn].locs.push(l);


                        // console.log(l)
                    }
                }
            }
            //console.log("Initial FIle Processing comeplte");
            var dd = dts1.sort();
            // console.log(dd[0]);
            var start = moment(dd[0]);
            var end = moment(dd[dd.length - 1]);

            for (var k in casters) {
                var s = casters[k];
                var ct = start;
                var tlocs = [];
                var thisLoc = {};
                thisLoc["location"] = "M";
                thisLoc["when"] = start;
               // console.log(s.locs.length);
                for (var li = 0; li < s.locs.length; li++) {
                  //  console.log("===");
                    // console.log(s.locs[li]);
                    var breaker = 0;
                    while (ct._i < s.locs[li].when._i) {
                        breaker++;
                       // if (breaker == 10) {
                         //   break;
                        //}
                        tlocs.push(thisLoc);
                        //console.log(ct._i);
                        ct = moment("" + moment(ct.toDate().getTime() + 60*1000).format("YYYY-MM-DD hh:mm:ss.SSSS"));//moment(ct).add(1, 'm');// check conversion
                        //console.log(ct1._i);
                    }
                }
                var breaker = 0;
                while (ct._i < end._i) {
                    breaker++;
                   // if (breaker == 10) {
                     //   break;
                  //  }
                    tlocs.push(thisLoc);
                    //  console.log(ct._i);
                    
                    ct = moment("" + moment(ct.toDate().getTime() + 60*1000).format("YYYY-MM-DD hh:mm:ss.SSSS"));// check conversion YYYY-MM-DD hh:mm:ss.SSSS
                    //  console.log(ct._i);
                }

                s['slocs'] = tlocs;
                s['locs'] = null;
                casters[k] = s;
            }
            //console.log(casters);

            var output = [];
            var output2 = [];
            output.push("Date,Missing,Parking Lot,Trolley Bay,Shopping,Checked Out");
            output2.push("Date,Stops");

            var outputMy = "";
            var output2My = "";
            outputMy = "Date,Missing,Parking Lot,Trolley Bay,Shopping,Checked Out";
            output2My = "Date,Stops";

            var lck = 0;
            var ct = start;
            //console.log(ct._i);
           // console.log(ct < end);

            var aa = moment(ct).add(10, 'm')
           // console.log(aa._i);
           // console.log(ct._i < end._i);
            var breaker = 0;


            for (var ct = start ; ct._i < end._i; ct = moment("" + moment(ct.toDate().getTime() + 60 * 1000).format("YYYY-MM-DD hh:mm:ss.SSSS"))) {
                breaker++;
               // if (breaker == 10) {
                  //  break;
               // }
                var m = 0; var s = 0; var c = 0; var p = 0; var t = 0;
                var xi;

                for (var sss in casters) {
                    try {

                        if (casters[sss].slocs[xi] == "S") s += 1;
                        if (casters[sss].slocs[xi] == "M") m += 1;
                        if (casters[sss].slocs[xi] == "C") c += 1;
                        if (casters[sss].slocs[xi] == "P") p += 1;
                        if (casters[sss].slocs[xi] == "T") t += 1;
                        if (casters[sss].slocs[xi] == "L")
                            if (xi == 0) lck += 1;
                            else if (casters[sss].slocs[xi - 1] != "L")
                                lck += 1;


                    }
                    catch (ex) {
                        console.log("Error is coming in printing");

                       // console.log(xi.toString() + " " + ct.toString());

                    }

                }
                var ts = ct - new Date(1970, 1, 1);
                var xss = "" + ts + "," + m + "," + p + "," + t + "," + s + "," + c;
                outputMy = outputMy + "\n" + xss;
                output.push(xss);

                //console.log("hello hemesh");
                var xss1 = "" + ts + "," + lck;
                output2My = output2My + "\n" + xss1;
                output2.push(xss1);
               // output2.push("hemesh");
                xi += 1;
            }
            // console.log(output);
            var xfilename = __dirname + filename.substring(0, 27)+'_x'+'.csv';
            var stopfilename = __dirname + filename.substring(0, 27) + '_stops' + '.csv';
            fs.writeFile(xfilename, outputMy);
            fs.writeFile(stopfilename, output2My);

            //Logic implimentation for the separate files Ends

            var fileStream = new fs.createReadStream(__dirname + filename);
            //console.log("It is done 2");
            var csvconverter = new Converter({ constructResult: true });
            //console.log("It is done 3");
            //converts the file in to jason

            //end_parsed or record_parsed
            csvconverter.on("end_parsed", function (jsonObj) {

                console.log("in json funtion");
                var jsonfile = require('jsonfile');

                //  var file_json =__dirname+ "/uploads/"+updatefilename.substring(1,16 )+'json';
                var file_json = __dirname + filename.substring(0, 28) + 'json';
                
               // var file_json_x = xfilename.substring(0, 30) + 'json';
               // var file_json_stop = stopfilename.substring(0, 34)  + 'json';
                 
                
                jsonfile.writeFile(file_json, jsonObj, function (err) { console.error(err); });
              //  jsonfile.writeFile(file_json_x, function (err) { console.error(err); });
             //   jsonfile.writeFile(file_json_stop, function (err) { console.error(err); });

                //mongodb connection establishment

                //Main Data insert
                MongoClient.connect(url_carto, function (err, db) {
                    if (err) {
                        console.log('Unable to connect to the mongoDB server. Error:', err);
                    } else {
                        console.log('Connection Done ', url_carto);
                        var mydocuments = fs.readFile(file_json, 'utf8', function (err, data) {

                            //table name  changed  1)CartData 2)DeviceEvent 3) Duration

                            var collection = db.collection('CartData');


                            collection.insert(JSON.parse(data), function (err, docs) { // Should succeed
                                collection.count(function (err, count) {
                                    //console.log(format("count = %s", count));
                                    console.log("done");
                                    db.close();
                                });
                            });
                        });
                    }
                });



            });
            fileStream.pipe(csvconverter);

         
        });
        //fileStream.pipe(csvconverter);
    });

/* File uploaded end*/




/* For Dashbord start*/
//var dbName_contact='contactlist'
//var url_contactlist= 'mongodb://localhost:27017/'+dbName_contact

var mongojs = require('mongojs');
var db_c = mongojs('user', ['user']);

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } 
    else 
    {
        console.log('Connection Done ', url);

        app.get('/user', function (req, res) {
            console.log("I received a get request");

            db_c.user.find(function (err, docs) {
                console.log(docs);
                res.json(docs);
            });
            
        });

        app.post('/user', function (req, res) {
            console.log(req.body);
            db_c.user.insert(req.body, function(err, doc) {
                res.json(doc);
            });
            
        });

        app.delete('/user/:id', function(req, res) {
            var id = req.params.id;
            console.log(id);
            db_c.user.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
                res.json(doc);
            })
        });

        app.get('/user/:id', function(req, res) {
            var id = req.params.id;
            console.log(id);
            db_c.user.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
                res.json(doc);
            })
        });

        app.put('/user/:id', function(req, res) {
            var id = req.params.id;
            console.log(req.body.username);
            db_c.user.findAndModify({query: {_id: mongojs.ObjectId(id)}, 
                update: {$set: {username: req.body.username, email: req.body.email, password: req.body.password, desc: req.body.desc, roles: req.body.roles, f_name: req.body.f_name, l_name: req.body.l_name, m_name: req.body.m_name, address: req.body.address, mobile: req.body.mobile}},
                new: true}, function (err, doc) {
                    res.json(doc);
                });
        });
    }
});

/*Dashboard end*/


app.listen(3000);
console.log("server running on port 3000");