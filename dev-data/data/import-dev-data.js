const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './../../config.env' });
const fs = require('fs');
const Tour = require('./../../models/tourModel');


const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('db connection successful!'));


//Read file

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

//import data into db

const importData = async () => {
    try{
        await Tour.create(tours);
        console.log('Data successfully loaded')
    }catch(err){
        console.log(err)
    }
}

//deletting all data from db

const deleteData = async () => {
    try{
        await Tour.deleteMany();
        console.log('Data successfully deleted')
        process.exit()
    }catch(err){
        console.log(err)
        process.exit()
    }
}

if (process.argv[2] === '--import') {
    importData()
}else if(process.argv[2] === '--delete') {
    deleteData()
}
console.log(process.argv)