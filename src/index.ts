import Websocket from "ws";
import { DISCORD_GATEWAY_URL, DISCORD_STATUS, DISCORD_USER_TOKEN, RECONNECT_GATEWAY_DELAY_MS } from "./const";
import { type InitialGatewayResponse, GatewayOperationCode, ActivityType, type DiscordGatewayScheme } from "./gateway/types";
import { delay } from "./utils/delay";

function isInitialGatewayResponse(message:any):message is InitialGatewayResponse {
    return message.op === GatewayOperationCode.HELLO;
}

function establishConnection() {
    const client = new Websocket(DISCORD_GATEWAY_URL);

    return new Promise<void>((resolve, reject) => {
        client.on("error", (error) => {
            reject(error);
        });
        
        client.on("close", (code, reason) => {
            reject(`Websocket closed - ${code}:${reason}`);
        });

        client.addEventListener("message", async (event) => {  
            const data = JSON.parse(event.data.toString());
            
            if (!isInitialGatewayResponse(data)) {
                return;
            }

            const { d: { heartbeat_interval } } = data;
        
            const auth_data:DiscordGatewayScheme<any> = {
                op: GatewayOperationCode.IDENTIFY,
                d: {
                    token: DISCORD_USER_TOKEN,
                    properties: {
                        $os: "Windows 10",
                        $browser: "Google Chrome",
                        $device: "Windows",
                    },
                    presence: { status: DISCORD_STATUS, afk: false },
                },
            };
    
            client.send(JSON.stringify(auth_data));
    
            const update_presence_data:DiscordGatewayScheme<any> = {
                op: GatewayOperationCode.PRESENCE,
                d: {
                    since: 0,
                    activities: [{
                        "type": ActivityType.LISTENING,
                        "name": "Schizophrenic Lives Matter",
                    }],
                    status: DISCORD_STATUS,
                    afk: false,
                },
            };
    
            client.send(JSON.stringify(update_presence_data));

            await delay(heartbeat_interval);
    
            const heartbeat_data:DiscordGatewayScheme<any> = { op: GatewayOperationCode.HEARTBEAT, d: null };

            client.send(JSON.stringify(heartbeat_data));

            resolve();
        });
    });
}

const autoEstablishConnection = async () => {
    console.log("Reconnecting to gateway...");
    await establishConnection();
    setTimeout(autoEstablishConnection, RECONNECT_GATEWAY_DELAY_MS);
};

await autoEstablishConnection();