// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'us-east-2'});

var cloudformation = new AWS.CloudFormation({apiVersion: '2010-05-15'});

  var params = {

    PhysicalResourceId: 'AdvStackSecurityGroup2'

  };
  cloudformation.describeStackResources(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data.StackResources[0].StackName);           // successful response
  });



