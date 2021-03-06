const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

const UserSchema = new Schema({
    email: {        
        type: String,
        trim: true,
        lowercase: true,
        unique: true, },
    name: String,
    password: String,
    picture: String,
    isSeller: { type: Boolean, default: false },
    address: {
        addr1: String,
        addr2: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
    },
    created: { type: Date, default: Date.now },
});

// encrept password with bcrypt lib
UserSchema.pre('save', function save(next) {
    let user = this;
    if (!user.isModified('password')) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) { return next(err); }
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) { return next(err); }
        user.password = hash;
        next();
      });
    });
  });

//comparing password input with database password 
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}


//get image for user from gravatar 
UserSchema.methods.gravatar = function (size) {
    if (!size)  size = 200;

    if (!this.email) {
        return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
    } else {
   
        var md5 = crypto.createHash('md5').update(this.email).digest('hex');

        return 'https://gravatar.com/avatar/' + md5 + '?s' + size + '&d=retro';
    }

}

module.exports = mongoose.model('User', UserSchema);