var express = require('express');
var router = express.Router();

const moment = require('moment');
const fs = require('fs')
const firmwareControlModel = require('../database/model/firmwareControlModel');
const firmwareVersionModel = require('../database/model/firmwareVersionModel');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });
const sha256File = require('sha256-file');
const s3_service = require('../services/s3-upload');
const spotsModel = require('../database/model/spotsModel');

router.get('/', async function(req, res, next) {
    try{
        const firmwareControl = await firmwareControlModel.get();
        const data = await firmwareVersionModel.getWithNumSpots();
    
        res.render('page/firmwareControl/firmwareControl.ejs', {title:"ProkoPark - Firmware Control", firmwareControl, data, moment});
    }catch(err){
        res.send(err)
    }
});

router.post('/upload', upload.fields([{name: 'ESP32'},{name: 'ESP8266'}, ]), async function(req, res, next) {
    try{
        const {ESP32, ESP8266} = req.files;
        if(ESP32 == undefined || ESP8266 == undefined || req.body.version == '') {
            return res.send('All fields are required');
        }
        if(await firmwareVersionModel.exists(req.body.version)) {
            return res.send('Version already exists');
        }

        const version = req.body.version
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
        firmwareVersionModel.insert(uploadPayload);

        fs.unlinkSync(pathESP32);
        fs.unlinkSync(pathESP8266);
        return res.redirect('/firmware');
    } catch(err) {
        console.log(err);
    }
    
});

router.get('/download/ESP8266/:version', async function(req, res, next) {
    const version = req.params.version;
    const data = await firmwareVersionModel.getByVersion(version);
    return res.redirect(data[0].ESP8266_url);    
});

router.get('/download/ESP32/:version', async function(req, res, next) {
    const version = req.params.version;
    const data = await firmwareVersionModel.getByVersion(version);
    return res.redirect(data[0].ESP32_url);    
});


router.delete('/:version', async function(req, res, next) {
    try{
        const version = req.params.version;

        const data = await firmwareVersionModel.getByVersion(version);
        const ESP8266FileName = data[0].ESP8266_file_name;
        const ESP32FileName = data[0].ESP32_file_name;
    
        await s3_service.remove(ESP8266FileName);
        await s3_service.remove(ESP32FileName);
    
        await firmwareVersionModel.deleteByVersion(version);
    
        res.status(200).json({message: 'delete success'});
    } catch(err) {
        res.status(502).json({message: err});
    }
});

router.put('/spots', async function (req, res, next) {
    try{
        const version = req.body.version;
        const lotId = req.body.lotId;
        let spot_hashes;
        if(req.body.spot_hash === undefined){
            spot_hashes = await spotsModel.getSpotHashesByLotId(lotId);
        } else{
            spot_hashes = JSON.parse(req.body.spot_hash);
        }
        const uploadPayload = {
            available_firmware_version: version,
        }
        const update_stat = await spotsModel.update(spot_hashes, uploadPayload);
        if(update_stat.status === 'failed') {
            return res.status(502).json({message: 'Update failed', payload: update_stat.payload});
        }
        res.status(200).json({message: 'Update success', lotId: lotId});
    } catch(err) {
        res.status(502).json({message: err});
    }
});



module.exports = router;