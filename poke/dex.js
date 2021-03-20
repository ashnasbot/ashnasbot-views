var channel = "";
function getChannel() {
    if (channel != "") {
        return channel;
    }
    const urlParams = new URLSearchParams(window.location.search);
    channel = urlParams.get('channel');
    return channel;
}

new Vue({
    el: '#dex',
    props: ['client', 'incoming'],
    data: {
        channel: getChannel(),
        dex: null
    },
    computed: {
        count: function () {
            return Object.values(this.dex).filter((v) => v).length;
        }
    },
    methods: {
        async get_dex(channel) {
            return fetch(`/dex?channel=${this.channel}`).then(resp => {return resp.json()});
        }
    },
    async created () {
        const dex = await this.get_dex(this.channel)
        this.dex = dex
        makeNoise()
        setInterval(async (dt) => {
            const dex = await this.get_dex(this.channel)
            this.dex = dex
        }, 5000)
    },
});

function makeNoise() {
    var audioCtx;
    if (window.webkitAudioContext) {
        audioCtx = new window.webkitAudioContext();
    } else {
        audioCtx = new window.AudioContext();
    }

    source = audioCtx.createBufferSource();
    request = new XMLHttpRequest();

    request.open('GET', 'hall-of-fame.mp3', true);

    request.responseType = 'arraybuffer';

    request.onload = function () {
        var audioData = request.response;

        audioCtx.decodeAudioData(audioData, function (buffer) {
            myBuffer = buffer;
            source.buffer = myBuffer;
            source.connect(audioCtx.destination);
            source.loop = true;
            source.start(0);
        },
            (e) => { "Error with decoding audio data" + e.err; });
    }

    request.send();
}