const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


// Lets imagine that we have a database of doctors, now we can send the doctors list to the client through "http://notable-health.herokuapp.com/doctors"
// and the client can send the doctor id to the server and the server can send the doctor details to the client

const doctors = {
    '1':{
        name: 'Dr. John Doe', 
        appointments:{
            '01-27-2020':{"7:30:05 AM":['New Patient','New Patient']},
            '01-28-2020':{"10:30:05 AM":'New Patient',"7:00:05 AM":'New Patient'}
    }
},

    '2':{ 
        name: 'Dr. Jane Ari',
        appointments:{
            '05-07-2021':{"7:00:05 AM":'New Patient',"7:00:05 AM":'New Patient'}
        }
},

    '3':{ 
        name: 'Dr. John Smith',
        appointments:{
            '05-07-2021':{"7:00:05 AM":'New Patient'}
        }
    },
}

const doctorIndex = {
    'John Doe' : '1',
    'Jane Ari' : '2',
    'John Smith' : '3',
}

const port = process.env.PORT || 3000;


app.get('/doctors', function(req, res){
    res.send(doctors);
});

app.get('/doctors/:doctorsName/:day', function(req, res){
    
    const doctorsName = req.params.doctorsName;                 
    const day = req.params.day;                 
    try{
        var doctorId = doctorIndex[doctorsName];                    
        res.send(doctors[doctorId]['appointments'][day]);               
    }catch(e){
        res.send({});
    }
});

app.delete('/doctors/:doctorsName/:day/:time', function(req, res){
    const doctorsName = req.params.doctorsName;         
    const day = req.params.day;         
    const time = req.params.time;
    try{
        var doctorId = doctorIndex[doctorsName];
        delete doctors[doctorId]['appointments'][day][time];
        res.send("Doctor's Appointement deleted successfully");
    }
    catch(e){
        res.send({});
    }
});

app.post('/doctors/:doctorsName/:day/:time', function(req, res){
    const doctorsName = req.params.doctorsName;
    const day = req.params.day;
    const time = req.params.time;
    var validTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;                    //valid time format is HH:MM
    var validDate = /^(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])-(19|20)\d\d$/;
    
    if(validTime.test(time) && validDate.test(day)){
        var validappointment =  time.getminutes()%15 == 0;           //valid appointment time is 15 minutes interval
        var clash = len(doctors[doctorIndex[doctorsName]]['appointments'][day][time])<3;        //check if the appointment is full
        if(validappointment && clash){
            try{

                var doctorId = doctorIndex[doctorsName];
                doctors[doctorId]['appointments'][day][time] = 'New Patient';
                res.send("Doctor's Appointement added successfully");
    }
    catch(e){
        res.send({});
    }}}
});


