import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import _ from 'lodash';
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import cors from 'cors';
import moment from 'moment-timezone';
// import { join } from 'path';
// import { promises as fs } from 'fs';
// import { cwd } from 'process';
import { google } from 'googleapis';
import open from 'open';
import { createClient } from 'redis';
dotenv.config();

const port=process.env.PORT||8000;

const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH_CLIENT_ID,
  process.env.OAUTH_CLIENT_SECRET,
  process.env.OAUTH_REDIRECT_URI
);

const app = express();
app.use(cors());
// const corsOptions ={
//     origin:process.env.ORIGIN_URI, 
//     credentials:true,            
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));

app.use(session({
    secret:"abcdefghijklmnop",
    resave:true,
    saveUninitialized:true,
}));

app.use(passport.initialize());
app.use(passport.session());

const client =createClient({
  password:process.env.REDIS_PWD,
  socket: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
  }
});
client.on('error', err => console.log('Redis Client Error', err));
await client.connect();
client.on('connect',()=>{console.log("Redis Connected");});


mongoose.set("strictQuery",false);
mongoose.connect("mongodb+srv://"+process.env.DB_UID+":"+process.env.DB_PWD+"@cluster0.qirmb0u.mongodb.net/?retryWrites=true&w=majority");


const userSchema=new mongoose.Schema({
    username: String,
    email:String,
    password:String,
});
const noteSchema=new mongoose.Schema({
    notename:{type:String,default:" "},
    noteid:{type:String,default:" "},
    uid:String,
    notecontent:{type:String,default:" "}
});
const eventSchema=new mongoose.Schema({
    eventname:{type:String,default:" "},
    eventid:{type:String,default:" "},
    uid:{type:String,default:" "},
    location:{type:String,default:" "},
    description:{type:String,default:" "},
    startdate:{type:Date,default:Date.now},
    enddate:{type:Date,default:Date.now},
    starttime:{type:Date,default:Date.now},
    endtime:{type:Date,default:Date.now},
    timezone:{type:String,default:" "}
});

userSchema.plugin(passportLocalMongoose);

const User=mongoose.model("User",userSchema);
const Note=mongoose.model("Note",noteSchema);
const Event=mongoose.model("Event",eventSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
        return cb(null, {
            username: user.username
        });
    });
});
passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});


app.get("/",(req,res)=>{
  res.send("Welcome to eventforge backend");
});
app.post("/createnote",(req,res)=>{
    const note=new Note({
        notename:req.body.notename,
        uid:req.body.username,
        notecontent:req.body.notecontent
    });
    note.save();
    res.send(note);
});
app.post("/notenames", (req, res)=>{
  Note.find({uid:req.body.username}).then((notes)=>{
    res.send(notes);
  });
});
app.post("/notedetails",(req,res)=>{
    Note.find({uid:req.body.username,_id:req.body._id}).then((notes)=>{
        res.send(notes);
    });
});
app.post("/notedelete",(req,res)=>{
  Note.deleteOne({uid:req.body.uid,_id:req.body._id}).then(()=>{
      res.send("Deleted from mongoDB");
  });
});

