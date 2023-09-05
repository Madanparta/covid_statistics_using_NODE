const { connection } = require('./connector')
const { data } = require('./data')
const express = require('express');
const createData = express.Router()


// const refreshAll = async () => {
//     await connection.deleteMany({})
//     // console.log(connection)
//     await connection.insertMany(data)
// }
// refreshAll()

createData.get("/totalRecovered", async (req, res) => {
  const totalRecovered = await connection.aggregate([
    { $group: { _id: "total", recovered: { $sum: "$recovered" } } },
  ]);
  res.json({ data: totalRecovered[0] });
});

createData.get("/totalActive", async (req, res) => {
  const totalActive = await connection.aggregate([
    {
      $group: {
        _id: "total",
        active: { $sum: { $subtract: ["$infected", "$recovered"] } },
      },
    },
  ]);
  res.json({ data: totalActive[0] });
});


createData.get("/totalDeath", async (req, res) => {
  const totalDeath = await connection.aggregate([
    { $group: { _id: "total", death: { $sum: "$death" } } },
  ]);
  res.json({ data: totalDeath[0] });
});


createData.get('/hotspotStates', async (req, res) => {
    const hotspotStates = await connection.aggregate([{$addFields: {rate: {$round: [{$subtract: [{$divide: [{$subtract:["$infected", "$recovered"]}, "$infected"]}, 1]}, 5]}}}, {$match:{rate : {$gt : 0.1}}}, {$project:{_id : 0, state : "$state", rate : "$rate"}}]);
    res.json({data: hotspotStates});
  });

  createData.get('/healthyStates', async (req, res) => {
    const healthyStates = await connection.aggregate([{$addFields:{mortality : {$round : [{$divide:["$death","$infected"]},5]}}}, {$match:{mortality : {$lt : 0.005}}}, {$project:{_id : 0, state : "$state", mortality : "$mortality"}}]);
    res.json({data: healthyStates});
  });



module.exports = createData

