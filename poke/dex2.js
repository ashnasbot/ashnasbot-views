var channel = "";
function getChannel() {
    if (channel != "") {
        return channel;
    }
    const urlParams = new URLSearchParams(window.location.search);
    channel = urlParams.get('channel');
    return channel;
}

missing = ["8", "9", "17", "18", "57",
           "73", "78", "87", "91", "97",
           "101", "105", "108", "112", "128",
           "137", "139", "141", "148", "149",
           "150", "151"]

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
        this.dex = Object.keys(dex)
            .filter(key => missing.includes(key))
            .reduce((obj, key) => {
                obj[key] = dex[key];
                return obj;
            }, {});
        
        setInterval(async (dt) => {
            const dex = await this.get_dex(this.channel)
            this.dex = Object.keys(dex)
                .filter(key => missing.includes(key))
                .reduce((obj, key) => {
                    obj[key] = dex[key];
                    return obj;
                }, {});
        }, 5000)
    },
});