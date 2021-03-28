var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

//mongoose.connect(process.env.DB, { useNewUrlParser: true });
try {
    mongoose.connect( process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("connected"));
}catch (error) {
    console.log("could not connect");
}
mongoose.set('useCreateIndex', true);

//Review schema
var ReviewSchema = new Schema({
    Name: { type: String, required: true},
    Title: { type: String, required: true},
    Quote: { type: String, required: true},
    Rating: { type: String, required: true}

});


//return the model to server
module.exports = mongoose.model('Review', ReviewSchema);