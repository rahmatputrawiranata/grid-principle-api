import sgMail from '@sendgrid/mail'

const {
    EMAIL_FROM,
    SENDGRID_KEY
} = process.env

const sendEmail = async(param : {
    to: string;
    subject: string;
    text: string;
}) => {
    if(!SENDGRID_KEY) {
        throw new Error("Sendgrid key were not set in env file")
    }
    sgMail.setApiKey(SENDGRID_KEY)
    if(!EMAIL_FROM) {
        throw new Error("Email from were not set in env file")
    }

    const msg = {
        from: EMAIL_FROM,
        ...param
    }

    sgMail
        .send(msg)
        .then(() => {
            console.log('Email Send')
        })
        .catch((err) => {
            console.log(err)
        })
}

export default sendEmail