app.post("/createevent",(req,res)=>{
    const newEvent=new Event({
        eventname:req.body.eventname,
        uid:req.body.username,
        location:req.body.location,
        description:req.body.description,
        startdate:req.body.startdate,
        enddate:req.body.enddate,
        starttime:req.body.starttime,
        endtime:req.body.endtime,
        timezone:req.body.timezone
    });
    newEvent.save().then(()=>{
        res.send(newEvent);
    });
});
app.post("/eventnames",(req,res)=>{
    Event.find({uid:req.body.username}).then((events)=>{
        res.send(events);
    });
});
app.post("/eventdetails",(req,res)=>{
    Event.find({uid:req.body.username,_id:req.body._id}).then((events)=>{
        res.send(events);
    });
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  try {
    const r = await oauth2Client.getToken(code);
    await oauth2Client.setCredentials(r.tokens);
    const calendar = google.calendar({version: 'v3', auth:oauth2Client});
    const caller = await client.get('caller');
    const details=await client.hGetAll('eventdetails');
    if(caller==="save")
    {
      const eventdetails = {
        'summary': details.eventname,
        'location': details.location,
        'description': details.description,
        'start': {
          'dateTime': details.startdatetime,
          'timeZone': details.timezone,
        },
        'end': {
          'dateTime': details.enddatetime,
          'timeZone': details.timezone,
        },
        'reminders': {
          'useDefault': false,
          'overrides': [
            {'method': 'email', 'minutes': 24 * 60},
            {'method': 'popup', 'minutes': 30},
          ],
        },
      };
      calendar.events.insert({
        auth: oauth2Client,
        calendarId: 'primary',
        resource: eventdetails,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          const redirectUrl = 'http://localhost:3000/events';
          res.redirect(302,redirectUrl);
        }
        else{
          const eventFinder={
            _id:details._id
            }
            Event.findOneAndUpdate(eventFinder,{eventid:event.data.id},{returnOriginal:false}).then((e)=>{console.log(e);});
            res.redirect(302,event.data.htmlLink);
        }
      });
    }
    else if(caller==="delete")
    {
      const calendarId='primary';
      const eventId=details.eventid;
      calendar.events.delete({calendarId , eventId }, (err) => {
          if (err) return console.error('Error deleting event:', err);
          const redirectUrl = 'http://localhost:3000/events';
          res.redirect(302,redirectUrl);
      });
    }
    

  } catch (error) {
    console.error('Error exchanging code for tokens:', error.message);
    res.status(500).send('Error exchanging code for tokens');
  }
});
app.post("/saveoncalendar",async(req,res)=>{
  await client.set('caller', 'save');
  await client.hSet('eventdetails', {
    uid:req.body.uid,
    _id:req.body._id,
    eventname: req.body.eventname,
    location: req.body.location,
    description: req.body.description,
    startdatetime:startDateTime(),
    enddatetime:endDateTime(),
    timezone:req.body.timezone
  });
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: "https://www.googleapis.com/auth/calendar"
    });
    open(url, {wait: false});

  function startDateTime(){
      const utcDate = new Date(req.body.startdate);
      const utcTime = new Date(req.body.starttime);
      // const localDate=utcDate.toLocaleString('en-US',{timeZone:req.body.timezone});
      const localDate=moment.tz(utcDate,req.body.timezone).format('YYYY-MM-DD HH:mm:ss');
      const localTime=moment.tz(utcTime,req.body.timezone).format('YYYY-MM-DD HH:mm:ss');
      return(localDate.substring(0,10)+'T'+localTime.substring(11,19));
  }
  function endDateTime(){
      const utcDate = new Date(req.body.enddate);
      const utcTime = new Date(req.body.endtime);
      // const localDate=utcDate.toLocaleString('en-US',{timeZone:req.body.timezone});
      const localDate=moment.tz(utcDate,req.body.timezone).format('YYYY-MM-DD HH:mm:ss');
      const localTime=moment.tz(utcTime,req.body.timezone).format('YYYY-MM-DD HH:mm:ss');
      return(localDate.substring(0,10)+'T'+localTime.substring(11,19));
  }
});

app.post("/eventdelete",async (req,res)=>{
    if(req.body.eventid!=" ")
    {
      await client.set('caller', 'delete');
      await client.hSet('eventdetails', {
        eventid:req.body.eventid
      });
      const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: "https://www.googleapis.com/auth/calendar"
      });
      open(url, {wait: false});
    }
    Event.deleteOne({uid:req.body.uid,_id:req.body._id}).then(()=>{
      res.send("Deleted from mongoDB");
    });
});

app.post("/register",(req,res)=>{
    User.register({username:req.body.username,email:req.body.email},req.body.password,(err,user)=>{
        if(err)
        {
          console.log(err);
          res.send("Registration error");
        }
        passport.authenticate("local")(req,res,()=>{
          req.session.user = user.username;
          req.session.save((err)=>{
            if(err)
            {
                console.log(err);
                res.send(err);
            }
            else
            {
                res.send(req.body);
            }
          });
        });
    });
});
app.post("/login",(req,res)=>{
    const user=new User({
        username:req.body.username,
        password:req.body.password
    });
    req.login(user,(err)=>{
      if(err)
        {
            res.send("Login error");
        }
        else
        {
            passport.authenticate("local")(req,res,()=>{
                req.session.user = user.username;
                req.session.save((err)=>{
                  res.send(req.body);
                });
            });
        }
    });
});


app.listen(port, function() {
    console.log("Server started successsfully");
});
