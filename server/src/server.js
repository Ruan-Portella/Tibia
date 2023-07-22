const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 4000;
const MONGO = process.env.MONGODB_URI;

mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
})).catch((err) => {
    console.log(err.message);
});
