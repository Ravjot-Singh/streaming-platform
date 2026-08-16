import * as StreamService from '../services/stream.service.js';

export async function validate(req, res) {
    try {


        const channelName = req.body.name;

        const providedKey = req.body.key;

        if (!channelName) {

            return res.status(400).send('Missing channel name');
        }

        await StreamService.validatePublish(channelName, providedKey);

        res.status(200).send('OK');
    } catch (err) {

        res.status(err.status || 500).send(err.message || 'Rejected');
    }
}

export async function end(req, res) {
    const channelName = req.body.name;
    if (channelName) {
        await StreamService.endPublish(channelName);
    }

    res.status(200).send('OK');
}


export async function resetAll(req, res) {

    const result = await StreamService.resetAllLiveStatus();

    res.status(200).json(result);
}