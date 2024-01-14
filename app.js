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
import { join } from 'path';
import { cwd } from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
// import { log } from 'console';

dotenv.config();
const app = express();
app.use(cors());
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));

app.use(session({
    secret:"abcdefghijklmnop",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("strictQuery",false);
mongoose.connect("mongodb+srv://"+process.env.DB_UID+":"+process.env.DB_PWD+"@cluster0.qirmb0u.mongodb.net/?retryWrites=true&w=majority");
// mongoose.connect("mongodb://127.0.0.1/productivityDB");

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



app.post("/createnote",(req,res)=>{
    const note=new Note({
        notename:req.body.notename,
        uid:req.body.username,
        notecontent:req.body.notecontent
    });
    note.save();
    console.log("Note Created Successfully");
    res.send(note);
});
app.post("/notenames", (req, res)=>{
    console.log(req.body.username);
  Note.find({uid:req.body.username}).then((notes)=>{
    res.send(notes);
    console.log("Sent Successfully");
  });
});
app.post("/notedetails",(req,res)=>{
    Note.find({uid:req.body.username,_id:req.body._id}).then((notes)=>{
        res.send(notes);
        console.log("Sent Successfully");
    });
});
app.post("/notedelete",(req,res)=>{
  // const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
  // const CREDENTIALS_PATH = join(cwd(), 'credentials.json');    
  // async function authorize() {
  //   let client = await authenticate({
  //     scopes: SCOPES,
  //     keyfilePath: CREDENTIALS_PATH,
  //   });
  //   return client;
  // }
  // console.log(eventName);
  Note.deleteOne({uid:req.body.uid,_id:req.body._id}).then(()=>{
      res.send("Deleted from mongoDB");
  });

  // async function deleteEvent(auth){
  //     const calendar = google.calendar({version: 'v3', auth});
  //     const calendarId='primary';
  //     const eventId=req.body.eventid;
  //     calendar.events.delete({calendarId , eventId }, (err) => {
  //         if (err) return console.error('Error deleting event:', err);
  //         console.log('Event deleted successfully.');
  //     });
  // }
  // authorize().then(deleteEvent).catch(console.error);
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
    // console.log(newEvent);
    newEvent.save().then(()=>{
        console.log("Event created successfully");
        res.send(newEvent);
    });
});
app.post("/eventnames",(req,res)=>{
    Event.find({uid:req.body.username}).then((events)=>{
        res.send(events);
        console.log("Event names Sent Successfully");
    });
});
app.post("/eventdetails",(req,res)=>{
    Event.find({uid:req.body.username,_id:req.body._id}).then((events)=>{
        res.send(events);
        console.log("Event details Sent Successfully");
    });
});
app.post("/saveoncalendar",(req,res)=>{
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
    console.log(startDateTime());
    console.log(endDateTime());
    const SCOPES = ['https://www.googleapis.com/auth/calendar'];
    const CREDENTIALS_PATH = join(cwd(), 'credentials.json');    
    async function authorize() {
      let client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
      });
      return client;
    }
    async function listEvents(auth) {
      const calendar = google.calendar({version: 'v3', auth});
      const eventdetails = {
        'summary': req.body.eventname,
        'location': req.body.location,
        'description': req.body.description,
        'start': {
          'dateTime': startDateTime(),
          'timeZone': req.body.timezone,
        },
        'end': {
          'dateTime': endDateTime(),
          'timeZone': req.body.timezone,
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
        auth: auth,
        calendarId: 'primary',
        resource: eventdetails,
      }, function(err, event) {
        if (err) {
          console.log('There was an error contacting the Calendar service: ' + err);
          return;
        }
        console.log('Event created');
        // console.log(event.data.id);
        // console.log(event.data.htmlLink);
        const eventFinder={
            uid:req.body.uid,
            eventname:req.body.eventname,
            location:req.body.location,
            description:req.body.description,
            startdate:req.body.startdate,
            enddate:req.body.enddate,
            starttime:req.body.starttime,
            endtime:req.body.endtime,
            timezone:req.body.timezone,
        }
        Event.findOneAndUpdate(eventFinder,{eventid:event.data.id},{returnOriginal:false}).then((e)=>{console.log(e);});
      });
    }
    authorize().then(listEvents).catch(console.error);
});

app.post("/eventdelete",(req,res)=>{
    const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
    const CREDENTIALS_PATH = join(cwd(), 'credentials.json');    
    async function authorize() {
      let client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
      });
      return client;
    }
    // console.log(eventName);
    Event.deleteOne({eventid:req.body.eventid}).then(()=>{
        console.log("Deleted from mongoDB");
    });

    async function deleteEvent(auth){
        const calendar = google.calendar({version: 'v3', auth});
        const calendarId='primary';
        const eventId=req.body.eventid;
        calendar.events.delete({calendarId , eventId }, (err) => {
            if (err) return console.error('Error deleting event:', err);
            console.log('Event deleted successfully.');
        });
    }
    authorize().then(deleteEvent).catch(console.error);
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
            console.log("Login error");
            res.send("Login error")
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





app.listen(8000, function() {
    console.log("Server started successsfully");
});