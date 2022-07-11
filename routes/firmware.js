var express = require('express');
var router = express.Router();

const moment = require('moment');
const fs = require('fs')
const firmwareVersionModel = require('../database/model/firmwareVersionModel');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const sha256File = require('sha256-file');
const s3_service = require('../services/s3-upload');

/* GET firmware page */
router.get('/', async function (req, res, next) {
    try {
        const data = await firmwareVersionModel.getWithNumSpots();
        res.render('page/firmware/firmware.ejs', { title:"ProkoPark - Firmware", data, moment });
    } catch (err){
        res.send(err)
    }
});

/**
 * Upload new firmware version
 * @middleware upload.fields([{ name: 'esp8266'}, { name: 'esp32'}]) saves the files in the uploads folder
 * @param {string} req.body.version is the identifer of the new ESP8266 and ESP32 uploaded
 * @param {Object[]} req.files.ESP32 is the file uploaded for ESP32
 * @param {Object[]} req.files.ESP8266 is the file uploaded for ESP8266
 */
router.post('/upload', upload.fields([{ name: 'ESP32' },{ name: 'ESP8266' }]), async function (req, res, next) {
    try {
        const { ESP32, ESP8266 } = req.files;
        const version = req.body.version

        if (ESP32 == undefined || ESP8266 == undefined || version == '') {
            res.status(401).send('All fields are required');
            return;
        }

        const firmwareVersions = await firmwareVersionModel.getByVersion(version);
        const isFirmwareExists = firmwareVersions.length !== 0;
        if (isFirmwareExists) {
            res.status(401).send(`Version ${version} already exists`);
            return;
        }

        const pathESP32 = ESP32[0].path;
        const pathESP8266 = ESP8266[0].path;
        const ESP32FileName = sha256File(pathESP32) + '.ESP32-v' + version + '.bin';
        const ESP8266FileName = sha256File(pathESP8266) + '.ESP8266-v' + version + '.bin';

        const s3InfoESP32 = await s3_service.upload(pathESP32, ESP32FileName);
        const s3Info2ESP8266 = await s3_service.upload(pathESP8266, ESP8266FileName);
        const uploadPayload = {
            version: req.body.version,
            ESP32_url: s3InfoESP32.Location,
            ESP8266_url: s3Info2ESP8266.Location,
            ESP32_file_name: ESP32FileName,
            ESP8266_file_name: ESP8266FileName
        }
        await firmwareVersionModel.insert(uploadPayload);

        fs.unlinkSync(pathESP32);
        fs.unlinkSync(pathESP8266);
        res.redirect('/firmware');
    } catch (err) {
        res.status(500).json({ message: "Error updating new post", error: err })
    }

});

/* Download ESP8266 firmware */
router.get('/download/ESP8266/:version', async function (req, res, next) {
    try {
        const version = req.params.version;
        const data = await firmwareVersionModel.getByVersion(version);
        const ESP8266Location = data[0].ESP8266_url;

        return res.redirect(ESP8266Location);    
    } catch (err) {
        res.status(500).json({ message: "Error downloading ESP8266 firmware", error: err })
    }
});

/* Download ESP32 firmware */
router.get('/download/ESP32/:version', async function (req, res, next) {
    try {
        const version = req.params.version;
        const data = await firmwareVersionModel.getByVersion(version);
        const ESP32Location = data[0].ESP32_url;

        return res.redirect(ESP32Location);
    } catch (err) {
        res.status(500).json({ message: "Error downloading ESP32 firmware", error: err })
    }
});


/* Delete firmware version */
router.delete('/:version', async function (req, res, next) {
    try {
        const version = req.params.version;

        const data = await firmwareVersionModel.getByVersion(version);
        const ESP8266FileName = data[0].ESP8266_file_name;
        const ESP32FileName = data[0].ESP32_file_name;

        await s3_service.remove(ESP8266FileName);
        await s3_service.remove(ESP32FileName);

        await firmwareVersionModel.deleteByVersion(version);

        res.status(200).json({ message: "delete success" });
    } catch (err) {
        res.status(500).json({ message: "delete failed", error: err });
    }
});

module.exports = router;