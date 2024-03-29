const QRCode = require('qrcode');
/**
 * Creates a qr code(s) from `public_key`
 * @param public_keys storing either a single key
 * @returns {string[]} an array of base64 images
 */
async function create(public_key) {
    // if(typeof(public_keys)==="undefined") return undefined;
    const data = "http://web.prokopark.us/spot/pay/"+public_key;
    // Converting the data into base64
    const base64 = await QRCode.toDataURL(data, {
        errorCorrectionLevel: 'H',
        margin : 2,
        width : 2048,
        color: {
            light: '#0000',
        },
    });
    return base64;
}


module.exports = {
    create,
};
