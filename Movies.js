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

//movie schema
var MovieSchema = new Schema({
    Title: { type: String, required: true},
    Year: { type: String, required: true},
    Genre: { type: String, required: true},
    Actors: { type: Array, required: true},
    imageUrl: {type: String}
});


//return the model to server
module.exports = mongoose.model('Movie', MovieSchema);
