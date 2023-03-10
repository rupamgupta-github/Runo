const slotModel = require("../model/covidslotModel");
const userModel = require("../model/usermodel");
const errorHandler = require('../errorhandler/errorhandler');

const createSlot = async function (req, res) {
  try {
    let data = req.body;
    data['Date'] = new Date(data['Date']);
    if(data['Date'] == "Invalid Date")
    {
      return res.status(400).send({ status : false , msg : "please provide date in YYYY-MM-DD Format"})
    }
    data["slots"] = [];
    let startTime = 10;    
    for (let i = 0; i < 7; i++) {
      let x = "00";
      for (let j = 1; j <= 2; j++) {
        {
          data["slots"].push({ slotsTime: `${startTime}:${x}`, patients: [] });
          x = "30";
        }
      }
      startTime = startTime + 1;
    }
    const createSlot = await slotModel.create(data);
    return res.status(201).send({ status: true, msg: createSlot });
  } catch (err) {
    return errorHandler(err, res);
  }
};
const bookSlot = async function (req, res) {
  try {
    let userId = req.params.userId;// add pincode and hospital 
    let data = req.body
    let slotsTime = data.slotsTime; 
    if(!slotsTime) return res.status(400).send({status : false , msg : "please provide slot time to BookSlot"})
    let query = {}
    let { PinCode , Hospital , ...x } = data
    if(PinCode && Hospital)
    {
      query['PinCode'] = PinCode
      query['Hospital'] = Hospital
    }else { return res.status(400).send({ status : false , msg : " Please enter PinCode and Hospital Name to book slot"})}
    let slot = await slotModel.findOne(query).lean();  
    for (let i = 0; i < slot["slots"].length; i++) {
      if (slotsTime == slot["slots"][i].slotsTime) {
        if (slot["slots"][i].slotsBooked > 9) {
          return res.status(400).send({
            status: false,
            msg: "slots are full for this timeSlot please try Other time slot",
          });
        }
        slot["slots"][i].patients.push(userId);
        slot["slots"][i].slotsBooked += 1;
      }
    }
    const slotBook = await slotModel.findOneAndUpdate(
      { _id: slot._id },
      { $set: { ...slot } },
      { runValidators: true }
    );
    return res
      .status(201)
      .send({ status: true, msg: slotBook });
  } catch (err) {
    return errorHandler(err, res);
  }
};
module.exports = { createSlot, bookSlot };
