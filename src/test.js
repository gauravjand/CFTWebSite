//
// DBConnector.prototype.execute_function = function (queryCode, params) {
//
//     var that = this,
//         d = globals.$.Deferred();
//     oracledb
//         .getConnection(this.oracleConf)
//         .then(function (conn) {
//
//             var qry = that.queryDictionary.getQuery(queryCode, params);
//             console.log(qry);
//             return conn.execute(qry, {
//                 cursor: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
//             }, function (err, result) {
//                 //  conn.close();
//                 // d.resolve(result.rows)
//                 if (err) {
//                     console.error("error execute_proc:", err);
//                     // cursor.close()
//                     doRelease(conn);
//                     // d.reject(err);
//                     return;
//                 }
//                 // console.log('out binds================================='+JSON.stringify(result.outBinds.cursor.metaData));
//                 fetchRowsFromRS(conn, result.outBinds.cursor, 5000)
//                     .done(res => {
//                         d.resolve(res);
//                     })
//                     .fail(err => {
//                         d.reject(err+'abcd==========================');
//                         doRelease(conn);
//                     });
//             })
//         })
//         .catch(function (err) {
//             console.error("error getConnection:", err);
//             // d.reject(null);
//         });
//
//     return d.promise();
// };
//
//
// getCustAuditAppName: function getCustAuditAppName (req, res) {
//       if(req.query.c_tech == 'Oracle') {
//       globals.db.execute_function('getCustAuditAppName', {globalID: req.query.globalId, srchTxt: req.query.c_searchText})
//           .done(function (result) {
//               res.send(result);
//           });
//       }
//       else if(req.query.c_tech == 'SQL') {
//           globals.db.execute_function('getCustAuditAppNameSQL', {globalID: req.query.globalId, srchTxt: req.query.c_searchText})
//           .done(function (result) {
//               res.send(result);
//           });
//       }
//       else {
//           globals.db.execute_function('getCustAuditAppNameNetezza', {globalID: req.query.globalId, srchTxt: req.query.c_searchText})
//           .done(function (result) {
//               res.send(result);
//           });
//       }
//   }
// }
//
//
