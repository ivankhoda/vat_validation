import { ResponseData, ValidationData } from "./types/Types";

const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 8080;
//const hostname = "127.0.0.1";
var cors = require("cors");
const app = express();
const endpoint =
  "http://ec.europa.eu/taxation_customs/vies/checkVatService.wsdl";
const soap = require("soap");
var allowCrossDomain = function (
  req: any,
  res: { header: (arg0: string, arg1: string) => void },
  next: () => void
) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.post("/validate", (req: any, res: any) => {
  let country = req.body.countryCode;
  let vat = req.body.vatNumber;
  let params = {
    countryCode: country,
    vatNumber: vat,
  };

  soap.createClient(
    endpoint,
    (
      err: any,
      client: {
        checkVat: (
          arg0: ValidationData,
          arg1: (err: any, result: any) => void
        ) => void;
      }
    ) => {
      client.checkVat(params, (err: any, result: ResponseData) => {
        res.status(201).send(result);
      });
    }
  );
});

if (app.get("env") === "development") {
  app.use(
    (
      err: { status: any },
      req: any,
      res: { status: (arg0: any) => void },
      next: any
    ) => {
      res.status(err.status || 500);
    }
  );
}

app.use(
  (
    err: { status: any },
    req: any,
    res: { status: (arg0: any) => void },
    next: any
  ) => {
    res.status(err.status || 500);
  }
);

app.listen(port);
console.log(`App listen ${port}`);
