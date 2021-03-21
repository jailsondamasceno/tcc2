const functions = require("firebase-functions");
const admin = require('firebase-admin');
const cors = require('cors')({
    origin: true
});

admin.initializeApp();
const db = admin.firestore()
const internToken = '9a3e0058a226d3074a68a29813fc136b'

exports.saveLevelStation = functions.https.onRequest((req, res) => {
    cors(req, res, async() => {
        try {
            if (!req.body.token || req.body.token !== internToken) {
                return res.status(403).send('Acesso restrito!')
            }
            if (!req.body.station) {
                return res.status(500).send('Estação inválida!')
            }
            if (!req.body.level || typeof(req.body.level) !== "number" || (req.body.level > 3 || req.body.level < 1)) {
                return res.status(500).send('Nível inválido!')
            }
            const dateEn = await convertDate(new Date().getTime(), 'time', 'en', '-')
            const start = new Date(`${dateEn} 00:01:00`).getTime()
            const end = new Date(`${dateEn} 23:59:00`).getTime()

            const saved = await db.collection('stations').doc(req.body.station.id).collection('levels')
                .where('level', '==', req.body.level)
                .where('date', ">=", start).where('date', '<=', end).limit(1).get()

            if (saved.docs.length) {
                return res.status(200).send('Dado já existe no banco de dados!')
            }

            const level = {
                station: req.body.station,
                level: req.body.level,
                date: Date.now(),
                dateFormated: await convertDate(new Date().getTime(), 'time', 'pt', '-')
            }

            await db.collection('stations').doc(level.station.id).collection('levels').add(level)

            res.status(200).send('Nível atualizado com sucesso!')
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    })
});



const convertDate = async(date, format_ent, format_exit, separator) => {
    var d = [];
    if (format_ent !== 'time') {
        d = date.split(separator)
    }
    var date_return = ''

    if (format_ent === 'pt' && format_exit === 'en') {
        date_return = `${d[2]}${separator}${d[1]}${separator}${d[0]}`
    }
    if (format_ent === 'pt' && format_exit === 'time') {
        var new_date = `${d[2]}${separator}${d[1]}${separator}${d[0]}`
        date_return = new Date(new_date).getTime();
    }

    if (format_ent === 'en' && format_exit === 'pt') {

        date_return = `${d[2]}${separator}${d[1]}${separator}${d[0]}`
    }
    if (format_ent === 'en' && format_exit === 'time') {
        date_return = new Date(date).getTime();
    }

    if (format_ent === 'time' && format_exit === 'pt') {
        const dat = new Date(parseInt(date))
        const day = dat.getDate().toString().length == 1 ? `0${dat.getDate()}` : dat.getDate()
        const month = dat.getMonth() + 1
        const month_format = month.toString().length == 1 ? `0${month}` : month
        date_return = `${day}${separator}${month_format}${separator}${dat.getFullYear()}`;

    }
    if (format_ent === 'time' && format_exit === 'en') {
        const dat = new Date(parseInt(date))
        const day = dat.getDate().toString().length == 1 ? `0${dat.getDate()}` : dat.getDate()
        const month = dat.getMonth() + 1
        const month_format = month.toString().length == 1 ? `0${month}` : month
        date_return = `${dat.getFullYear()}${separator}${month_format}${separator}${day}`;
    }


    return date_return

}