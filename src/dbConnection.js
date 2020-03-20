require('dotenv').config();
var oracledb = require('oracledb');


var sql = "INSERT INTO SRV_RSPNS VALUES (:1, :2, :3, :4)";

var options = {
  autoCommit: true,   // autocommit if there are no batch errors
  batchErrors: true  // identify invalid records; start a transaction for valid ones
};

const dbConfig={
     user: process.env.NODE_ORACLEDB_USER,
     password: process.env.NODE_ORACLEDB_PASSWORD,
    connectString: process.env.NODE_ORACLEDB_CONNECTION_STRING
}
const insertIntoDB=(arrItems)=>(oracledb.getConnection(dbConfig, function(err, connection) {
     if (err) {
          console.error(err.message);
          return;
     }

     connection.executeMany(sql, arrItems, options, function (err, result) {
       if (err)
         console.error(err);
       else {
         console.log("Result is:", result);
       }
     });
}));

let query=""
const updateRespInDB=(custodianName,appName)=>(oracledb.getConnection(dbConfig, function(err, connection) {
     if (err) {
          console.error(err.message);
          return;
     }

     connection.execute("update SRV_CSTDNS_APPS set rspns_rcvd='YES' where CSTDN_NM='"+custodianName + "' and APPL_NM='"+appName +"'",[] , options, function (err, result) {
       if (err)
         console.error(err);
       else {
         console.log("Result is:", result);
       }
     });
}));



let isSurveyAlreadySubmitted= (async function(cstName,appName) {
  let conn; // Declared here for scoping purposes

  try {
    conn = await oracledb.getConnection(dbConfig);

    console.log('Connected to database');
    let query="select RSPNS_RCVD from srv_cstdns_apps WHERE CSTDN_NM='"+cstName +"' AND APPL_NM='"+appName +"'"
  console.log(query);
    let result = await conn.execute(query
      ,
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





function doRelease(connection) {
     connection.release(
          function(err) {
               if (err) {console.error(err.message);}
          }
     );
}


module.exports={insertIntoDB,isSurveyAlreadySubmitted,updateRespInDB};
