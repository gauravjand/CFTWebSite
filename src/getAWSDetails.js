require('dotenv').config();



var AWS = require('aws-sdk');

const getCFTDetails=function(roleName){


// Set the region 
AWS.config.update({region: 'us-east-2'});

var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

  var params = {

    PhysicalResourceId: roleName

  };
  cloudformation.describeStackResources(params, function(err, data) {
    if (err) return "No stack found for the role " + roleName
    else     return data.StackResources[0].StackName;           // successful response
  });

}
 
module.exports={getCFTDetails};
