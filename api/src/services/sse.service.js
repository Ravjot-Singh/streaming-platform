const subscribers = new Map();
const globalSubscribers = new Set();

export function subscribe(channelName, res) {

    if (!subscribers.has(channelName)) {
        subscribers.set(channelName, new Set());
    }

    subscribers.get(channelName).add(res);

}


export function unsubscribe(channelName, res) {

    subscribers.get(channelName)?.delete(res);

}

export function subscribeGlobal(res) {
    globalSubscribers.add(res);
}

export function unsubscribeGlobal(res) {
    globalSubscribers.delete(res);
}

export function broadcast(channelName, data) {

    const payload = `data: ${JSON.stringify(data)}\n\n`;

    const subs = subscribers.get(channelName);
    if (subs) {

        for (const res of subs) {

            res.write(payload);
        }
    }

    for (const res of globalSubscribers) {

        res.write(payload);
    }

}