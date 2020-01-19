var fetch = require("node-fetch");

export default class Provider
{
    address = () => `http:\/\/${this.ip}:${this.port}`

    constructor(ip, port)
    {
        this.ip = ip;
        this.port = port;
    }

    request(path, plain, noresp, config)
    {
        console.log(config.method + " - " + path);
        var reqConfig =
        {
            ...config,
            mode: 'no-cors'
        };

        return fetch(`${this.address()}\/rest${path}`, reqConfig)
              .then(this.handle(plain, noresp));
    }

    handle(plain, noresp)
    {
        return (response) =>
        {
            if (noresp) return 200;

            if (plain)
                return response.text();

            return response.json();
        }
    }

    get(path, plain = false, noresp = false)
    {
        return this.request(path, plain, noresp,
        {
            method: 'get'
        });
    }

    delete(path, plain = false, noresp = true)
    {
        return this.request(path, plain, noresp,
        {
            method: 'delete'
        });
    }

    put(path, plain = false, noresp = true, data = null)
    {
        return this.request(path, plain, noresp,
        {
            "headers": { "content-type": plain ? "text/plain" : "application/json" },
            "method": 'put',
            "body": plain ? data : JSON.stringify(data)
        });
    }

    post(path, plain = false, noresp = true, data = null)
    {
        return this.request(path, plain, noresp,
        {
            "headers": { "content-type": plain ? "text/plain" : "application/json" },
            "method": 'post',
            "body": plain ? data : JSON.stringify(data)
        });
    }


};
