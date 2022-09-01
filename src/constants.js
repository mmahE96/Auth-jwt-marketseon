require('dotenv').config()

const auth={
    type:'OAuth2',
    user:'info@marketseon.com',
    clientId:process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    refreshToken:process.env.REFRESH_TOKEN
    
}

const mailoptions = {
    from:'Mahir <info@marketseon.com>',
    to:'info@marketseon.com',
    subject:'Contact Form',
}
module.exports={
    auth,
    mailoptions
}