
const nodemailer = require('nodemailer');
var oracledb = require('oracledb');
const queryString = require('querystring');
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

const dbConfig = {
  user: process.env.NODE_ORACLEDB_USER,
  password: process.env.NODE_ORACLEDB_PASSWORD,
  connectString: process.env.NODE_ORACLEDB_CONNECTION_STRING
};

const updateEmailSent=(cstdnName)=>(oracledb.getConnection(dbConfig, function(err, connection) {
     if (err) {
          console.error(err.message);
          return;
     }
     let query="update srv_cstdns_apps set EMAIL_SNT_DT=to_date('" + formatDate(new Date()) + "','YYYY-MM-DD') where CSTDN_NM='"+cstdnName +"'";
     console.log(query);
     connection.execute(query,
     [],{ autoCommit: true },
     function(err, result) {
          if (err) {
               console.error(err.message);
               doRelease(connection);
               return;
          }
//          console.log(result.metaData);
  //        console.log(result.rows);
          doRelease(connection);
     });


}));

function doRelease(connection) {
     connection.release(
          function(err) {
               if (err) {console.error(err.message);}
          }
     );
}










let custodianDetail= (async function() {
  let conn; // Declared here for scoping purposes

  try {
    conn = await oracledb.getConnection(dbConfig);

    console.log('Connected to database');

    let result = await conn.execute(
      'select * from srv_cstdns_apps where RSPNS_RCVD is null',
      [], // no binds
      {
        outFormat: oracledb.OBJECT
      }
    );

    console.log('Query executed');
    //console.log(result);
    return result
    //console.log(result.rows);
  } catch (err) {
    console.log('Error in processing', err);
  } finally {
    if (conn) { // conn assignment worked, need to close
      try {
        await conn.close();

        console.log('Connection closed');
      } catch (err) {
        console.log('Error closing connection', err);
      }
    }
  }
});
let custodianNames= (async function() {
  let conn; // Declared here for scoping purposes

  try {
    conn = await oracledb.getConnection(dbConfig);

    console.log('Connected to database');

    let result = await conn.execute(
      'select distinct CSTDN_NM,EMAIL_ADDRS from SRV_CSTDNS_APPS where email_snt_dt is null and rownum<20',
      [], // no binds
      {
        outFormat: oracledb.OBJECT
      }
    );

    console.log('Query executed');
    //console.log(result);
    return result
    //console.log(result.rows);
  } catch (err) {
    console.log('Error in processing', err);
  } finally {
    if (conn) { // conn assignment worked, need to close
      try {
        await conn.close();

        console.log('Connection closed');
      } catch (err) {
        console.log('Error closing connection', err);
      }
    }
  }
});

let dataDetails;
let dataNames;
async function run() {

   dataDetails = await custodianDetail();
   dataNames = await custodianNames();
   var arrObjDetails=Object.values(dataDetails.rows);
   var arrObjNames=Object.values(dataNames.rows);
   var emailBodyList="";
 var emailBody=`Global Data Management is conducting a migration assessment to determine level of complexity for today’s on premise Oracle database environments to migrate to an opensource database alternative. This aligns with Lilly’s “cloud first” direction as well as having potential to decrease costs moving to more innovative and less costly database platforms available in the market today.<br>

We are reaching out to individuals listed as custodians in our GDM inventory to supply us with a bit of information about the applications on Oracle databases today via the survey link below. This research will help us project the costs in an opensource environment, determine the variety of database platforms needed if applications moved their databases off Oracle and the benefit which could be derived.<br>

Please consider this internal to Lilly, while you can reach out to your vendor let’s not discuss scope of this effort.<br>
<br>
Please fill out the survey for following applications as you are listed as custodian for them:<br><br>
`

emailBodyList+="<ul>"

var greetings=""
  for(var i=0;i<arrObjNames.length;i++){
//      console.log("Applications owned by "+ arrObjNames[i]["CSTDN_NM"]);
greetings="Hello " + arrObjNames[i]["CSTDN_NM"] +",<br><br>"
      for(var j=0;j<arrObjDetails.length;j++){
          if(arrObjNames[i]["CSTDN_NM"] === arrObjDetails[j]["CSTDN_NM"])
          {
            emailBodyList+="<li><a href='http://40.36.147.7:3000/survey?custodian="+ arrObjNames[i]["CSTDN_NM"] +"&appName=" + queryString.escape(arrObjDetails[j]["APPL_NM"]) +"'>" + arrObjDetails[j]["APPL_NM"] + "</a>"
            // var strEscaped=queryString.escape(arrObjDetails[j]["APPL_NM"])
            // console.log(strEscaped);
            // var strUnescaped=queryString.unescape(strEscaped)
            // console.log(strUnescaped);

          }
        //

      }
      emailBodyList+="</ul>"
      let retSendEmail=null;



      sendMail(arrObjNames[i]["CSTDN_NM"],arrObjNames[i]["EMAIL_ADDRS"],"Oracle Migration Assessment Survey",greetings + emailBody + emailBodyList)

      emailBodyList=""
  }

}
function intDummy()
{

}
let emailSentTo=""
    // send mail
const sendMail= function sendMail(nm,to,subject,body) {


  var from = 'GDM_Service_Communication@lilly.com';
  var reply ='jandga@lilly.com';

                  nodemailer.createTestAccount((err, account) => {

                  let transporter = nodemailer.createTransport({
                      host: 'smtp-z1-nomx.lilly.com',
                      port:25
                  });


                        let mailOptions = {
                            from: from,
                            to: to,
                            subject: subject,
                            html: body,
                            replyTo: reply

                        };
                        transporter.sendMail(mailOptions, (error, info) => {
                              if (error) {
                                 emailSentTo=emailSentTo+ to +","
                                  console.log(error)

                              }
                              else {

                                  updateEmailSent(nm);
                              }
                              console.log(info);


                          });



                  });
return emailSentTo;
        }





module.exports=run
