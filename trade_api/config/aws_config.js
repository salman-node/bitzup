//****************************
//Changes made in this file by madhav on 23-may-2023
//============================

const AWS = require("aws-sdk");
require('dotenv').config();


AWS.config.update({
    accessKeyId: "AKIAVW73WGDXA2TKCGAB",
    secretAccessKey: "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",
    region: "ap-south-1"
})

module.exports.OldUpload = function (folder_name, uniqname, type, file) {
    const myDate = new Date()
    const month = myDate.getMonth() + 1
    const dateformat = type + "_" + myDate.getDate() + month + myDate.getFullYear() + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds() + myDate.getMilliseconds()
    const extname = file.originalname
    const lextenstion = extname.split('.')
    // Adding image name is in userid , 
    var keyName = folder_name + uniqname + "_" + dateformat + "." + lextenstion[lextenstion.length - 1]
    var params = {
        ACL: 'public-read',
        Bucket: 'bitzees',
        Key: keyName,
        Body: file.buffer,
    };
    s3.putObject(params, async function (err, data) {
        if (err) console.log(err);
        /* else
             console.log(
                 'Successfully uploaded data to ' +  '/' + keyName
             ); */
            });
            const url = `https://bitzees.nyc3.cdn.digitaloceanspaces.com/${keyName}`
            return url
        }
        
        
        module.exports.Upload = function (folder_name, uniqname, type, file) {
            return new Promise(function (resolve, reject) {
        
        
        
                // this function will upload file to aws and return the link
                let s3 = new AWS.S3({
                    apiVersion: '2006-03-01',
                });
             
                const myDate = new Date()
                const month = myDate.getMonth() + 1
                const dateformat = type + "_" + myDate.getDate() + month + myDate.getFullYear() + myDate.getHours() + myDate.getMinutes() + myDate.getSeconds() + myDate.getMilliseconds()
                const extname = file.originalname
                const lextenstion = extname.split('.')
                // Adding image name is in userid , 
                var keyName = folder_name + uniqname + "_" + dateformat + "." + lextenstion[lextenstion.length - 1]
        
                console.log(keyName);
        
                var uploadParams = {
        
                    Bucket: "bitzees",
                    Key: keyName,
                    Body: file.buffer
                }
        
        
                s3.upload(uploadParams, function (err, data) {
                    if (err) {
                        console.log(err);
                        return reject({ "error": err });
                    }
                    console.log(data);
                    console.log("file uploaded succesfully");
                    console.log(data.Location);
                    return resolve(data.Location)
                })
        
        
        
            })
        }


// const AWS = require("aws-sdk");
// const fs = require("fs");
// const dotenv = require("dotenv");
// require('dotenv').config();
// let DO_ENDPOINT = "https://nyc3.digitaloceanspaces.com/";
// let DO_ACCESS_KEY_ID = "DO00GKDLH8CKM9MD7HEH";
// let DO_SECRET_ACCESS_KEY = "J7IOYKzJbZqAjjh/PKVG1pWilCUDrtRwz8lZuz8sjrU";
// var DO_SPACE = "bitzees";
// // Create an S3 clientvar
//  s3 = new AWS.S3({
//     endpoint: DO_ENDPOINT, 
//     accessKeyId: DO_ACCESS_KEY_ID, 
//     secretAccessKey: DO_SECRET_ACCESS_KEY
// });
// module.exports.Upload = function(folder_name,uniqname,type,file){
//     const myDate = new Date()
//     const month = myDate.getMonth()+1   
//      const dateformat = type + "_"  + myDate.getDate() + month+ myDate.getFullYear()+ myDate.getHours()+ myDate.getMinutes()+ myDate.getSeconds() +myDate.getMilliseconds()
//     const extname = file.originalname   
//      const lextenstion = extname.split('.')
//     // Adding image name is in userid ,
//      var keyName = folder_name + uniqname + "_" +  dateformat + "." + lextenstion[lextenstion.length-1]
//      console.log('keyname',keyName)
// var params = {
//     ACL: 'public-read',
//     Bucket: 'bitzees',
//     Key: keyName,
//     Body: file.buffer,
// };
// s3.putObject(params, async function(err, data) {  
//     if (err) console.log(err);
// });
// const url =  `https://bitzees.nyc3.cdn.digitaloceanspaces.com/${keyName}`
// return url}
