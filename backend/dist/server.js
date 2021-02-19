"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var port = process.env.PORT || 8080;
//const hostname = "127.0.0.1";
var cors = require("cors");
var app = express();
var endpoint = "http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl";
var soap = require("soap");
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
};
app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.post("/validate", function (req, res) {
    var country = req.body.countryCode;
    var vat = req.body.vatNumber;
    var params = {
        countryCode: country,
        vatNumber: vat,
    };
    soap.createClient(endpoint, function (err, client) {
        client.checkVat(params, function (err, result) {
            res.status(201).send(result);
        });
    });
});
if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
    });
}
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
});
app.listen(port);
console.log("App listen " + port);
