const QRCode = require('qrcode');
/**
 * Creates a qr code(s) from `public_keys`
 * @param public_keys storing either a single or many public keys
 * @returns {string[]} an array of base64 images
 */
function create(public_keys) {
    // if(typeof(public_keys)==="undefined") return undefined;
    if(typeof(public_keys)==="string") public_keys = [public_keys];
    const images =  public_keys.map(async key => {
        let data = "http://web.prokopark.us/spot/pay/"+key;

        // Converting the data into String format
        let stringData = JSON.stringify(data)

        // Converting the data into base64
        const e = await QRCode.toDataURL(stringData, async (err, data) => {
            if(err) return err;
            return data;
        });
        console.log(e)
    });
    return images;

}


module.exports = {
    create
};
